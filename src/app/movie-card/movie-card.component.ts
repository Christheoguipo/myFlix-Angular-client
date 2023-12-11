/**
 * @fileoverview 
 * Movie Card Component represents the movie card, displaying a list of movies.
 * It allows users to navigate to their profile, log out, and view movie details through dialogs.
 * 
 * @module Movie Cards
 */

import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovieGenreComponent } from '../movie-genre/movie-genre.component';
import { MovieDirectorComponent } from '../movie-director/movie-director.component';
import { MovieDescriptionComponent } from '../movie-description/movie-description.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Fetches all movies and updates the movies array.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

  /**
   * Navigates to the user profile page.
   */
  navigateProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Logs out the user and navigates to the welcome page.
   */
  logout(): void {
    this.fetchApiData.userLogout();
    this.router.navigate(['welcome']);
  }

  /**
   * Opens a dialog to display movie genres.
   * @param movie - The movie object.
   */
  openMovieGenreDialog(movie: any): void {
    this.dialog.open(MovieGenreComponent, {
      data: movie,
    });
  }

  /**
   * Opens a dialog to display movie directors.
   * @param movie - The movie object.
   */
  openMovieDirectorDialog(movie: any): void {
    this.dialog.open(MovieDirectorComponent, {
      data: movie,
    });
  }

  /**
   * Opens a dialog to display movie descriptions.
   * @param movie - The movie object.
   */
  openMovieDescriptionDialog(movie: any): void {
    this.dialog.open(MovieDescriptionComponent, {
      data: movie,
    });
  }

  /**
   * Checks if a movie is in the user's favorite movies.
   * @param movieID - The ID of the movie.
   * @returns A boolean indicating whether the movie is a favorite.
   */
  isFavoriteMovie(movieID: string): boolean {
    return this.fetchApiData.getUserFavoriteMovies().includes(movieID);
  }

  /**
   * Toggles a movie between favorite and non-favorite states.
   * @param movieID - The ID of the movie.
   */
  toggleFavorite(movieID: string): void {
    const isFavorite = this.isFavoriteMovie(movieID);

    if (isFavorite) {
      this.fetchApiData.removeMovieFromFavorites(movieID)
        .subscribe(
          (data) => {
            this.snackBar.open("Movie removed from user's favorites.", 'OK', {
              duration: 2000
            });
          },
          (error) => {
            console.error('Error removing from favorites:', error);
          }
        );
    } else {
      this.fetchApiData.addMovieToFavorites(movieID)
        .subscribe(
          (data) => {
            this.snackBar.open("Movie added to user's favorites.", 'OK', {
              duration: 2000
            });
          },
          (error) => {
            console.error('Error adding to favorites:', error);
          }
        );
    }
  }
}

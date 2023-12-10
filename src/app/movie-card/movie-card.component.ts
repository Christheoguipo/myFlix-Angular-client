import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// This import is used to display notifications back to the user
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
  // this is to hide or show the toolbar
  opened: boolean = false;

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

  navigateProfile(): void {
    this.router.navigate(['profile']);
  }

  logout(): void {
    this.fetchApiData.userLogout();
    this.router.navigate(['welcome']);
  }

  openMovieGenreDialog(movie: any): void {
    this.dialog.open(MovieGenreComponent, {
      data: movie,
    });
  }

  openMovieDirectorDialog(movie: any): void {
    this.dialog.open(MovieDirectorComponent, {
      data: movie,
    });

  }

  openMovieDescriptionDialog(movie: any): void {
    this.dialog.open(MovieDescriptionComponent, {
      data: movie,
    });
  }

  isFavoriteMovie(movieID: string): boolean {
    return this.fetchApiData.getUserFavoriteMovies().includes(movieID);
  }

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
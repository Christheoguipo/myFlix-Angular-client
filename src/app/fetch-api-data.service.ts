/**
 * @fileoverview Fetch API Data Service handles communication with the backend API to fetch and update data.
 * 
 * @module Fetch API
 */

import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

/**
 * API base URL.
 */
const apiUrl = 'https://retro-movie-vault-5ccf6999c998.herokuapp.com/';

/**
 * @class FetchApiDataService
 * @description Service to interact with the backend API for data retrieval and updates.
 */
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }

  /**
   * @method userRegistration
   * @description Makes an API call to register a new user.
   * @param userDetails - User registration details.
   * @returns Observable<any>
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * @method handleError
   * @description Handles HTTP error responses and logs appropriate messages.
   * @param error - HTTP error response.
   * @returns Observable<never>
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }

    if (error.error.errors) {
      return throwError(error.error.errors[0].msg);
    } else {
      return throwError(error.error);
    }
  }

  /**
 * @method userLogin
 * @description Makes an API call to authenticate and log in a user.
 * @param userDetails - User login details.
 * @returns Observable<any>
 */
  userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails)
      .pipe(
        tap((result: any) => {
          localStorage.clear();
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('token', result.token);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * @method userLogout
   * @description Logs out the current user by clearing local storage.
   * @returns void
   */
  userLogout(): void {
    localStorage.clear();
  }

  /**
   * @method getUser
   * @description Retrieves user details from the API using the stored token.
   * @returns Observable<any>
   */
  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    return this.http.get<Response>(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @method updateUser
   * @description Updates user information on the server.
   * @param userData - New user data to be updated.
   * @returns Observable<any>
   */
  updateUser(userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    return this.http.put<Response>(
      apiUrl + 'users/' + user.Username,
      JSON.stringify(userData),
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }),
      }
    ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @method getGenre
   * @description Retrieves movies of a specific genre from the API.
   * @param genreName - Name of the genre to retrieve.
   * @returns Observable<any>
   */
  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<Response>(
      apiUrl + 'movies/genre/' + genreName,
      {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        })
      }
    ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @method getDirector
   * @description Retrieves movies directed by a specific director from the API.
   * @param directorName - Name of the director to retrieve movies for.
   * @returns Observable<any>
   */
  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<Response>(
      apiUrl + 'directors/' + directorName,
      {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        })
      }
    ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @method getUserFavoriteMovies
   * @description Retrieves the list of user's favorite movies.
   * @returns any[] - Array of movie IDs.
   */
  getUserFavoriteMovies(): any[] {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    return user ? user.FavoriteMovies || [] : [];
  }


  /**
 * @method addMovieToFavorites
 * @description Adds a movie to the user's list of favorite movies.
 * @param movieID - ID of the movie to be added to favorites.
 * @returns Observable<any>
 */
  addMovieToFavorites(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    return this.http.post(
      apiUrl + 'users/' + user.Username + '/movies/' + movieID,
      {}, // Always add the body for http.post method even if it's blank 
      {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      }
    ).pipe(
      tap((result: any) => {
        localStorage.setItem('user', JSON.stringify(result));
      }),
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @method removeMovieFromFavorites
   * @description Removes a movie from the user's list of favorite movies.
   * @param movieID - ID of the movie to be removed from favorites.
   * @returns Observable<any>
   */
  removeMovieFromFavorites(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    return this.http.delete(
      apiUrl + 'users/' + user.Username + '/movies/' + movieID,
      {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      }
    ).pipe(
      tap((result: any) => {
        localStorage.setItem('user', JSON.stringify(result));
      }),
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @method getAllMovies
   * @description Retrieves a list of all movies from the API.
   * @returns Observable<any>
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<Response>(
      apiUrl + 'movies',
      {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      }
    ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @method getMovie
   * @description Retrieves details of a specific movie from the API.
   * @param movieName - Name of the movie to retrieve.
   * @returns Observable<any>
   */
  getMovie(movieName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<Response>(
      apiUrl + 'movies/' + movieName,
      {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      }
    ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @method deleteUser
   * @description Deletes a user account from the API.
   * @param userName - Username of the user to be deleted.
   * @returns Observable<any>
   */
  deleteUser(userName: string): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.delete<Response>(
      apiUrl + 'users/' + userName,
      {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      }
    ).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * @method extractResponseData
   * @description Extracts non-typed response data from the HTTP response.
   * @param res - HTTP Response object.
   * @returns any
   * @private
   */
  private extractResponseData(res: Response): any {
    const body = res;
    return body || {};
  }
}

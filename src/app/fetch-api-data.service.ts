import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://retro-movie-vault-5ccf6999c998.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }
  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

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

  // Login user
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

  // Logout user
  userLogout(): void {
    localStorage.clear();
  }

  // Get User
  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    const user = storedUser ? JSON.parse(storedUser) : null;

    return this.http.get<Response>(apiUrl + 'users/' + user.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Update user
  updateUser(userData: any): Observable<any> {

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    const user = storedUser ? JSON.parse(storedUser) : null;

    return this.http.put<Response>(apiUrl + 'users/' + user.Username,
      JSON.stringify(userData),
      {
        headers: new HttpHeaders(
          {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }),
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  // Get Genre
  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<Response>(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get director
  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<Response>(apiUrl + 'directors/' + directorName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }


  // Get User's Favorite movies 
  getUserFavoriteMovies(): any[] {

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    return user ? user.FavoriteMovies || [] : [];

  }

  // Add a movie to user's favorites
  addMovieToFavorites(movieID: string): Observable<any> {

    const token = localStorage.getItem('token');
    console.log('token', token);
    const storedUser = localStorage.getItem('user');
    console.log('storedUser', storedUser);
    const user = storedUser ? JSON.parse(storedUser) : null;
    console.log('user', user);

    console.log('movieid', movieID);

    return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movieID,
      {}, // Always add the body for http.post method even if it's blank 
      {
        headers: new HttpHeaders(
          {
            Authorization: 'Bearer ' + token,
          }),
      })
      .pipe(
        tap((result: any) => {
          localStorage.setItem('user', JSON.stringify(result));
          console.log('pipe Add', result);
        }),
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  // Remove a movie from user's favorites
  removeMovieFromFavorites(movieID: string): Observable<any> {

    const token = localStorage.getItem('token');
    console.log('token', token);
    const storedUser = localStorage.getItem('user');
    console.log('storedUser', storedUser);
    const user = storedUser ? JSON.parse(storedUser) : null;
    console.log('user', user);

    console.log('movieid', movieID);

    return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/' + movieID, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
    })
      .pipe(
        tap((result: any) => {
          localStorage.setItem('user', JSON.stringify(result));
          console.log('pipe remove', result);
        }),
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  // Get All movies
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<Response>(apiUrl + 'movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Get movie
  getMovie(movieName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<Response>(apiUrl + 'movies/' + movieName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Delete User
  deleteUser(userName: string): Observable<any> {

    const token = localStorage.getItem('token');

    return this.http.delete<Response>(apiUrl + 'users/' + userName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Non-typed response extraction
  private extractResponseData(res: Response): any {
    const body = res;
    return body || {};
  }

}

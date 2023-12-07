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
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Login user
  userLogin(userDetails: any): Observable<any> {

    // console.log(userDetails);

    return this.http.post(apiUrl + 'login', userDetails).pipe(
      tap((result: any) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);

      }),
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
    return throwError(
      'Something bad happened; please try again later.');
  }


  // // Register user
  // registerUser(): Observable<any> {

  //   const data = {
  //     Username: "UsernamePlaceholder",
  //     Email: "EmailPlaceholder",
  //     Password: "PasswordPlaceholder",
  //     Birthday: "BirthdayPlaceholder",
  //   };

  //   return this.http.post<Response>(apiUrl + 'users', {
  //     headers: new HttpHeaders(
  //       {
  //         "Content-Type": "application/json"
  //       }),
  //     method: "POST",
  //     body: JSON.stringify(data),

  //   }).pipe(
  //     map(this.extractResponseData),
  //     catchError(this.handleError)
  //   );
  // }

  // // Login user
  // loginUser(): Observable<any> {

  //   const data = {
  //     Username: "UsernamePlaceholder",
  //     Password: "PasswordPlaceholder",
  //   };

  //   return this.http.post<Response>(apiUrl + 'login', {
  //     headers: new HttpHeaders(
  //       {
  //         "Content-Type": "application/json"
  //       }),
  //     method: "POST",
  //     body: JSON.stringify(data),

  //   }).pipe(
  //     map(this.extractResponseData),
  //     catchError(this.handleError)
  //   );
  // }

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

  // Get User
  getUser(userName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<Response>(apiUrl + 'users/' + userName, {
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
  getUserFavoriteMovies(userName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<Response>(apiUrl + 'users/' + userName + '/movies', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Add a movie to user's favorites
  addMovieToFavorites(userName: string, movieID: string): Observable<any> {

    const token = localStorage.getItem('token');

    return this.http.post<Response>(apiUrl + 'users/' + userName + '/movies/' + movieID, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
      method: "POST",
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Update user
  updateUser(userName: string): Observable<any> {

    const token = localStorage.getItem('token');

    const data = {
      Username: "UsernamePlaceholder",
      Email: "EmailPlaceholder",
      Password: "PasswordPlaceholder",
      Birthday: "BirthdayPlaceholder",
    };

    return this.http.put<Response>(apiUrl + 'users/' + userName, {
      headers: new HttpHeaders(
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }),
      method: "POST",
      body: JSON.stringify(data),

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

  // Remove a movie from user's favorites
  removeMovieFromFavorites(userName: string, movieID: string): Observable<any> {

    const token = localStorage.getItem('token');

    return this.http.delete<Response>(apiUrl + 'users/' + userName + '/movies/' + movieID, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        }),
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

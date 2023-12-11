/**
 * @fileoverview User Login Form Component handles user login functionality.
 * 
 * @module User Login Form
 */

import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {

  /**
   * Input decorator for userData property, representing the user input for login credentials.
   * @property {Object} userData - Object containing the user's username and password.
   */
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void { }

  /**
   * Function responsible for sending user login form inputs to the backend.
   * Handles success and failure scenarios, displaying appropriate notifications.
   * @method
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        // Logic for a successful user login goes here
        this.dialogRef.close(); // This will close the modal on success!
        console.log(result);

        this.snackBar.open('Signed in successfully.', 'OK', {
          duration: 2000
        });

        this.router.navigate(['movies']);
      },
      (result) => {
        console.log(result);
        this.snackBar.open('Invalid login. Please check your username and/or password.', 'OK', {
          duration: 2000
        });
      }
    );
  }
}

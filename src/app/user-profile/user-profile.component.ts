/**
 * @fileoverview User Profile Component is responsible for displaying and updating user profile information.
 * 
 * @module User Profile
 */

import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  user: any = null;

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.viewUserProfile();
  }

  /**
   * Retrieves user profile information from the backend and populates the component's data.
   */
  viewUserProfile(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      this.populateUserData();
    });
  }

  /**
   * Navigates to the user profile page.
   */
  navigateProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Logs the user out and navigates to the welcome page.
   */
  logout(): void {
    this.fetchApiData.userLogout();
    this.router.navigate(['welcome']);
  }

  /**
   * Populates the user data object with information from the retrieved user object.
   */
  populateUserData(): void {
    this.userData = {
      Username: this.user.Username,
      Password: '',
      Email: this.user.Email,
      Birthday: this.user.Birthday
    };
  }

  /**
   * Updates the user profile information by making an API call.
   * Displays notifications based on the success or failure of the update.
   */
  updateUser(): void {
    this.fetchApiData.updateUser(this.userData).subscribe((result) => {
      console.log(result);
      this.snackBar.open('User updated successfully.', 'OK', {
        duration: 2000
      });
      this.router.navigate(['welcome']);
    }, (result) => {
      console.log(result);
      this.snackBar.open('Update failed. Please check your entry.', 'OK', {
        duration: 2000
      });
    });
  }

  /**
   * Navigates to the movies page.
   */
  navigateToMovies(): void {
    this.router.navigate(['movies']);
  }
}

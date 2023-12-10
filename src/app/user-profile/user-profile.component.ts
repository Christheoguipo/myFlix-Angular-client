import { Component, OnInit, Input } from '@angular/core';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
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

  // This is the function responsible for sending the form inputs to the backend
  viewUserProfile(): void {

    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      this.populateUserData();
    });

  }

  navigateProfile(): void {
    this.router.navigate(['profile']);
  }

  logout(): void {
    this.fetchApiData.userLogout();
    this.router.navigate(['welcome']);
  }

  populateUserData(): void {

    this.userData = {
      Username: this.user.Username,
      Password: '',
      Email: this.user.Email,
      Birthday: this.user.Birthday
    };

  }

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

  navigateToMovies(): void {
    this.router.navigate(['movies']);
  }

}

/**
 * @fileoverview 
 * Movie Description Component displays detailed information about a movie in a dialog.
 * It receives movie data as input and allows the user to close the dialog.
 * 
 * @module Movie Description Dialog
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-description',
  templateUrl: './movie-description.component.html',
  styleUrls: ['./movie-description.component.scss']
})
export class MovieDescriptionComponent {

  movie: any;

  constructor(
    public dialogRef: MatDialogRef<MovieDescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { movie: any }
  ) {
    this.movie = data;
  }

  /**
   * @method closeDialog
   * @description Closes the dialog.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}

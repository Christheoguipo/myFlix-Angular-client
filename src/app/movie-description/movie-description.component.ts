import { Component, Inject } from '@angular/core';
// This import will close the dialog on success
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
    this.movie = data
  }


  closeDialog(): void {
    this.dialogRef.close();
  }
}

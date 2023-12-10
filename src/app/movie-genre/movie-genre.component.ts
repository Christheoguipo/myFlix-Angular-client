import { Component, Inject } from '@angular/core';
// This import will close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-genre',
  templateUrl: './movie-genre.component.html',
  styleUrls: ['./movie-genre.component.scss']
})
export class MovieGenreComponent {

  movie: any;

  constructor(
    public dialogRef: MatDialogRef<MovieGenreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { movie: any }
  ) {
    this.movie = data
  }


  closeDialog(): void {
    this.dialogRef.close();
  }
}

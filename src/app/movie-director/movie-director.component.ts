import { Component, Inject } from '@angular/core';
// This import will close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-director',
  templateUrl: './movie-director.component.html',
  styleUrls: ['./movie-director.component.scss']
})
export class MovieDirectorComponent {
  movie: any;

  constructor(
    public dialogRef: MatDialogRef<MovieDirectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { movie: any }
  ) {
    this.movie = data
    console.log(data)
  }


  closeDialog(): void {
    this.dialogRef.close();
  }
}

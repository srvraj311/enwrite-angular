import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'custom-message-dialog',
  templateUrl: './custom-message-dialog.html',
  styleUrls: ['./custom-message-dialog.css'],
})
export class CustomMessageDialog {
  constructor(
    public dialogRef: MatDialogRef<CustomMessageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}

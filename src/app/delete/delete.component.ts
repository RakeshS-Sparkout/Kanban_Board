import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'; 
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule
  ],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css'
})
export class DeleteComponent {

  taskTitle: string;

  constructor(public dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {taskTitle : string, taskId: string}
  ) {
    this.taskTitle = data.taskTitle;

  }

  onConfirm(): void {
    this.dialogRef.close(this.data.taskId);
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

}

import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../task/task.service';
import { Task } from '../task/task';
import { TaskDialogData } from '../task/taskDialogData';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    CommonModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  taskForm: FormGroup;
  isEditMode: boolean;
  priorityOptions: string[] = ['urgent', 'high', 'medium', 'low'];
  statusOptions: string[] = ['todo', 'inProgress', 'done', 'testing', 'deployed'];

  constructor(
    private taskService: TaskService,
    private dialogRef: MatDialogRef<DialogComponent>,
    private snackBar: MatSnackBar, // Inject MatSnackBar
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) {
    this.isEditMode = !!data.task;
    this.taskForm = new FormGroup({
      title: new FormControl(data.task?.title || '', Validators.required),
      description: new FormControl(data.task?.description || '', Validators.required),
      dueDate: new FormControl(data.task?.dueDate || '', Validators.required),
      priority: new FormControl(data.task?.priority || '', Validators.required),
      status: new FormControl(data.task?.status || '', Validators.required)
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData: Task = {
        ...this.taskForm.value,
        id: this.isEditMode ? this.data.task!.id : this.generateUniqueId(),
      };

      if (this.isEditMode) {
        this.taskService.updateTask(this.data.task!.id, taskData).subscribe(() => {
          this.showSnackBar('Task updated successfully');
          this.dialogRef.close(true);
        });
      } else {
        this.taskService.createTask(taskData).subscribe(() => {
          this.showSnackBar('Task added successfully');
          this.dialogRef.close(true);
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    }).onAction().subscribe(() => {
      this.snackBar.dismiss();
    });
  }
}

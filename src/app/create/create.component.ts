import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TaskService } from '../task/task.service';
import { Task } from '../task/task';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create',
  standalone: true,
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    CommonModule
  ]
})
export class CreateComponent {
  taskForm: FormGroup;

  // Priority options
  priorityOptions: string[] = ['urgent', 'high', 'medium', 'low'];

  constructor(
    private taskService: TaskService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [new Date(), Validators.required],  // Initial value as current date
      priority: ['low', Validators.required]  // Default value
    });
  }

  createTask(): void {
    if (this.taskForm.valid) {
      const newTask: Task = { ...this.taskForm.value, status: 'todo' };
      this.taskService.createTask(newTask).subscribe(() => {
        this.router.navigate(['/']);  // Navigate to home or task list after creation
      });
    }
  }
}

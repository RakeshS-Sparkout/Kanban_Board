import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../task/task.service';
import { Task } from '../task/task';

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
    ReactiveFormsModule
  ]
})
export class CreateComponent {
  taskForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: [new Date(), Validators.required],
      // Status is not included in the form and will be set to 'todo' by default
    });
  }

  createTask(): void {
    if (this.taskForm.valid) {
      const newTask: Task = { ...this.taskForm.value, status: 'todo' };
      this.taskService.createTask(newTask).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}

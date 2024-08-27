import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../task/task.service';
import { Task } from '../task/task';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit',
  standalone: true,
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule, 
    MatNativeDateModule, 
    MatButtonModule, 
    MatCardModule
  ]
})
export class EditComponent implements OnInit {
  taskForm: FormGroup;
  taskId: string; // Changed to string

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private fb: FormBuilder
  ) {
    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTask();
  }

  loadTask(): void {
    if (this.taskId) {
      this.taskService.getTask(this.taskId).subscribe(task => {
        if (task) {
          console.log('Fetched Task:', task); // Log task details
          this.taskForm.patchValue({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate ? new Date(task.dueDate) : null // Convert to Date object
          });
        } else {
          console.error('Task not found');
          this.router.navigate(['/home']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const updatedTask: Task = {
        ...this.taskForm.value,
        id: this.taskId // Ensure ID is included for update
      };
      console.log('Updated Task:', updatedTask); // Log updated task details
      this.taskService.updateTask(this.taskId, updatedTask).subscribe(() => {
        this.router.navigate(['/home']);
      });
    }
  }
}

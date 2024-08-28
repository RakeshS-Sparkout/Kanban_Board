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
import { MatSelectModule } from '@angular/material/select';

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
    MatCardModule,
    MatSelectModule
  ]
})
export class EditComponent implements OnInit {
  taskForm: FormGroup;
  taskId: string;
  priorityOptions: string[] = ['urgent', 'high', 'medium', 'low'];
  originalStatus: string = '';  // Store the original status

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
      dueDate: ['', Validators.required],
      priority: ['low', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTask();
  }

  loadTask(): void {
    if (this.taskId) {
      this.taskService.getTask(this.taskId).subscribe(task => {
        if (task) {
          this.originalStatus = task.status;  // Capture the original status
          this.taskForm.patchValue({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
            priority: task.priority || 'low'
          });
        } else {
          this.router.navigate(['/home']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const updatedTask: Task = {
        ...this.taskForm.value,
        id: this.taskId,
        status: this.originalStatus  // Preserve the original status
      };
      this.taskService.updateTask(this.taskId, updatedTask).subscribe(() => {
        this.router.navigate(['/home']);
      });
    }
  }
}

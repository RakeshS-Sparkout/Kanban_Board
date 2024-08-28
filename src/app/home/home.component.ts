import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { TaskService } from '../task/task.service';
import { Task, TaskStatus } from '../task/task';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, MatButtonModule, MatCardModule, DragDropModule, NavbarComponent, ReactiveFormsModule, MatNativeDateModule, MatDatepickerModule, MatFormFieldModule, MatSelectModule, MatInputModule]
})
export class HomeComponent implements OnInit {
  tasks: { [key in TaskStatus]: Task[] } = {
    todo: [],
    inProgress: [],
    done: [],
    testing: [],
    deployed: []
  };
  displayTasks: { [key in TaskStatus]: Task[] } = {
    todo: [],
    inProgress: [],
    done: [],
    testing: [],
    deployed: []
  };
  statuses: TaskStatus[] = ['todo', 'inProgress', 'done', 'testing', 'deployed'];

  // Form Controls for filtering and sorting
  dateFilter = new FormControl(null);
  sortOrder = new FormControl('');

  // Define priority levels
  priorityOrder: { [key: string]: number } = {
    'urgent': 1,
    'high': 2,
    'medium': 3,
    'low': 4
  };

  priorityOptions = Object.keys(this.priorityOrder);

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
    this.dateFilter.valueChanges.subscribe(() => this.applyFiltersAndSorting());
    this.sortOrder.valueChanges.subscribe(() => this.applyFiltersAndSorting());
  }

  loadTasks(): void {
    this.statuses.forEach(status => {
      this.taskService.getTasksByStatus(status).subscribe(
        tasks => {
          this.tasks[status] = tasks;
          this.applyFiltersAndSorting(); // Apply filters and sorting after loading
        },
        error => {
          console.error(`Error fetching tasks for ${status}:`, error);
        }
      );
    });
  }

  applyFiltersAndSorting(): void {
    this.applyFilters();
    this.applySorting();
  }

  applyFilters(): void {
    const dueDate = this.dateFilter.value ? new Date(this.dateFilter.value).toDateString() : null;

    // Filter tasks by due date within each column
    this.statuses.forEach(status => {
      this.displayTasks[status] = this.tasks[status].filter(task => {
        return (!dueDate || new Date(task.dueDate).toDateString() === dueDate) && task.status === status;
      });
    });
  }

  applySorting(): void {
    const selectedPriority = this.sortOrder.value;

    this.statuses.forEach(status => {
      // If a priority is selected, filter tasks by the selected priority
      if (selectedPriority) {
        this.displayTasks[status] = this.displayTasks[status].filter(task => task.priority === selectedPriority);
      }

      // Sort tasks by priority within each status column
      this.displayTasks[status].sort((a, b) => {
        return this.priorityOrder[a.priority] - this.priorityOrder[b.priority];
      });
    });
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      // Reorder tasks within the same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Transfer tasks between columns
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id as TaskStatus;

      if (task.status !== newStatus) {
        // Update task status only when moved between columns
        task.status = newStatus;

        // Transfer task between columns
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

        // Update the task status in the backend
        this.updateTasksInBackend(task);
      }
    }

    // Refresh the page to ensure tasks are correctly displayed
    window.location.reload();
  }

  updateTasksInBackend(task: Task): void {
    this.taskService.updateTask(task.id, task).subscribe(
      () => {
        console.log(`Task updated: ${task.id}`);
        // Optionally reapply filters and sorting after the task is updated
        // this.applyFiltersAndSorting();
      },
      error => {
        console.error(`Error updating task: ${task.id}`, error);
      }
    );
  }

  addTask(): void {
    this.router.navigate(['/create']);
  }

  editTask(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  deleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}

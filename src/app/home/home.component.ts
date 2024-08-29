import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
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
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskDialogData } from '../task/taskDialogData';
import { DeleteComponent } from '../delete/delete.component';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, MatButtonModule, MatCardModule, DragDropModule, NavbarComponent, ReactiveFormsModule, MatNativeDateModule, MatDatepickerModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatDialogModule, MatIconModule, MatChipsModule]
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

  constructor(private taskService: TaskService, private dialog: MatDialog, private cdr: ChangeDetectorRef) {}

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
    this.statuses.forEach(status => {
      let tasks = [...this.tasks[status]]; // Clone the array to avoid mutating the original

      // Apply sorting
      tasks.sort((a, b) => this.priorityOrder[a.priority] - this.priorityOrder[b.priority]);

      // Apply filters
      const dueDate = this.dateFilter.value ? new Date(this.dateFilter.value).toDateString() : null;
      if (dueDate) {
        tasks = tasks.filter(task => new Date(task.dueDate).toDateString() === dueDate);
      }

      if (this.sortOrder.value) {
        tasks = tasks.filter(task => task.priority === this.sortOrder.value);
      }

      this.displayTasks[status] = tasks;
    });

    this.cdr.detectChanges(); // Trigger change detection
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
        // Update task status in memory
        this.updateTaskInMemory(task, newStatus);

        // Transfer task between columns
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

        // Update the task status in the backend
        this.updateTaskInBackend(task);
      }
    }

    // Reapply filters and sorting after the drag
    this.applyFiltersAndSorting();
  }

  updateTaskInMemory(task: Task, newStatus: TaskStatus): void {
    // Remove the task from its current status array
    const currentTasks = this.tasks[task.status];
    const index = currentTasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      currentTasks.splice(index, 1);
    }

    // Add the task to the new status array
    task.status = newStatus;
    this.tasks[newStatus].push(task);

    // Reapply filters and sorting
    this.applyFiltersAndSorting();
  }

  updateTaskInBackend(task: Task): void {
    this.taskService.updateTask(task.id, task).subscribe(
      () => {
        console.log(`Task updated: ${task.id}`);
        // Optionally reapply filters and sorting after the task is updated
        // No need to call this.loadTasks() as we are handling it locally
      },
      error => {
        console.error(`Error updating task: ${task.id}`, error);
      }
    );
  }

  addTask(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: { task: null } as TaskDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  editTask(id: string): void {
    this.taskService.getTask(id).subscribe(task => {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '400px',
        data: { task } as TaskDialogData
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadTasks();
        }
      });
    });
  }

  openDeleteDialog(task: Task): void {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: '450px',
      height: '300px',
      data: { taskId: task.id, taskTitle: task.title }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTask(result); 
      }
    });
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

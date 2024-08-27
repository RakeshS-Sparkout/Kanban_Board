import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { TaskService } from '../task/task.service';
import { Task, TaskStatus } from '../task/task';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, MatButtonModule, MatCardModule, DragDropModule] // Ensure MatCardModule is included here
})
export class HomeComponent implements OnInit {
  tasks: { [key in TaskStatus]: Task[] } = {
    todo: [],
    inProgress: [],
    done: [],
    testing: [],
    deployed: []
  };
  statuses: TaskStatus[] = ['todo', 'inProgress', 'done', 'testing', 'deployed'];

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.statuses.forEach(status => {
      this.taskService.getTasksByStatus(status).subscribe(
        tasks => {
          this.tasks[status] = tasks;
        },
        error => {
          console.error(`Error fetching tasks for ${status}:`, error);
        }
      );
    });
  }

  drop(event: CdkDragDrop<Task[], Task[]>): void {
    const task = event.item.data as Task;
    const previousStatus = this.getTaskStatus(task);
    const newStatus = event.container.id as TaskStatus;

    if (previousStatus !== newStatus) {
      this.tasks[previousStatus] = this.tasks[previousStatus].filter(t => t.id !== task.id);
      task.status = newStatus;
      this.tasks[newStatus].push(task);

      this.updateTasksInBackend(task);
    }
  }

  getTaskStatus(task: Task): TaskStatus {
    return Object.keys(this.tasks).find(status => this.tasks[status].some(t => t.id === task.id)) as TaskStatus;
  }

  updateTasksInBackend(task: Task): void {
    this.taskService.updateTask(task.id, task).subscribe(() => {
      this.loadTasks();
    });
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
}

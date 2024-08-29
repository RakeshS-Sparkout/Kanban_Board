import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks'; // Adjust the URL as necessary

  constructor(private http: HttpClient) {}

  // Fetch all tasks
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Fetch a specific task by ID
  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // Create a new task
  createTask(task: Task): Observable<Task> {
    // Ensure ID is not empty for new tasks
    if (!task.id) {
      task.id = this.generateUniqueId(); // Generate ID if needed
    }
    return this.http.post<Task>(this.apiUrl, task);
  }

  // Update an existing task
  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  // Delete a task
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Fetch tasks by status
  getTasksByStatus(status: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?status=${status}`);
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9); // Simple unique ID generator
  }
}

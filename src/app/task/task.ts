export type TaskStatus = 'todo' | 'inProgress' | 'done' | 'testing' | 'deployed';

export interface Task {
  id?: string;
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
  priority: 'urgent' | 'high' | 'medium' | 'low';
}

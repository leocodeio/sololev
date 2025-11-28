export interface Task {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDto {
  title: string;
  date: string;
}

export interface UpdateTaskDto {
  title?: string;
  completed?: boolean;
}

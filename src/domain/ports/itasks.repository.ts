import { Task } from "src/domain/models/entities/task.entity";

export interface ITasksRepository {
  createTask(newTask: Task): Promise<Task>;
  getTaskById(taskId: string): Promise<Task | null>;
  getAllTasks(): Promise<Task[]>;
  updateTask(taskId: string, updateTaskDto: Partial<Task>): Promise<Task>;
  partiallyUpdateTask(taskId: string, updateTaskDto: Partial<Task>): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
}

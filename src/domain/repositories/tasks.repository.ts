import { Task } from "src/domain/models/task.entity";

export interface ITasksRepository {
  createTask(imagePath: string, price: number): Promise<Task>;
  getTaskById(taskId: string): Promise<Task | null>;
  getAllTasks(): Promise<Task[]>;
  updateTask(taskId: string, updateTaskDto: Partial<Task>): Promise<Task>;
  partiallyUpdateTask(taskId: string, updateTaskDto: Partial<Task>): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
}

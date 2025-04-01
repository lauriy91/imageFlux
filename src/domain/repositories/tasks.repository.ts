import { Task } from "../models/task.entity";

export interface ITasksRepository {
  createTask(task: Task): Promise<Task>;
  getTaskById(taskId: string): Promise<Task | null>;
}

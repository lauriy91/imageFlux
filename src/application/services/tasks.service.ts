import { Injectable } from "@nestjs/common";
import { Task } from "src/domain/models/task.entity";
import { ITasksRepository } from "src/domain/repositories/tasks.repository";
import { ImageProcessor } from "src/infrastructure/image-proccessing/image.processor";

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: ITasksRepository,
    private readonly imageProcessor: ImageProcessor
  ) {}

  async createTask(imagePath: string): Promise<Task> {
    const task = new Task();
    task.status = "pending";
    task.price = Math.random() * (50 - 5) + 5;
    task.originalPath = imagePath;
    task.createdAt = new Date();
    task.updatedAt = new Date();

    return await this.tasksRepository.createTask(task);
  }

  async processTask(taskId: string): Promise<Task> {
    const task = await this.tasksRepository.getTaskById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    try {
      // image proccessing
      const processedImages = await this.imageProcessor.process(task.originalPath);
      task.status = "completed";
      task.images = processedImages;
      task.updatedAt = new Date();
    } catch (error) {
      task.status = "failed";
      task.updatedAt = new Date();
    }

    return await this.tasksRepository.createTask(task);
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectId } from "mongodb";
import { Task } from "src/domain/models/entities/task.entity";
import { Repository } from "typeorm";
import { TasksRepository } from "src/infrastructure/adapters/tasks.repository.impl";
import { getRandomPrice } from "src/common/utils/utilities";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ImageProcessorService } from "./image-processor.service";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepositoryOrm: Repository<Task>,
    private readonly taskRepository: TasksRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly imageProcessorService: ImageProcessorService
  ) {}

  async createTask(createTaskDto: Partial<Task>): Promise<{ taskId: string; status: string; price: number }> {
    try {
      const newTask = {
        ...createTaskDto,
        _id: new ObjectId(),
        taskId: new ObjectId().toString(),
        status: createTaskDto.status ?? "pending",
        price: createTaskDto.price ?? getRandomPrice(),
        images: createTaskDto.images ?? [],
        originalPath: createTaskDto.originalPath ?? "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createdTask = await this.taskRepository.createTask(newTask);

      this.eventEmitter.emit('task.process', newTask.taskId, newTask.originalPath);

      return {
        taskId: createdTask.taskId,
        status: createdTask.status,
        price: createdTask.price,
      };
    } catch (error) {
      throw new Error(`Error creating task: ${error.message}`);
    }
  }

  async processTask(taskId: string, imagePath: string): Promise<void> {
    try {
      const processedImages = await this.imageProcessorService.processImage(imagePath);
      await this.taskRepository.updateTask(taskId, { status: 'completed', images: processedImages });
    } catch (error) {
      console.error(`Error procesando la imagen: ${error.message}`);
      await this.taskRepository.updateTask(taskId, { status: 'failed' });
    }
  }

  async getTask(taskId: string): Promise<{ taskId: string; status: string; price: number; images?: { path: string }[] }> {
    try {
      const task = await this.taskRepository.getTaskById(taskId);
      if (!task) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }
    
      const response: { taskId: string; status: string; price: number; images?: { path: string }[] } = {
        taskId: task.taskId,
        status: task.status,
        price: task.price,
      };
    
      if (task.status === "completed") {
        response.images = task.images.map(image => ({ path: image.path }));
      }
    
      return response;
    } catch (error) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepositoryOrm.find();
  }

  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.taskRepositoryOrm.findOne({ where: { taskId } });
    if (!task) throw new NotFoundException(`Task with id ${taskId} not found`);
    return task;
  }

  async updateTask(taskId: string, updateTaskDto: Partial<Task>): Promise<Task> {
    try {
      await this.taskRepository.updateTask(taskId, updateTaskDto);
      return await this.getTaskById(taskId);
    } catch (error) {
      throw new Error(`Error updating task: ${error.message}`);
    }
  }

  async partiallyUpdateTask(taskId: string, updateTaskDto: Partial<Task>): Promise<Task> {
    return await this.updateTask(taskId, updateTaskDto);
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      await this.taskRepository.deleteTask(taskId);
    } catch (error) {
      throw new Error(`Error deleting task: ${error.message}`);
    }
  }
}
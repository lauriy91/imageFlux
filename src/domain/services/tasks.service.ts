import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectId } from "mongodb";
import { Task } from "src/domain/models/entities/task.entity";
import { Repository } from "typeorm";
import { TasksRepository } from "src/infrastructure/adapters/tasks.repository.impl";
import { getRandomPrice } from "src/common/utils/utilities";
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ImageProcessorService } from "./image-processor.service";
import { CreateTaskDto, BaseResponseTaskDto, TaskStatus, ResponseDetailsTaskDto } from "src/application/dto/create-task.dto";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepositoryOrm: Repository<Task>,
    private readonly taskRepository: TasksRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly imageProcessorService: ImageProcessorService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<BaseResponseTaskDto> {
    try {
      const newTask = new Task()
      newTask.status = TaskStatus.PENDING,
      newTask.price = getRandomPrice(),
      newTask.createdAt = new Date()
      newTask.originalPath = createTaskDto.originalPath ?? "";

      const createdTask = await this.taskRepository.createTask(newTask);
      this.eventEmitter.emit('task.process', createdTask._id.toString(), newTask.originalPath);
      const response = new BaseResponseTaskDto();
      response.taskId = createdTask._id.toString(),
      response.status = createdTask.status,
      response.price = createdTask.price

      return response;
    } catch (error) {
      throw new Error(`Error creating task: ${error.message}`);
    }
  }

  async processTask(taskId: string, imagePath: string): Promise<void> {
    try {
      const processedImages = await this.imageProcessorService.processImage(imagePath);
      await this.taskRepository.updateTask(taskId, { status: 'completed', images: processedImages });
    } catch (error) {
      await this.taskRepository.updateTask(taskId, { status: 'failed' });
    }
  }

  async getTask(taskId: string): Promise<ResponseDetailsTaskDto> {
    try {
      const task = await this.taskRepository.getTaskById(taskId);
      if (!task) {
        throw new NotFoundException(`Task with ID ${taskId} not found`);
      }
    
      const response = {
        taskId: task._id.toString(),
        status: task.status,
        price: task.price,
      };
    
      if (task.status === TaskStatus.COMPLETED) {
        response['images'] = task.images;
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
    const _id = new ObjectId(taskId) 
    const task = await this.taskRepositoryOrm.findOne({ where: { _id } });
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
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectId } from "mongodb";
import { Task } from "src/domain/models/entities/task.entity";
import { Repository } from "typeorm";
import { TasksRepository } from "src/infrastructure/adapters/tasks.repository.impl";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepositoryOrm: Repository<Task>,
    private readonly taskRepository: TasksRepository
  ) {}

  async createTask(createTaskDto: Partial<Task>): Promise<Task> {
    try {
      const newTask = this.taskRepositoryOrm.create({
        ...createTaskDto,
        taskId: new ObjectId().toString(),
        status: createTaskDto.status ?? "pending",
      });
      return await this.taskRepositoryOrm.save(newTask);
    } catch (error) {
      throw new Error(`Error creating task: ${error.message}`);
    }
  }

  async getTask(taskId: string): Promise<Task> {
    try {
      const task = await this.taskRepositoryOrm.findOne({ where: { taskId } });
      if (!task) throw new NotFoundException(`Task with id ${taskId} not found`);
      return task;
    } catch (error) {
      throw new Error(`Error fetching task: ${error.message}`);
    }
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepositoryOrm.find();
  }

  async updateTask(taskId: string, updateTaskDto: Partial<Task>): Promise<Task> {
    try {
      await this.taskRepository.updateTask(taskId, updateTaskDto);
      return await this.getTask(taskId);
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
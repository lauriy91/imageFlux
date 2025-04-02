import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "src/domain/models/task.entity";
import { Repository } from "typeorm";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>
  ) {}

  async createTask(imagePath: string): Promise<Task> {
    const newTask = this.taskRepository.create({ imagePath });
    return this.taskRepository.save(newTask);
  }

  async getTask(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { taskId } });
    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }
    return task;
  }

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async updateTask(taskId: string, updateTaskDto: Partial<Task>): Promise<Task> {
    await this.taskRepository.update(taskId, updateTaskDto);
    return this.getTask(taskId);
  }

  async partiallyUpdateTask(taskId: string, updateTaskDto: Partial<Task>): Promise<Task> {
    return this.updateTask(taskId, updateTaskDto);
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.taskRepository.delete(taskId);
  }
}

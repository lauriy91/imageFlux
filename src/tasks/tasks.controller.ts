import { Controller, Post, Body, Get, Param, Put, Patch, Delete } from "@nestjs/common";
import { TasksService } from "../application/services/tasks.service";
import { Task } from "../domain/models/task.entity";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Body() createTaskDto: { imagePath: string }): Promise<Task> {
    return this.tasksService.createTask(createTaskDto.imagePath);
  }

  @Get(":taskId")
  async getTask(@Param("taskId") taskId: string): Promise<Task> {
    return this.tasksService.getTask(taskId);
  }

  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Put(":taskId")
  async updateTask(@Param("taskId") taskId: string, @Body() updateTaskDto: Partial<Task>): Promise<Task> {
    return this.tasksService.updateTask(taskId, updateTaskDto);
  }

  @Patch(":taskId")
  async partiallyUpdateTask(@Param("taskId") taskId: string, @Body() updateTaskDto: Partial<Task>): Promise<Task> {
    return this.tasksService.partiallyUpdateTask(taskId, updateTaskDto);
  }

  @Delete(":taskId")
  async deleteTask(@Param("taskId") taskId: string): Promise<void> {
    return this.tasksService.deleteTask(taskId);
  }
}

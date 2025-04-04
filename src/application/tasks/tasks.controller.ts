import { Controller, Post, Body, Get, Param, Put, Patch, Delete } from "@nestjs/common";
import { TasksService } from "../../domain/services/tasks.service";
import { Task } from "../../domain/models/entities/task.entity";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BaseResponseTaskDto, CreateTaskDto, UpdateTaskDto } from "../models/dto/create-task.dto";

@ApiTags('tasks') 
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiResponse({ status: 201, description: 'Tarea creada exitosamente', type: BaseResponseTaskDto })
  @ApiBody({ type: CreateTaskDto })
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<BaseResponseTaskDto> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get(':taskId')
  @ApiOperation({ summary: 'Obtener una tarea por ID' })
  @ApiResponse({ status: 200, description: 'Tarea encontrada', type: Task })
  async getTask(@Param("taskId") taskId: string) {
    return this.tasksService.getTask(taskId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las tareas' })
  @ApiResponse({ status: 200, description: 'Lista de tareas', type: [Task] })
  async getAllTasks(): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Put(':taskId')
  @ApiOperation({ summary: 'Actualizar una tarea' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Tarea actualizada', type: Task })
  async updateTask(@Param("taskId") taskId: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.tasksService.updateTask(taskId, updateTaskDto);
  }

  @Patch(":taskId")
  @ApiOperation({ summary: 'Actualizar una tarea' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Tarea actualizada', type: Task })
  async partiallyUpdateTask(@Param("taskId") taskId: string, @Body() updateTaskDto: Partial<Task>): Promise<Task> {
    return this.tasksService.partiallyUpdateTask(taskId, updateTaskDto);
  }

  @Delete(':taskId')
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiResponse({ status: 200, description: 'Tarea eliminada' })
  async deleteTask(@Param("taskId") taskId: string): Promise<void> {
    return this.tasksService.deleteTask(taskId);
  }
}

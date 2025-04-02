import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Db, ObjectId } from "mongodb";
import { ITasksRepository } from "src/domain/repositories/tasks.repository";
import { Task } from "src/domain/models/task.entity";

@Injectable()
export class TasksRepository implements ITasksRepository {
  private database: Db;

  constructor(@Inject("MONGO_CONNECTION") database: Db) {
    this.database = database;
  }

  async createTask(imagePath: string): Promise<Task> {
    const newTask: Task = { 
      taskId: new ObjectId().toString(),
      status: "pending",
      price: 0,
      images: [],
      imagePath,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.database.collection("tasks").insertOne(newTask);
    newTask.taskId = result.insertedId.toString();
    return newTask;
  }

  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.database.collection<Task>("tasks").findOne({ _id: new ObjectId(taskId) });
    if (!task) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }
    return task;
  }

  async getAllTasks(): Promise<Task[]> {
    return this.database.collection<Task>("tasks").find().toArray();
  }

  async updateTask(taskId: string, updateTaskDto: Partial<Task>): Promise<Task> {
    await this.database
      .collection("tasks")
      .updateOne({ _id: new ObjectId(taskId) }, { $set: {...updateTaskDto, updatedAt: new Date(), }});

    return this.getTaskById(taskId);
  }

  async partiallyUpdateTask(taskId: string, updateTaskDto: Partial<Task>): Promise<Task> {
    return this.updateTask(taskId, updateTaskDto);
  }

  async deleteTask(taskId: string): Promise<void> {
    const result = await this.database.collection("tasks").deleteOne({ _id: new ObjectId(taskId) });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Task with id ${taskId} not found`);
    }
  }
}

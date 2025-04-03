import { Inject, Injectable } from "@nestjs/common";
import { Db, ObjectId } from "mongodb";
import { ITasksRepository } from "src/domain/ports/itasks.repository";
import { Task } from "src/domain/models/entities/task.entity";

@Injectable()
export class TasksRepository implements ITasksRepository {
  constructor(@Inject("MONGO_CONNECTION") private readonly database: Db) {}

  async createTask(imagePath: string, price: number): Promise<Task> {
    const newTask: Task = {
      _id: new ObjectId(),
      taskId: new ObjectId().toString(),
      status: "pending",
      price,
      images: [],
      imagePath,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.database.collection("tasks").insertOne(newTask);
    return newTask;
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    return this.database.collection<Task>("tasks").findOne({ taskId });
  }

  async getAllTasks(): Promise<Task[]> {
    return this.database.collection<Task>("tasks").find().toArray();
  }

  async updateTask(taskId: string, updateTaskDto: Partial<Task>): Promise<Task> {
    await this.database.collection("tasks").updateOne(
      { taskId },
      { $set: { ...updateTaskDto, updatedAt: new Date() } }
    );
    return this.getTaskById(taskId) as Promise<Task>;
  }

  async partiallyUpdateTask(taskId: string, updateTaskDto: Partial<Task>): Promise<Task> {
    return this.updateTask(taskId, updateTaskDto);
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.database.collection("tasks").deleteOne({ taskId });
  }
}

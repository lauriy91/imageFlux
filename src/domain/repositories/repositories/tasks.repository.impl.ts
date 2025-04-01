import { MongoClient, ObjectId } from "mongodb";
import { ITasksRepository } from "./tasks.repository";
import { Task } from "../models/task.entity";

export class TasksRepository implements ITasksRepository {
  private db: MongoClient;

  constructor(db: MongoClient) {
    this.db = db;
  }

  async createTask(task: Task): Promise<Task> {
    const result = await this.db.collection("tasks").insertOne(task);
    task.taskId = result.insertedId.toString();
    return task;
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    const task = await this.db.collection("tasks").findOne({ _id: new ObjectId(taskId) });
    return task ? task : null;
  }
}

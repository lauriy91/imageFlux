import { MongoClient, ObjectId } from "mongodb";
import { ITasksRepository } from "src/domain/repositories/tasks.repository";
import { Task } from "src/domain/models/task.entity";

export class TasksRepository implements ITasksRepository {
  private client: MongoClient;
  private database: ReturnType<MongoClient["db"]>;

  constructor(client: MongoClient) {
    this.client = client;
    this.database = this.client.db("process-image-db");
  }

  async createTask(task: Task): Promise<Task> {
    const result = await this.database.collection("tasks").insertOne(task);
    task.taskId = result.insertedId.toString();
    return task;
  }

async getTaskById(taskId: string): Promise<Task | null> {
    const task = await this.database.collection<Task>("tasks").findOne({ _id: new ObjectId(taskId) });
    return task;
}
}

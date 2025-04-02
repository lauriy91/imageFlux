import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TasksController } from "./tasks/tasks.controller";
import { TasksService } from "./application/services/tasks.service";
import { TasksRepository } from "./infrastructure/repositories/tasks.repository.impl";
import { MongoClient } from "mongodb";
import { ImageProcessor } from "./infrastructure/image-proccessing/image.processor";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./domain/models/task.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "mongodb",
      url: process.env.MONGO_URI || "mongodb://localhost:27017",
      database: "process-image-db",
      entities: [Task],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Task]),
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
    ImageProcessor,
    {
      provide: "MONGO_CONNECTION",
      useFactory: async () => {
        const client = new MongoClient(process.env.MONGO_URI || "mongodb://localhost:27017");
        await client.connect();
        return client.db("image_processing");
      },
    },
  ],
  exports: ["MONGO_CONNECTION"],
})
export class AppModule {}

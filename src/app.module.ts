import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TasksController } from "./application/tasks/tasks.controller";
import { TasksService } from "./domain/services/tasks.service";
import { TasksRepository } from "./infrastructure/adapters/tasks.repository.impl";
import { ImageProcessor } from "./infrastructure/image-proccessing/image.processor";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./domain/models/entities/task.entity";
import { mongoProvider } from "./infrastructure/datasource/data-connection";

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
    mongoProvider,
  ],
  exports: ["MONGO_CONNECTION"],
})
export class AppModule {}

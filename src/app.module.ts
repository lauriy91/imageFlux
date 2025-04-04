import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TasksController } from "./application/tasks/tasks.controller";
import { TasksService } from "./domain/services/tasks.service";
import { TasksRepository } from "./infrastructure/adapters/tasks.repository.impl";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./domain/models/entities/task.entity";
import { mongoProvider } from "./infrastructure/datasource/data-connection";
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TaskEventsListener } from "./common/utils/task-events";
import { ImageProcessorService } from "./domain/services/image-processor.service";
import { S3Service } from "./domain/services/s3.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "mongodb",
      url: process.env.MONGO_URI || "mongodb://localhost:27017",
      database: process.env.BD || "image_processing",
      entities: [Task],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Task]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
    ImageProcessorService,
    mongoProvider,
    TaskEventsListener,
    S3Service,
  ],
  exports: ["MONGO_CONNECTION"],
})
export class AppModule {}

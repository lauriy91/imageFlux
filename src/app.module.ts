import { Module } from "@nestjs/common";
import { TasksController } from "./tasks/tasks.controller";
import { TasksService } from "./application/services/tasks.service";
import { TasksRepository } from "./infrastructure/repositories/tasks.repository.impl";
import { MongoClient } from "mongodb";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestFactory } from "@nestjs/core";
import { ImageProcessor } from "./infrastructure/image-proccessing/image.processor";

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
    ImageProcessor,
    { provide: MongoClient, useValue: new MongoClient("mongodb://localhost:27017") },
  ],
})
export class AppModule {
  constructor() {}

  async onModuleInit() {
    const app = await NestFactory.create(AppModule);
    const options = new DocumentBuilder()
      .setTitle("API REST para Procesado de Imágenes")
      .setDescription("API para gestionar tareas de procesado de imágenes.")
      .setVersion("1.0")
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("api", app, document);
    await app.listen(3000);
  }
}

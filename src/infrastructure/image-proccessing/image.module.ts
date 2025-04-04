import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { ImageSchema } from "src/domain/schemas/image.schema";
import { Task, TaskSchema } from "src/domain/schemas/task.schema";
import { ImageProcessor } from "./image.processor";


@Module({
    imports: [
      MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
      MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    ],
    providers: [ImageProcessor],
    exports: [ImageProcessor],
  })
  export class ImageProcessingModule {}
  
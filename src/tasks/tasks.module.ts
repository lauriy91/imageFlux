import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from '../application/services/tasks.service';
import { TasksRepository } from '../infrastructure/repositories/tasks.repository.impl';
import { MongoClient } from 'mongodb';
import { ImageProcessor } from 'src/infrastructure/image-proccessing/image.processor';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: 'ITasksRepository',
      useClass: TasksRepository,
    },
    ImageProcessor,
    {
      provide: 'MONGO_CONNECTION',
      useFactory: async () => {
        const client = new MongoClient('mongodb://localhost:27017');
        await client.connect();
        return client.db('image_processing');
      },
    },
  ],
  exports: [TasksService],
})
export class TasksModule {}

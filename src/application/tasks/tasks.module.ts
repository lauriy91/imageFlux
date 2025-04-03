import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from 'src/domain/services/tasks.service';
import { TasksRepository } from 'src/infrastructure/adapters/tasks.repository.impl';
import { ImageProcessor } from 'src/infrastructure/image-proccessing/image.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/domain/models/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: 'ITasksRepository',
      useClass: TasksRepository,
    },
    TasksRepository,
    ImageProcessor,
  ],
  exports: [TasksService, TasksRepository],
})
export class TasksModule {}

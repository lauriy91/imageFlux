import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from '../../domain/services/tasks.service';
import { TasksRepository } from '../../infrastructure/adapters/tasks.repository.impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/domain/models/entities/task.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TaskEventsListener } from 'src/common/utils/task-events';
import { ImageProcessorService } from 'src/domain/services/image-processor.service';
import { S3Service } from 'src/domain/services/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), EventEmitterModule.forRoot()],
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: 'ITasksRepository',
      useClass: TasksRepository,
    },
    TasksRepository,
    ImageProcessorService,
    TaskEventsListener,
    S3Service,
  ],
  exports: [TasksService, TasksRepository, ImageProcessorService, S3Service],
})
export class TasksModule {}

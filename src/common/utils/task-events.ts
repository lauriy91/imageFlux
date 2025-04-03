import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TasksService } from 'src/domain/services/tasks.service';

@Injectable()
export class TaskEventsListener {
  constructor(private readonly tasksService: TasksService) {}

  @OnEvent('task.process')
  async handleTaskProcessing(taskId: string, imagePath: string) {
    await this.tasksService.processTask(taskId, imagePath);
  }
}

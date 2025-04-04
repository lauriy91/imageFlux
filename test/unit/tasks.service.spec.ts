import { Test, TestingModule } from '@nestjs/testing';

import { TasksRepository } from 'src/infrastructure/adapters/tasks.repository.impl';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { BaseResponseTaskDto, CreateTaskDto, TaskStatus } from 'src/application/dto/create-task.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from 'src/domain/models/entities/task.entity';
import { Repository } from 'typeorm';
import { ObjectId } from "mongodb";

import { ImageProcessorService } from 'src/domain/services/image-processor.service';
import { TasksService } from 'src/domain/services/tasks.service';

jest.mock('src/common/utils/utilities', () => ({
  getRandomPrice: jest.fn().mockReturnValue(100),
}));

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: TasksRepository;
  let eventEmitter: EventEmitter2;
  let imageProcessorService: ImageProcessorService;
  const tastkId = new ObjectId();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        {
          provide: TasksRepository,
          useValue: {
            createTask: jest.fn().mockResolvedValue({
              _id: tastkId,
              status: TaskStatus.PENDING,
              price: 100,
            }),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: ImageProcessorService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<TasksRepository>(TasksRepository);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    imageProcessorService = module.get<ImageProcessorService>(ImageProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task and return a response DTO', async () => {
      const createTaskDto: CreateTaskDto = { originalPath: 'path/to/image.jpg' };
      const result = await service.createTask(createTaskDto);

      expect(taskRepository.createTask).toHaveBeenCalledTimes(1);
      expect(eventEmitter.emit).toHaveBeenCalledWith('task.process', new ObjectId(tastkId).toString(), createTaskDto.originalPath);
      const responseMockDto = new BaseResponseTaskDto();
      responseMockDto.taskId = new ObjectId(tastkId).toString();
      responseMockDto.status = TaskStatus.PENDING;
      responseMockDto.price = 100;
      expect(result).toEqual(responseMockDto);
    });

    it('should throw an error if task creation fails', async () => {
      jest.spyOn(taskRepository, 'createTask').mockRejectedValueOnce(new Error('Database error'));

      await expect(service.createTask({ originalPath: 'path/to/image.jpg' })).rejects.toThrow('Error creating task: Database error');
    });
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../../src/domain/services/tasks.service';
import { NotFoundException } from '@nestjs/common';
import { TasksRepository } from 'src/infrastructure/adapters/tasks.repository.impl';

const mockRepository = () => ({
  createTask: jest.fn(),
  findTaskById: jest.fn(),
  updateTask: jest.fn(),
});

describe('TasksService', () => {
  let service: TasksService;
  let repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<TasksRepository>(TasksRepository);
  });

  it('lanza 404 si la tarea no existe', async () => {
    repository.findTaskById.mockReturnValue(null);
    await expect(service.getTaskById('invalid-id')).rejects.toThrow(NotFoundException);
  });
});
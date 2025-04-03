import { ImageProcessorService } from '../../src/domain/services/image-processor.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../../src/domain/services/tasks.service'
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TasksController } from '../../src/application/tasks/tasks.controller'
import { EventEmitter2 } from '@nestjs/event-emitter';

xdescribe('TasksController', () => {
  let app: INestApplication;
  let service: TasksService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: ImageProcessorService,
          useValue: { processImage: jest.fn() } // Mockea el servicio de imágenes si es necesario
        },
        {
          provide: EventEmitter2,
          useValue: { emit: jest.fn() } // Mockea eventos si la tarea se ejecuta asincrónicamente
        }
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    service = moduleRef.get<TasksService>(TasksService);
  });

  it('debe crear una tarea correctamente', async () => {
    jest.spyOn(service, 'createTask').mockResolvedValueOnce({ taskId: 'test123', status: 'pending', price: 30 });

    const response = await request(app.getHttpServer()).post('/tasks').send({ originalPath: 'image.jpg' });

    expect(response.status).toBe(201);
    expect(response.body.taskId).toBeDefined();
    expect(response.body.status).toBe('pending');
  });
  
  afterAll(async () => {
    await app.close();
  });
});


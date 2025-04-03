import request from "supertest";
import { AppModule } from "../src/app.module";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";

describe("TasksController (e2e)", () => {
  let app: INestApplication;
  let createdTaskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/tasks (POST) - Create Task", async () => {
    const response = await request(app.getHttpServer())
      .post("/tasks")
      .send({ originalPath: "/input/test-image.jpg" })
      .expect(201);
    
    expect(response.body.taskId).toBeDefined();
    expect(response.body.status).toBe("pending");
    createdTaskId = response.body.taskId;
  });

  it("/tasks (GET) - Get All Tasks", async () => {
    const response = await request(app.getHttpServer())
      .get("/tasks")
      .expect(200);
    
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it("/tasks/:taskId (GET) - Get Task By ID", async () => {
    const response = await request(app.getHttpServer())
      .get(`/tasks/${createdTaskId}`)
      .expect(200);
    
    expect(response.body.taskId).toBe(createdTaskId);
  });

  it("/tasks/:taskId (PUT) - Update Task", async () => {
    const response = await request(app.getHttpServer())
      .put(`/tasks/${createdTaskId}`)
      .send({ status: "in_progress" })
      .expect(200);
    
    expect(response.body.status).toBe("in_progress");
  });

  it("/tasks/:taskId (PATCH) - Partially Update Task", async () => {
    const response = await request(app.getHttpServer())
      .patch(`/tasks/${createdTaskId}`)
      .send({ price: 25 })
      .expect(200);
    
    expect(response.body.price).toBe(25);
  });

  it("/tasks/:taskId (DELETE) - Delete Task", async () => {
    await request(app.getHttpServer())
      .delete(`/tasks/${createdTaskId}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});

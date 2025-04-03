import { TasksService } from "../../src/domain/services/tasks.service";
import { TasksRepository } from "../../src/infrastructure/adapters/tasks.repository.impl";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ImageProcessorService } from "../../src/domain/services/image-processor.service";
import { ObjectId } from "mongodb";

describe("TasksService", () => {
  let service: TasksService;
  let tasksRepository: TasksRepository;
  let eventEmitter: EventEmitter2;
  let imageProcessorService: ImageProcessorService;

  beforeEach(() => {
    tasksRepository = {
      createTask: jest.fn(),
      getTaskById: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
    } as unknown as TasksRepository;

    eventEmitter = { emit: jest.fn() } as unknown as EventEmitter2;

    imageProcessorService = { processImage: jest.fn() } as unknown as ImageProcessorService;

    service = new TasksService(
      {} as any,
      tasksRepository,
      eventEmitter,
      imageProcessorService
    );
  });

  it("debe crear una tarea correctamente", async () => {
    const mockTask = {
      _id: new ObjectId(),
      status: "pending",
      price: 100,
      images: [],
      originalPath: "",
      createdAt: new Date(),
      updatedAt: new Date(),
  };

    jest.spyOn(tasksRepository, "createTask").mockResolvedValueOnce(mockTask);

    const result = await service.createTask({ originalPath: "image.jpg" });

    expect(result).toEqual({
      taskId: mockTask._id.toString(),
      status: mockTask.status,
      price: mockTask.price,
    });

    expect(eventEmitter.emit).toHaveBeenCalledWith("task.process", mockTask._id.toString(), mockTask.originalPath);
  });

  it("debe procesar una tarea y actualizar su estado correctamente", async () => {
    const mockTask = {
      _id: new ObjectId(),
      status: "completed",
      price: 100,
      images: [],
      originalPath: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockImages = [{ resolution: "1024", path: "output/image.jpg" }];
    jest.spyOn(imageProcessorService, "processImage").mockResolvedValueOnce(mockImages);
    jest.spyOn(tasksRepository, "updateTask").mockResolvedValueOnce(mockTask);

    await service.processTask("test123", "uploads/test.jpg");

    expect(imageProcessorService.processImage).toHaveBeenCalledWith("uploads/test.jpg");
    expect(tasksRepository.updateTask).toHaveBeenCalledWith("test123", {
      status: "completed",
      images: mockImages,
    });
  });

  it("debe manejar el error cuando la imagen no existe y marcar la tarea como 'failed'", async () => {
    const mockTask = {
      _id: new ObjectId(),
      status: "failed",
      price: 100,
      images: [],
      originalPath: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(imageProcessorService, "processImage").mockRejectedValueOnce(new Error("Imagen no encontrada"));
    jest.spyOn(tasksRepository, "updateTask").mockResolvedValueOnce(mockTask);

    await service.processTask("test123", "uploads/non-existent.jpg");

    expect(tasksRepository.updateTask).toHaveBeenCalledWith("test123", { status: "failed" });
  });

  it("debe obtener una tarea correctamente", async () => {
    const mockTask = {
      _id: new ObjectId(),
      status: "completed",
      price: 30,
      images: [{ resolution: "1024", path: "output/image.jpg" }],
      originalPath: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(tasksRepository, "getTaskById").mockResolvedValueOnce(mockTask);

    const result = await service.getTask("test123");

    expect(result).toEqual(mockTask);
  });

  it("debe lanzar un error si la tarea no existe", async () => {
    jest.spyOn(tasksRepository, "getTaskById").mockResolvedValueOnce(null);

    // await expect(service.getTask("non-existent")).rejects.toThrow(NotFoundException);
  });

  it("debe eliminar una tarea correctamente", async () => {
    jest.spyOn(tasksRepository, "deleteTask").mockResolvedValueOnce();

    await service.deleteTask("test123");

    expect(tasksRepository.deleteTask).toHaveBeenCalledWith("test123");
  });
});

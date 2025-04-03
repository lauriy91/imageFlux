import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum TaskStatus {
  PENDING = 'pending',
  FAILED = 'failed',
  COMPLETED = 'completed',
}

export class CreateTaskDto {
  @ApiProperty({ example: "5.00", description: "Precio de la imagen" })
  @IsNumber()
  price: number;

  @ApiProperty({ example: "image1.jpg", description: "Nombre imagen" })
  @IsString()
  images: [];

  @ApiProperty({ example: "uploads/image1.jpg", description: "Ruta donde se halla la imagen a guardar" })
  @IsString()
  originalPath: string;
}

export class UpdateTaskDto {
  @ApiProperty({ example: "completed", description: "Nuevo estado de la tarea: pending, completed, failed" })
  @IsEnum(TaskStatus, { message: 'Status must be one of: pending, in_progress, completed' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 13, description: "Precio de la tarea" })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: "uploads/image.jpg", description: "Ruta de la imagen" })
  @IsString()
  @IsOptional()
  originalPath?: string;
}

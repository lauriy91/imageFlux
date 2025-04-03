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

  @ApiProperty({ example: "[{'path': '/output/image6/1024/f322b730b287.jpg'}, {'path': '/output/image7/800/202fd8b3174.jpg'}]", description: "Lista de iamgenes procesadas" })  
  @IsString()
  images: [];

  @ApiProperty({ example: "uploads/image1.jpg", description: "Ruta donde se halla la imagen original" })
  @IsString()
  originalPath: string;
}

export class UpdateTaskDto {
  @ApiProperty({ example: "completed", description: "Nuevo estado de la tarea: pending, completed, failed" })
  @IsEnum(TaskStatus, { message: 'Status must be one of: pending, in_progress, completed' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 13, description: "Precio de la imagen" })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: "uploads/image.jpg", description: "Ruta de la imagen original" })
  @IsString()
  @IsOptional()
  originalPath?: string;
}

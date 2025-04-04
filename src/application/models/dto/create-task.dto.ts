import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PathResponse, TaskStatus } from "../interfaces";

export class CreateTaskDto {
  @ApiProperty({ example: "images/upload/imagen-prueba.jpg", description: "Ruta donde se halla la imagen original" })
  @IsString()
  originalPath: string;

}
export class BaseResponseTaskDto {
  @ApiProperty({ example: "5.00", description: "Precio de la imagen" })
  @IsNumber()
  price: number;

  @ApiProperty({ example: "completed", description: "Nuevo estado de la tarea: pending, completed, failed" })  
  @IsString()
  status: string;

  @ApiProperty({ example: "67eed931bcb01bffa2f13634", description: "Id de la operación" })
  @IsString()
  taskId: string;
}

export class ResponseDetailsTaskDto extends BaseResponseTaskDto {
  @ApiProperty({ example: "[{'path': '...\\output\\imagen-prueba2\\1024\\12a1c494a2819bfbb0cb739cb0d2abd7.jpg'}, {'path': '...\\images\\output\\imagen-prueba2\\800\\12a1c494a2819bfbb0cb739cb0d2abd7.jpg'}]", description: "Rutas de imagenes procesadas"})
  @IsString()
  images?: PathResponse[] | null;
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

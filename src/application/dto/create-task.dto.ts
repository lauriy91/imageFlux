import { IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {
  @ApiProperty({ example: "uploads/image1.jpg", description: "Ruta donde se halla la imagen a guardar" })
  @IsString()
  imagePath: string;

  @ApiProperty({ example: "5.00", description: "Precio de la imagen" })
  @IsNumber()
  price: number;
}

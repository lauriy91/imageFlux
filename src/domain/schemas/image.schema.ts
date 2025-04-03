import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Image extends Document {
  @Prop({ required: true })
  taskId: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  resolution: number;

  @Prop({ required: true, unique: true })
  md5: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);

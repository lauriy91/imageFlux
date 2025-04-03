import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  status: "pending" | "completed" | "failed";

  @Prop({ required: true })
  price: number;

  @Prop({ type: [{ resolution: Number, path: String }] })
  images: { resolution: number; path: string }[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);

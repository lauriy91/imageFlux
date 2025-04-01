import { Schema, Document, Types } from 'mongoose';

// Esquema para las imágenes procesadas
const imageSchema = new Schema({
  resolution: { type: String, required: true },
  path: { type: String, required: true },
  md5: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Esquema para la tarea de procesado de imagen
export interface PicturePipeline extends Document {
  status: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  originalPath: string;
  images: Array<{
    resolution: string;
    path: string;
    md5: string;
    timestamp: Date;
  }>;
}

export const PicturePipelineSchema = new Schema<PicturePipeline>({
  status: { type: String, required: true, default: 'pending' },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  originalPath: { type: String, required: true },
  images: { type: [imageSchema], default: [] },
});

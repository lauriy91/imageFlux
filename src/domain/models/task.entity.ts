export class Task {
  taskId: string;
  status: string;
  price: number;
  originalPath: string;
  images: Array<{ resolution: string; path: string }>;
  createdAt: Date;
  updatedAt: Date;
}

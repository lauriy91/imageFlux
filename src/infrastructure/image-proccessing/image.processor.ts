import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as crypto from "crypto";
import { Task } from "src/domain/schemas/task.schema";
import { Image } from "src/domain/schemas/image.schema";

export class ImageProcessor {
  constructor(
    @InjectModel("Task") private readonly taskModel: Model<Task>,
    @InjectModel("Image") private readonly imageModel: Model<Image>
  ) {}

  async process(taskId: string, originalPath: string): Promise<void> {
    const fileExtension = path.extname(originalPath);
    const baseName = path.basename(originalPath, fileExtension);
    const outputDir = path.join("/output", baseName);
    const resolutions = [1024, 800];

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
      const processedImages: Image[] = [];

      for (let resolution of resolutions) {
        const imageBuffer = await sharp(originalPath)
          .resize(resolution)
          .toBuffer();

        const md5Hash = crypto.createHash("md5").update(imageBuffer).digest("hex");
        const outputPath = path.join(outputDir, `${resolution}`, `${md5Hash}${fileExtension}`);

        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        await sharp(originalPath).resize(resolution).toFile(outputPath);

        const image = await this.imageModel.create({
          taskId,
          path: outputPath,
          resolution,
          md5: md5Hash,
          createdAt: new Date(),
        });

        processedImages.push(image);
      }

      // Actualizar la tarea con los resultados
      await this.taskModel.findByIdAndUpdate(taskId, {
        status: "completed",
        images: processedImages.map(img => ({ resolution: img.resolution, path: img.path })),
        updatedAt: new Date(),
      });

    } catch (error) {
      console.error("Error procesando imágenes:", error);
      await this.taskModel.findByIdAndUpdate(taskId, {
        status: "failed",
        updatedAt: new Date(),
      });
    }
  }
}

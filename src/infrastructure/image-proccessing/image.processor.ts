import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

export class ImageProcessor {
    async process(imagePath: string): Promise<{ resolution: string; path: string }[]> {
      const fileExtension = path.extname(imagePath);
      const baseName = path.basename(imagePath, fileExtension);
      const outputDir = path.join("/output", baseName);
      const resolutions = [1024, 800];
  
      const processedImages: { resolution: string; path: string }[] = [];
  
      for (let resolution of resolutions) {
        const outputPath = path.join(outputDir, `${resolution}`, `${uuidv4()}${fileExtension}`);
        await sharp(imagePath)
          .resize(resolution)
          .toFile(outputPath);
        processedImages.push({ resolution: resolution.toString(), path: outputPath });
      }
      
      return processedImages;
    }
  }

import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

export class ImageProcessor {
    async process(originalPath: string): Promise<{ resolution: string; path: string }[]> {
      const fileExtension = path.extname(originalPath);
      const baseName = path.basename(originalPath, fileExtension);
      const outputDir = path.join("/output", baseName);
      const resolutions = [1024, 800];
  
      const processedImages: { resolution: string; path: string }[] = [];
  
      for (let resolution of resolutions) {
        const outputPath = path.join(outputDir, `${resolution}`, `${uuidv4()}${fileExtension}`);
        await sharp(originalPath)
          .resize(resolution)
          .toFile(outputPath);
        processedImages.push({ resolution: resolution.toString(), path: outputPath });
      }
      
      return processedImages;
    }
  }

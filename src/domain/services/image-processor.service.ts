import * as sharp from 'sharp';
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImageProcessorService {
  async processImage(imagePath: string): Promise<{ resolution: string; path: string }[]> {
    const resolutions = [1024, 800];
    const imageName = path.basename(imagePath, path.extname(imagePath));
    const hash = crypto.createHash('md5').update(imagePath).digest('hex');
    const outputDir = path.join(__dirname, '../../../images/output', imageName);


    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const processedImages = await Promise.all(
      resolutions.map(async (width) => {
        const outputPath = path.join(outputDir, `${width}`, `${hash}${path.extname(imagePath)}`);
        
        if (!fs.existsSync(path.dirname(outputPath))) {
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        }

        await sharp(imagePath).resize({ width }).toFile(outputPath);

        return { resolution: width.toString(), path: outputPath };
      })
    );

    return processedImages;
  }
}

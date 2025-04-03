import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageProcessorService {

  private readonly outputPath = path.join(__dirname, '../../../images/output');

  async processImage(imagePath: string): Promise<{ resolution: string; path: string }[]> {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Ruta erronea: ${imagePath}`);
    }

    const resolutions = [1024, 800];
    const imageName = path.basename(imagePath, path.extname(imagePath));
    const hash = crypto.createHash('md5').update(imagePath).digest('hex');

    if (!fs.existsSync(this.outputPath)) {
      fs.mkdirSync(this.outputPath, { recursive: true });
    }

    return await Promise.all(
      resolutions.map(async (width) => {
        const outputDir = path.join(this.outputPath, imageName, width.toString());
        const outputPath = path.join(outputDir, `${hash}${path.extname(imagePath)}`);

        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        await sharp(imagePath).resize({ width }).toFile(outputPath);
        return { resolution: width.toString(), path: outputPath };
      })
    );
  }
}

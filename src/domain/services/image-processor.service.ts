import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';
import { S3Service } from "./s3.service";
import { PathResponse } from 'src/application/models/interfaces';

@Injectable()
export class ImageProcessorService {

  private readonly outputPath = path.join(__dirname, '../../../images/output');
  private readonly s3Service = new S3Service();

  async processImage(imagePath: string): Promise<PathResponse[]> {
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

        const outputFileName = `${imageName}_${width}_${hash}${path.extname(imagePath)}`;
        const s3Key = `processed/${outputFileName}`;
        const s3Url = await this.s3Service.uploadFile(outputPath, s3Key);

        return { resolution: width.toString(), path: { local: outputPath,cloud: s3Url} };
      })
    );
  }
}

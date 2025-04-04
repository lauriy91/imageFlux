import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

export class S3Service {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    this.s3 = new S3Client({
      region: 'us-east-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.bucketName = process.env.AWS_S3_BUCKET!;
  }
  
  async uploadFile(filePath: string, key: string): Promise<string> {
    const fileStream = fs.createReadStream(filePath);
  
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileStream,
        ContentType: "image/jpeg",
      });
  
      await this.s3.send(command);
    } catch (err) {
      throw err;
    }
  
    return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

}

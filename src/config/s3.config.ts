import * as dotenv from 'dotenv';
dotenv.config();

export const s3config = {
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: "us-east-2",
    bucketName: process.env.AWS_S3_BUCKET || '',
  }
};

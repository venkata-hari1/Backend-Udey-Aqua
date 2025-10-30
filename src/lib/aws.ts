import { Injectable, BadRequestException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    this.bucket = process.env.AWS_S3_BUCKET_NAME!;
  }

  async uploadFile(file?:any): Promise<string | null> {
    if (!file) return null;

    const key = `${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    });

    await this.s3Client.send(command);
    const cloudFrontUrl = `${process.env.CLOUD_FRONT_URL}/${key}`;
    return cloudFrontUrl;
  }

  async deleteFile(fileUrl: string) {
    if (!fileUrl) throw new BadRequestException('File URL is required');

    const key = fileUrl.split('/').pop();
    console.log(fileUrl)
    if (!key) throw new BadRequestException('Invalid file URL');

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3Client.send(command);
    return { message: `Deleted ${key} successfully` };
  }



}

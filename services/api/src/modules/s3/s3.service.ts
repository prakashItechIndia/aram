import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Central S3 upload service for the application.
 * All file storage (gallery, sponsors logos, album covers, etc.) uses S3 only.
 */
@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  /** If set (e.g. CloudFront), URLs are base + key; else https://bucket.s3.region.amazonaws.com/key */
  private readonly publicUrlBase: string | null;

  constructor(private config: ConfigService) {
    const region = this.config.get<string>('AWS_REGION', 'ap-south-1');
    const bucket = this.config.get<string>('S3_BUCKET');
    const endpoint = this.config.get<string>('S3_ENDPOINT');
    this.region = region;
    this.bucket = bucket ?? '';

    this.client = new S3Client({
      region,
      ...(endpoint && { endpoint }),
      ...(this.config.get('AWS_ACCESS_KEY_ID') && {
        credentials: {
          accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID')!,
          secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS_KEY')!,
        },
      }),
    });

    const base = this.config.get<string>('S3_PUBLIC_URL_BASE');
    this.publicUrlBase = base && base.replace(/\/$/, '') ? base.replace(/\/$/, '') : null;
  }

  /**
   * Upload a file to S3 and return its public URL.
   * @param key S3 object key (e.g. "gallery/123.jpg" or "sponsors/logo-1.png")
   * @param buffer File contents
   * @param contentType MIME type (e.g. "image/jpeg")
   * @param options Optional ACL (e.g. "public-read") if bucket allows it
   */
  async upload(
    key: string,
    buffer: Buffer,
    contentType: string,
    options?: { acl?: 'public-read' },
  ): Promise<string> {
    if (!this.bucket) {
      throw new Error('S3_BUCKET is not configured');
    }
    const normalizedKey = key.startsWith('/') ? key.slice(1) : key;
    const input: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: normalizedKey,
      Body: buffer,
      ContentType: contentType,
      ...(options?.acl && { ACL: options.acl }),
    };
    await this.client.send(new PutObjectCommand(input));
    return this.getPublicUrl(normalizedKey);
  }

  /**
   * Return the public URL for an S3 object key.
   */
  getPublicUrl(key: string): string {
    const normalizedKey = key.startsWith('/') ? key.slice(1) : key;
    if (this.publicUrlBase) {
      return `${this.publicUrlBase}/${normalizedKey}`;
    }
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${normalizedKey}`;
  }

  /**
   * Generate a pre-signed URL for downloading a file with proper headers.
   * @param key S3 object key
   * @param filename Optional filename for Content-Disposition header
   * @param expiresIn URL expiration in seconds (default: 3600 = 1 hour)
   */
  async getSignedDownloadUrl(
    key: string,
    filename?: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    if (!this.bucket) {
      throw new Error('S3_BUCKET is not configured');
    }
    const normalizedKey = key.startsWith('/') ? key.slice(1) : key;
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: normalizedKey,
      ...(filename && { ResponseContentDisposition: `attachment; filename="${filename}"` }),
    });
    return await getSignedUrl(this.client, command, { expiresIn });
  }
}

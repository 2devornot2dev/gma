// lib/aws/s3.ts
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  getCachedImageUrl,
  getCachedImageUrls,
  invalidateImageCache,
  PRESIGNED_URL_EXPIRY_SEC,
  setCachedImageUrl,
  setCachedImageUrls,
} from "@/lib/upstash";

let cachedClient: S3Client | null = null;

export function getS3Client(): S3Client {
  if (cachedClient) return cachedClient;

  const region = process.env.AWS_REGION ?? "ca-central-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  cachedClient = new S3Client({
    region,
    credentials:
      accessKeyId && secretAccessKey
        ? { accessKeyId, secretAccessKey }
        : undefined,
  });

  return cachedClient;
}

function getBucket(): string {
  const bucket = process.env.AWS_BUCKET_NAME ?? process.env.AWS_S3_BUCKET;
  if (!bucket) {
    throw new Error("Missing AWS_BUCKET_NAME environment variable.");
  }
  return bucket;
}

function getPublicBaseUrl(): string | undefined {
  return process.env.AWS_S3_PUBLIC_URL?.replace(/\/$/, "");
}

export interface UploadResult {
  key: string;
  url: string;
  bytes: number;
}

export async function uploadAndSave(
  body: Buffer | Uint8Array,
  key: string,
  contentType = "image/jpeg"
): Promise<UploadResult> {
  const bucket = getBucket();
  const s3 = getS3Client();

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  const kb = (body.byteLength / 1024).toFixed(1);
  console.log(`[S3] Uploaded s3://${bucket}/${key} (${kb} KB, ${contentType})`);

  // Refresh cached URL for this key
  await invalidateImageCache(key);
  const url = await resolveImageUrl(key);
  return { key, url: url!, bytes: body.byteLength };
}

export async function uploadFromUrl(
  sourceUrl: string,
  key: string,
  fallbackContentType = "image/jpeg"
): Promise<UploadResult> {
  console.log(`[S3] Downloading from ${sourceUrl}`);
  const res = await fetch(sourceUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch remote asset (${res.status})`);
  }

  const contentType = res.headers.get("content-type") ?? fallbackContentType;
  const buffer = Buffer.from(await res.arrayBuffer());
  return uploadAndSave(buffer, key, contentType);
}

export async function getPresignedUrl(
  key: string,
  expiresIn = PRESIGNED_URL_EXPIRY_SEC
): Promise<string> {
  const bucket = getBucket();
  const s3 = getS3Client();
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(s3, command, { expiresIn });
}

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 300
): Promise<string> {
  const bucket = getBucket();
  const s3 = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3, command, { expiresIn });
}

export async function resolveImageUrl(
  keyOrUrl: string | null | undefined,
  expiresIn = PRESIGNED_URL_EXPIRY_SEC
): Promise<string | null> {
  if (!keyOrUrl) return null;
  if (keyOrUrl.startsWith("http://") || keyOrUrl.startsWith("https://")) {
    return keyOrUrl;
  }

  const publicBaseUrl = getPublicBaseUrl();
  if (publicBaseUrl) {
    return `${publicBaseUrl}/${keyOrUrl.replace(/^\//, "")}`;
  }

  const cached = await getCachedImageUrl(keyOrUrl);
  if (cached) return cached;

  const signed = await getPresignedUrl(keyOrUrl, expiresIn);
  await setCachedImageUrl(keyOrUrl, signed);
  return signed;
}

/**
 * Resolves a batch of S3 keys with 1 Redis mget + 1 pipeline for cache misses.
 */
export async function resolveImageUrls(
  keysOrUrls: Array<string | null | undefined>,
  expiresIn = PRESIGNED_URL_EXPIRY_SEC
): Promise<(string | null)[]> {
  const publicBaseUrl = getPublicBaseUrl();
  const results: (string | null)[] = new Array(keysOrUrls.length).fill(null);

  const s3Indices: number[] = [];
  const s3Keys: string[] = [];

  keysOrUrls.forEach((item, idx) => {
    if (!item) return;
    if (item.startsWith("http://") || item.startsWith("https://")) {
      results[idx] = item;
      return;
    }
    if (publicBaseUrl) {
      results[idx] = `${publicBaseUrl}/${item.replace(/^\//, "")}`;
      return;
    }
    s3Indices.push(idx);
    s3Keys.push(item);
  });

  if (s3Keys.length === 0) return results;

  const cached = await getCachedImageUrls(s3Keys);
  const misses: Array<{ resultIdx: number; key: string }> = [];

  cached.forEach((url, i) => {
    const resultIdx = s3Indices[i];
    if (url) {
      results[resultIdx] = url;
    } else {
      misses.push({ resultIdx, key: s3Keys[i] });
    }
  });

  if (misses.length > 0) {
    const freshlySigned = await Promise.all(
      misses.map(async ({ resultIdx, key }) => {
        const url = await getPresignedUrl(key, expiresIn);
        results[resultIdx] = url;
        return { key, url };
      })
    );
    await setCachedImageUrls(freshlySigned);
  }

  return results;
}

export async function deleteFromS3(key: string): Promise<void> {
  const bucket = getBucket();
  const s3 = getS3Client();
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  await invalidateImageCache(key);
  console.log(`[S3] Deleted s3://${bucket}/${key}`);
}

export async function deleteAllByPrefix(prefix: string): Promise<number> {
  const bucket = getBucket();
  const s3 = getS3Client();
  let deletedCount = 0;
  let continuationToken: string | undefined;

  do {
    const listed = await s3ClientSendList(s3, bucket, prefix, continuationToken);

    const objects = (listed.Contents ?? [])
      .filter((obj): obj is { Key: string } => Boolean(obj.Key))
      .map((obj) => ({ Key: obj.Key }));

    if (objects.length > 0) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: { Objects: objects, Quiet: true },
        })
      );
      await invalidateImageCache(objects.map((o) => o.Key));
      deletedCount += objects.length;
    }

    continuationToken = listed.IsTruncated
      ? listed.NextContinuationToken
      : undefined;
  } while (continuationToken);

  console.log(
    `[S3] Cleared ${deletedCount} existing object(s) under s3://${bucket}/${prefix}`
  );
  return deletedCount;
}

function s3ClientSendList(
  s3: S3Client,
  bucket: string,
  prefix: string,
  continuationToken?: string
) {
  return s3.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    })
  );
}
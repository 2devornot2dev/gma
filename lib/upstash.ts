// lib/upstash.ts
import { Redis } from "@upstash/redis";

// S3 presigned URLs expire at 3600s; keep Redis TTL shorter so cached URLs never expire mid-use
export const PRESIGNED_URL_EXPIRY_SEC = 3600;
export const IMAGE_CACHE_TTL_SEC = 3000;
export const PRODUCTS_CACHE_TTL_SEC = 3000;

export const CACHE_KEYS = {
  productsList: "gma:products:list",
  productItem: (id: string) => `gma:products:item:${id}`,
  imageUrl: (s3Key: string) => `gma:img:${s3Key}`,
} as const;

let cachedRedis: Redis | null | undefined;

export function getRedis(): Redis | null {
  if (cachedRedis !== undefined) return cachedRedis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    cachedRedis = null;
    return null;
  }

  cachedRedis = new Redis({ url, token });
  return cachedRedis;
}

/* -------------------------------------------------------------------------- */
/* Image URL Cache                                                            */
/* -------------------------------------------------------------------------- */

export async function getCachedImageUrl(s3Key: string): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    return await redis.get<string>(CACHE_KEYS.imageUrl(s3Key));
  } catch (err) {
    console.warn("[Upstash] getCachedImageUrl failed:", err);
    return null;
  }
}

export async function setCachedImageUrl(
  s3Key: string,
  url: string,
  ttlSec = IMAGE_CACHE_TTL_SEC
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.set(CACHE_KEYS.imageUrl(s3Key), url, { ex: ttlSec });
  } catch (err) {
    console.warn("[Upstash] setCachedImageUrl failed:", err);
  }
}

export async function getCachedImageUrls(
  s3Keys: string[]
): Promise<(string | null)[]> {
  if (s3Keys.length === 0) return [];
  const redis = getRedis();
  if (!redis) return s3Keys.map(() => null);

  try {
    const keys = s3Keys.map(CACHE_KEYS.imageUrl);
    const values = await redis.mget<(string | null)[]>(...keys);
    return values.map((v) => v ?? null);
  } catch (err) {
    console.warn("[Upstash] getCachedImageUrls failed:", err);
    return s3Keys.map(() => null);
  }
}

export async function setCachedImageUrls(
  entries: Array<{ key: string; url: string }>,
  ttlSec = IMAGE_CACHE_TTL_SEC
): Promise<void> {
  if (entries.length === 0) return;
  const redis = getRedis();
  if (!redis) return;

  try {
    const pipeline = redis.pipeline();
    for (const { key, url } of entries) {
      pipeline.set(CACHE_KEYS.imageUrl(key), url, { ex: ttlSec });
    }
    await pipeline.exec();
  } catch (err) {
    console.warn("[Upstash] setCachedImageUrls failed:", err);
  }
}

export async function invalidateImageCache(
  s3Keys: string | string[]
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  const list = Array.isArray(s3Keys) ? s3Keys : [s3Keys];
  if (list.length === 0) return;

  try {
    await redis.del(...list.map(CACHE_KEYS.imageUrl));
  } catch (err) {
    console.warn("[Upstash] invalidateImageCache failed:", err);
  }
}

/* -------------------------------------------------------------------------- */
/* Products Data Cache                                                        */
/* -------------------------------------------------------------------------- */

export async function getCachedProducts<T>(): Promise<T | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    return await redis.get<T>(CACHE_KEYS.productsList);
  } catch (err) {
    console.warn("[Upstash] getCachedProducts failed:", err);
    return null;
  }
}

export async function setCachedProducts<T>(
  data: T,
  ttlSec = PRODUCTS_CACHE_TTL_SEC
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.set(CACHE_KEYS.productsList, data, { ex: ttlSec });
  } catch (err) {
    console.warn("[Upstash] setCachedProducts failed:", err);
  }
}

export async function getCachedProduct<T>(id: string): Promise<T | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    return await redis.get<T>(CACHE_KEYS.productItem(id));
  } catch (err) {
    console.warn("[Upstash] getCachedProduct failed:", err);
    return null;
  }
}

export async function setCachedProduct<T>(
  id: string,
  data: T,
  ttlSec = PRODUCTS_CACHE_TTL_SEC
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.set(CACHE_KEYS.productItem(id), data, { ex: ttlSec });
  } catch (err) {
    console.warn("[Upstash] setCachedProduct failed:", err);
  }
}

/**
 * Call after creating, updating, or deleting a single product (or regenerating its image).
 */
export async function invalidateProductsCache(productId?: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    const keys: string[] = [CACHE_KEYS.productsList];
    if (productId) keys.push(CACHE_KEYS.productItem(productId));
    await redis.del(...keys);
  } catch (err) {
    console.warn("[Upstash] invalidateProductsCache failed:", err);
  }
}

/**
 * Call after bulk CSV upload or full reseed — clears all product + image caches.
 */
export async function invalidateAllProductCaches(): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    const patterns = ["gma:products:*", "gma:img:*"];
    for (const match of patterns) {
      let cursor = "0";
      do {
        const [nextCursor, keys] = await redis.scan(cursor, {
          match,
          count: 200,
        });
        cursor = String(nextCursor);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } while (cursor !== "0");
    }
  } catch (err) {
    console.warn("[Upstash] invalidateAllProductCaches failed:", err);
  }
}
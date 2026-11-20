// lib/actions/get-product.ts
import { prisma } from "@/lib/prisma";
import { resolveImageUrl } from "@/lib/aws/s3";
import { getCachedProduct, setCachedProduct } from "@/lib/upstash";
import type { ProductCategory } from "@/lib/generated/prisma/client";

export interface SingleProductData {
  id: string;
  name: string;
  category: ProductCategory;
  cost: number;
  imageKey: string | null;
  image: string | null;
  weight: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getProduct(id: string): Promise<SingleProductData | null> {
  const cached = await getCachedProduct<SingleProductData>(id);
  if (cached) return cached;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return null;

  const resolvedImage = await resolveImageUrl(product.image);

  const data: SingleProductData = {
    id: product.id,
    name: product.name,
    category: product.category,
    cost: Number(product.cost),
    imageKey: product.image,
    image: resolvedImage,
    weight: product.weight,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };

  await setCachedProduct(id, data);
  return data;
}
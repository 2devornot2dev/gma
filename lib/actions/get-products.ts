// lib/actions/get-products.ts
import { prisma } from "@/lib/prisma";
import { resolveImageUrls } from "@/lib/aws/s3";
import { getCachedProducts, setCachedProducts } from "@/lib/upstash";
import type { ProductCategory } from "@/lib/generated/prisma/client";

export interface ProductRow {
  id: string;
  name: string;
  category: ProductCategory;
  cost: number;
  image: string | null;
  weight: string | null;
  updatedAt: string;
}

export type ProductsList = ProductRow[];

export async function getProducts(): Promise<ProductsList> {
  const cached = await getCachedProducts<ProductsList>();
  if (cached) return cached;

  const dbProducts = await prisma.product.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const resolvedImages = await resolveImageUrls(
    dbProducts.map((p) => p.image)
  );

  const products: ProductsList = dbProducts.map((p, idx) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    cost: Number(p.cost),
    image: resolvedImages[idx],
    weight: p.weight,
    updatedAt: p.updatedAt.toISOString(),
  }));

  await setCachedProducts(products);
  return products;
}
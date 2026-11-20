// components/products/product-table/types.ts
import type { ProductCategory } from "@/lib/generated/prisma/client";

/**
 * Serialized Product safe to pass from Server Components to Client Components
 * (Prisma Decimal is converted to number).
 */
export interface ProductRow {
  id: string;
  name: string;
  category: ProductCategory;
  cost: number;
  image: string | null;
  weight: string | null;
  updatedAt: string;
}
// components/products/product-table/types.ts
import type { ProductCategory } from "@/lib/generated/prisma/client";
// components/products/product-table/types.ts
export type { ProductRow, ProductsList } from "@/lib/actions/get-products";

/**
 * Serialized Product safe to pass from Server Components to Client Components
 * (Prisma Decimal is converted to number).
 */
interface ProductRow {
  id: string;
  name: string;
  category: ProductCategory;
  cost: number;
  image: string | null;
  weight: string | null;
  updatedAt: string;
}
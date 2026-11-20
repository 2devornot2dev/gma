// app/products/page.tsx
import Link from "next/link";
import { Download, Layers, Package, Plus, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/misc/page-header";
import { ProductTable } from "@/components/products/product-table";
import type { ProductRow } from "@/components/products/product-table/types";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const dbProducts = await prisma.product.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  const products: ProductRow[] = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    cost: Number(p.cost),
    image: p.image,
    weight: p.weight,
    updatedAt: p.updatedAt.toISOString(),
  }));

  const categoryCount = new Set(products.map((p) => p.category)).size;
  const withImagesCount = products.filter((p) => Boolean(p.image)).length;

  return (
    <div className="min-h-screen bg-steel-50">
      <PageHeader
        eyebrow="GMA Wholesale Catalog"
        title="Products & Pricing"
        description="Browse and manage GMA's cold-chain inventory across beef, pork, poultry, game, seafood, and chef-prepared items."
        badges={[
          {
            label: "Total SKUs",
            value: products.length,
            variant: "primary",
            icon: <Package className="h-3.5 w-3.5" />,
          },
          {
            label: "Categories",
            value: categoryCount,
            variant: "secondary",
            icon: <Layers className="h-3.5 w-3.5" />,
          },
          {
            label: "Images Ready",
            value: `${withImagesCount}/${products.length}`,
            variant: "accent",
            icon: <Sparkles className="h-3.5 w-3.5" />,
          },
        ]}
        actions={
          <>
            <a
              href="/gma-pricelist.csv"
              download
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-white/30 bg-transparent text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-navy"
              )}
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </a>
            <Link
              href="/products/new"
              className={cn(
                buttonVariants(),
                "bg-knicks text-xs font-bold uppercase tracking-widest text-white hover:bg-knicks-600"
              )}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </>
        }
      />

      <main className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8">
        <ProductTable initialProducts={products} />
      </main>
    </div>
  );
}
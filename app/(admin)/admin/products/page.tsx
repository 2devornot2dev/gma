// app/(admin)/admin/products/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { Download, Layers, Package, Plus, Sparkles } from "lucide-react";
import { getProducts } from "@/lib/actions/get-products";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/misc/page-header";
import { ProductTable } from "@/components/products/product-table";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-steel-50">
      <Suspense fallback={<ProductsPageSkeleton />}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}

async function ProductsContent() {
  const products = await getProducts();

  const categoryCount = new Set(products.map((p) => p.category)).size;
  const withImagesCount = products.filter((p) => Boolean(p.image)).length;

  return (
    <>
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
              href="/admin/products/new"
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
    </>
  );
}

function ProductsPageSkeleton() {
  return (
    <>
      <div className="border-b border-steel-100 bg-navy">
        <div className="h-1 w-full bg-knicks" />
        <div className="mx-auto max-w-7xl space-y-4 px-5 py-10 lg:px-8">
          <div className="h-3 w-40 animate-pulse rounded bg-white/15" />
          <div className="h-9 w-72 animate-pulse rounded bg-white/20" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-white/10" />
          <div className="flex gap-2 pt-2">
            <div className="h-6 w-28 animate-pulse rounded bg-white/15" />
            <div className="h-6 w-28 animate-pulse rounded bg-white/15" />
            <div className="h-6 w-36 animate-pulse rounded bg-knicks/40" />
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8">
        <div className="overflow-hidden rounded-lg border border-steel-300/70 bg-white shadow-sm">
          <div className="border-b border-steel-100 bg-steel-50/70 p-4">
            <div className="h-9 w-72 animate-pulse rounded bg-steel-100" />
          </div>
          <div className="divide-y divide-steel-100 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3.5">
                <div className="h-14 w-14 animate-pulse rounded-md bg-steel-100" />
                <div className="h-4 w-48 animate-pulse rounded bg-steel-100" />
                <div className="h-5 w-24 animate-pulse rounded bg-steel-100" />
                <div className="ml-auto h-4 w-16 animate-pulse rounded bg-steel-100" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
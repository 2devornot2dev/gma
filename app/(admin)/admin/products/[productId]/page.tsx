// app/(admin)/admin/products/[productId]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SingleProduct } from "@/components/products/single/single-product";
import { getProduct } from "@/lib/actions/get-product";

interface Params {
  params: Promise<{
    productId: string;
  }>;
}

export default function SingleProductPage({ params }: Params) {
  return (
    <Suspense fallback={<SingleProductSkeleton />}>
      <SingleProductContent params={params} />
    </Suspense>
  );
}

async function SingleProductContent({ params }: Params) {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  return <SingleProduct product={product} />;
}

function SingleProductSkeleton() {
  return (
    <div className="min-h-screen bg-steel-50">
      <div className="border-b border-steel-100 bg-navy">
        <div className="h-1 w-full bg-knicks" />
        <div className="mx-auto max-w-7xl space-y-4 px-5 py-10 lg:px-8">
          <div className="h-3 w-32 animate-pulse rounded bg-white/15" />
          <div className="h-9 w-80 animate-pulse rounded bg-white/20" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-white/10" />
        </div>
      </div>
      <main className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="aspect-square animate-pulse rounded-lg bg-steel-100 lg:col-span-5" />
          <div className="h-96 animate-pulse rounded-lg bg-white lg:col-span-7" />
        </div>
      </main>
    </div>
  );
}
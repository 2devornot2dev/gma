// components/products/single/single-product.tsx
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  CheckCircle2,
  FileSpreadsheet,
  ImageIcon,
  Layers,
  Scale,
  Snowflake,
  Tag,
} from "lucide-react";
import { PageHeader } from "@/components/misc/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CATEGORY_CONFIG,
  formatCurrency,
} from "@/components/products/product-table/category-config";
import type { SingleProductData } from "@/lib/actions/get-product";

interface SingleProductProps {
  product: SingleProductData;
}

export function SingleProduct({ product }: SingleProductProps) {
  const categoryMeta = CATEGORY_CONFIG[product.category];
  const shortSku = `GMA-${product.id.slice(-6).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-steel-50">
      <PageHeader
        backHref="/admin/products"
        backLabel="Back to Catalog"
        eyebrow={`GMA Wholesale Catalog • ${categoryMeta.label}`}
        title={product.name}
        description="Certified cold-chain protein product available for wholesale distribution and export."
        badges={[
          {
            label: "SKU",
            value: shortSku,
            variant: "primary",
            icon: <Tag className="h-3.5 w-3.5" />,
          },
          {
            label: "Category",
            value: categoryMeta.label,
            variant: "secondary",
            icon: <Layers className="h-3.5 w-3.5" />,
          },
          ...(product.weight
            ? [
                {
                  label: "Spec",
                  value: product.weight,
                  variant: "accent" as const,
                  icon: <Scale className="h-3.5 w-3.5" />,
                },
              ]
            : []),
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
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Price Sheet
            </a>
            <Link
              href={`/#quote?product=${encodeURIComponent(product.name)}`}
              className={cn(
                buttonVariants(),
                "bg-knicks text-xs font-bold uppercase tracking-widest text-white hover:bg-knicks-600"
              )}
            >
              Request Wholesale Quote
            </Link>
          </>
        }
      />

      <main className="mx-auto w-full max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-12">
          {/* Left: Product Image */}
          <div className="flex lg:col-span-5">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-steel-300/70 bg-white shadow-sm lg:h-full lg:min-h-[420px]">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  unoptimized
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-steel-100/60 text-steel">
                  <ImageIcon className="h-12 w-12 text-steel-300" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    No Image Available
                  </span>
                </div>
              )}

              <div className="absolute left-3 top-3">
                <Badge className="rounded-sm border border-white/15 bg-navy/90 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-xs">
                  {categoryMeta.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right: Wholesale Details & Specs */}
          <div className="flex lg:col-span-7">
            <div className="flex w-full flex-col justify-between gap-6 rounded-lg border border-steel-300/70 bg-white p-6 shadow-sm sm:p-8">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-steel-100 pb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-steel">
                      Wholesale Listed Price
                    </p>
                    <p className="mt-1 font-mono text-4xl font-black tracking-tight text-navy">
                      {formatCurrency(product.cost)}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-sm bg-steel-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-navy">
                    <CheckCircle2 className="h-4 w-4 text-knicks" />
                    In Catalog
                  </span>
                </div>

                {/* Spec Grid */}
                <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-md border border-steel-100 bg-steel-50/70 p-4">
                    <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-steel">
                      <Tag className="h-3.5 w-3.5 text-knicks" />
                      Product Code
                    </dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-navy">
                      {shortSku}
                    </dd>
                  </div>

                  <div className="rounded-md border border-steel-100 bg-steel-50/70 p-4">
                    <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-steel">
                      <Layers className="h-3.5 w-3.5 text-knicks" />
                      Category
                    </dt>
                    <dd className="mt-1 text-sm font-bold text-navy">
                      {categoryMeta.label}
                    </dd>
                  </div>

                  <div className="rounded-md border border-steel-100 bg-steel-50/70 p-4">
                    <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-steel">
                      <Scale className="h-3.5 w-3.5 text-knicks" />
                      Portion / Spec
                    </dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-navy">
                      {product.weight ?? "Standard Cut"}
                    </dd>
                  </div>

                  <div className="rounded-md border border-steel-100 bg-steel-50/70 p-4">
                    <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-steel">
                      <Snowflake className="h-3.5 w-3.5 text-knicks" />
                      Handling
                    </dt>
                    <dd className="mt-1 text-sm font-bold text-navy">
                      Controlled Cold Chain
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Logistics Callout anchored cleanly to bottom */}
              <div className="flex items-start gap-3 rounded-md border border-navy/15 bg-navy/5 p-4">
                <Box className="mt-0.5 h-5 w-5 shrink-0 text-navy" />
                <div className="text-xs leading-relaxed text-steel-900">
                  <strong className="font-bold uppercase tracking-wider text-navy">
                    Wholesale &amp; Export Ordering:
                  </strong>{" "}
                  Volume discounts, custom portioning, and container/pallet
                  configurations are available upon request.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
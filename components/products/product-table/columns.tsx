// components/products/product-table/columns.tsx
"use client";

import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ImageIcon, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_CONFIG, formatCurrency } from "./category-config";
import type { ProductTableFeatures } from "./features";
import type { ProductRow } from "./types";

interface BuildColumnsOptions {
  generatingIds: Record<string, boolean>;
  onGenerateImage: (product: ProductRow) => void;
}

export function buildProductColumns({
  generatingIds,
  onGenerateImage,
}: BuildColumnsOptions): ColumnDef<ProductTableFeatures, ProductRow>[] {
  return [
    {
      id: "image",
      header: "Image",
      enableSorting: false,
      cell: ({ row }) => {
        const product = row.original;
        const isGenerating = Boolean(generatingIds[product.id]);

        return (
          <div className="relative h-12 w-12 overflow-hidden rounded-md border border-steel-100 bg-steel-50">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-steel-300">
                <ImageIcon className="h-5 w-5" />
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-navy/75">
                <Loader2 className="h-4 w-4 animate-spin text-knicks" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      filterFn: "includesString",
      sortFn: "alphanumeric",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 font-bold uppercase tracking-wider text-steel-900 hover:bg-steel-50"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-steel-300" />
        </Button>
      ),
      cell: ({ row }) => {
        const { name, weight } = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-navy">{name}</span>
            {weight && (
              <span className="font-mono text-xs text-steel">
                Spec: {weight}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      sortFn: "text",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 font-bold uppercase tracking-wider text-steel-900 hover:bg-steel-50"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-steel-300" />
        </Button>
      ),
      filterFn: (row, columnId, filterValue: string[]) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue<string>(columnId));
      },
      cell: ({ row }) => {
        const category = row.original.category;
        const meta = CATEGORY_CONFIG[category];
        return (
          <Badge
            variant="outline"
            className={`rounded-sm px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${meta.badgeClass}`}
          >
            {meta.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "cost",
      sortFn: "basic",
      header: ({ column }) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="-mr-3 font-bold uppercase tracking-wider text-steel-900 hover:bg-steel-50"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-steel-300" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right font-mono text-sm font-bold text-steel-900">
          {formatCurrency(row.original.cost)}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      cell: ({ row }) => {
        const product = row.original;
        const isGenerating = Boolean(generatingIds[product.id]);

        return (
          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              variant={product.image ? "outline" : "default"}
              disabled={isGenerating}
              onClick={() => onGenerateImage(product)}
              className={
                product.image
                  ? "border-steel-300 text-xs font-semibold text-steel-700 hover:border-navy hover:text-navy"
                  : "bg-knicks text-xs font-bold uppercase tracking-wider text-white hover:bg-knicks-600"
              }
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  {product.image ? "Regenerate" : "Generate Image"}
                </>
              )}
            </Button>
          </div>
        );
      },
    },
  ];
}
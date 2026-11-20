// components/products/product-table/columns.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_CONFIG, formatCurrency } from "./category-config";
import type { ProductTableFeatures } from "./features";
import type { ProductRow } from "./types";

export const productColumns: ColumnDef<ProductTableFeatures, ProductRow>[] = [
  {
    id: "image",
    header: () => <span className="pl-2">Image</span>,
    enableSorting: false,
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="pl-2">
          <Link
            href={`/admin/products/${product.id}`}
            className="relative block h-14 w-14 overflow-hidden rounded-md border border-steel-300/60 bg-white shadow-2xs transition-opacity hover:opacity-85"
          >
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="56px"
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-steel-300">
                <ImageIcon className="h-5 w-5" />
              </div>
            )}
          </Link>
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
        className="-ml-3 text-xs font-extrabold uppercase tracking-wider text-navy hover:bg-steel-100"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Product
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-steel" />
      </Button>
    ),
    cell: ({ row }) => {
      const { id, name, weight } = row.original;
      return (
        <div className="flex items-center gap-2.5">
          <Link
            href={`/admin/products/${id}`}
            className="text-[15px] font-bold tracking-tight text-navy underline-offset-4 transition-colors hover:text-knicks hover:underline"
          >
            {name}
          </Link>
          {weight && (
            <span className="rounded bg-steel-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-steel-700">
              {weight}
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
        className="-ml-3 text-xs font-extrabold uppercase tracking-wider text-navy hover:bg-steel-100"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-steel" />
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
          className={`rounded-sm px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${meta.badgeClass}`}
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
      <div className="flex justify-end pr-4">
        <Button
          variant="ghost"
          size="sm"
          className="-mr-3 text-xs font-extrabold uppercase tracking-wider text-navy hover:bg-steel-100"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-steel" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="pr-4 text-right font-mono text-base font-bold text-navy">
        {formatCurrency(row.original.cost)}
      </div>
    ),
  },
];
// components/products/product-table/toolbar.tsx
"use client";

import type { Table } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/lib/generated/prisma/client";
import { CATEGORY_CONFIG } from "./category-config";
import type { ProductTableFeatures } from "./features";
import type { ProductRow } from "./types";

interface ProductTableToolbarProps {
  table: Table<ProductTableFeatures, ProductRow>;
  availableCategories: ProductCategory[];
}

export function ProductTableToolbar({
  table,
  availableCategories,
}: ProductTableToolbarProps) {
  const searchValue =
    (table.getColumn("name")?.getFilterValue() as string) ?? "";
  const selectedCategories =
    (table.getColumn("category")?.getFilterValue() as ProductCategory[]) ?? [];

  const isFiltered = searchValue.length > 0 || selectedCategories.length > 0;

  function toggleCategory(cat: ProductCategory) {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];

    table
      .getColumn("category")
      ?.setFilterValue(next.length > 0 ? next : undefined);
  }

  return (
    <div className="space-y-4 border-b border-steel-100 bg-steel-50/70 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel" />
          <Input
            placeholder="Search products (e.g. Filet Mignon, Cod)..."
            value={searchValue}
            onChange={(e) =>
              table.getColumn("name")?.setFilterValue(e.target.value)
            }
            className="border-steel-300 bg-white pl-9 text-steel-900 placeholder:text-steel-300 focus-visible:border-navy focus-visible:ring-navy/20"
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-medium text-steel">
          <span>
            Showing{" "}
            <strong className="font-mono text-navy">
              {table.getFilteredRowModel().rows.length}
            </strong>{" "}
            of{" "}
            <strong className="font-mono text-steel-900">
              {table.getCoreRowModel().rows.length}
            </strong>{" "}
            items
          </span>

          {isFiltered && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => table.resetColumnFilters()}
              className="h-7 px-2 text-xs font-semibold text-knicks-600 hover:bg-knicks/10 hover:text-knicks-600"
            >
              Reset
              <X className="ml-1 h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {availableCategories.map((cat) => {
          const active = selectedCategories.includes(cat);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={cn(
                "rounded-sm border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors",
                active
                  ? "border-knicks bg-knicks text-white"
                  : "border-steel-300 bg-white text-steel-700 hover:border-navy hover:text-navy"
              )}
            >
              {CATEGORY_CONFIG[cat].label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
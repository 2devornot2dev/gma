// components/products/product-table/index.tsx
"use client";

import * as React from "react";
import {
  useTable,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { ProductCategory } from "@/lib/generated/prisma/client";
import { buildProductColumns } from "./columns";
import { productTableFeatures } from "./features";
import { ProductTableToolbar } from "./toolbar";
import type { ProductRow } from "./types";

interface ProductTableProps {
  initialProducts: ProductRow[];
}

export function ProductTable({ initialProducts }: ProductTableProps) {
  const [products, setProducts] = React.useState<ProductRow[]>(initialProducts);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [generatingIds, setGeneratingIds] = React.useState<
    Record<string, boolean>
  >({});

  const availableCategories = React.useMemo(() => {
    const set = new Set<ProductCategory>();
    for (const p of products) set.add(p.category);
    return Array.from(set);
  }, [products]);

  const handleGenerateImage = React.useCallback(async (product: ProductRow) => {
    setGeneratingIds((prev) => ({ ...prev, [product.id]: true }));
    try {
      const res = await fetch(`/api/products/${product.id}/generate-image`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to generate image");
      const data: { id: string; image: string } = await res.json();

      setProducts((prev) =>
        prev.map((item) =>
          item.id === data.id ? { ...item, image: data.image } : item
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingIds((prev) => ({ ...prev, [product.id]: false }));
    }
  }, []);

  const columns = React.useMemo(
    () =>
      buildProductColumns({
        generatingIds,
        onGenerateImage: handleGenerateImage,
      }),
    [generatingIds, handleGenerateImage]
  );

  const table = useTable({
    features: productTableFeatures,
    data: products,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
    },
  });

  return (
    <div className="overflow-hidden rounded-lg border border-steel-100 bg-white shadow-sm">
      <ProductTableToolbar
        table={table}
        availableCategories={availableCategories}
      />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-steel-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-steel-100 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-11 text-xs">
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-steel-100 transition-colors hover:bg-steel-50/70"
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-sm text-steel"
                >
                  No products match your current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-steel-100 bg-steel-50/50 px-4 py-3 sm:flex-row">
        <p className="text-xs font-medium text-steel">
          Page{" "}
          <strong className="font-mono text-navy">
            {table.state.pagination.pageIndex + 1}
          </strong>{" "}
          of{" "}
          <strong className="font-mono text-navy">
            {Math.max(table.getPageCount(), 1)}
          </strong>
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-steel-300 text-steel-900 hover:border-navy hover:text-navy"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-steel-300 text-steel-900 hover:border-navy hover:text-navy"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
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
import { productColumns } from "./columns";
import { productTableFeatures } from "./features";
import { ProductTableToolbar } from "./toolbar";
import type { ProductRow } from "./types";

interface ProductTableProps {
  initialProducts: ProductRow[];
}

export function ProductTable({ initialProducts }: ProductTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const availableCategories = React.useMemo(() => {
    const set = new Set<ProductCategory>();
    for (const p of initialProducts) set.add(p.category);
    return Array.from(set);
  }, [initialProducts]);

  const table = useTable({
    features: productTableFeatures,
    data: initialProducts,
    columns: productColumns,
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
    <div className="overflow-hidden rounded-lg border border-steel-300/70 bg-white shadow-sm">
      <ProductTableToolbar
        table={table}
        availableCategories={availableCategories}
      />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="border-b-2 border-steel-300/80 bg-steel-100/90">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-none hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-12 text-xs font-extrabold uppercase tracking-wider text-navy"
                  >
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
                  className="border-b border-steel-100 odd:bg-white even:bg-steel-50/90 transition-colors hover:bg-knicks/10"
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5">
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={productColumns.length}
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
      <div className="flex flex-col items-center justify-between gap-3 border-t border-steel-300/70 bg-steel-100/60 px-4 py-3.5 sm:flex-row">
        <p className="text-xs font-semibold text-steel-700">
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
            className="border-steel-300 bg-white text-steel-900 hover:border-navy hover:text-navy"
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
            className="border-steel-300 bg-white text-steel-900 hover:border-navy hover:text-navy"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
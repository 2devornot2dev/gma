// components/products/product-table/category-config.ts
import type { ProductCategory } from "@/lib/generated/prisma/client";

export interface CategoryMeta {
  label: string;
  badgeClass: string;
}

export const CATEGORY_CONFIG: Record<ProductCategory, CategoryMeta> = {
  BEEF: {
    label: "Beef",
    badgeClass: "bg-navy text-white border-transparent",
  },
  PORK: {
    label: "Pork",
    badgeClass: "bg-steel text-white border-transparent",
  },
  VEAL: {
    label: "Veal",
    badgeClass: "bg-steel-700 text-white border-transparent",
  },
  LAMB: {
    label: "Lamb",
    badgeClass: "bg-navy-700 text-white border-transparent",
  },
  GAME: {
    label: "Game",
    badgeClass: "bg-steel-900 text-white border-transparent",
  },
  POULTRY: {
    label: "Poultry",
    badgeClass: "bg-knicks/15 text-knicks-600 border-knicks/30",
  },
  CHICKEN: {
    label: "Chicken",
    badgeClass: "bg-knicks/15 text-knicks-600 border-knicks/30",
  },
  FISH: {
    label: "Fish",
    badgeClass: "bg-navy/10 text-navy border-navy/25",
  },
  SHELLFISH: {
    label: "Shellfish & Seafood",
    badgeClass: "bg-navy/15 text-navy-700 border-navy/30",
  },
  APPETIZERS: {
    label: "Prepared & Appetizers",
    badgeClass: "bg-steel-100 text-steel-900 border-steel-300",
  },
  DESSERT: {
    label: "Desserts",
    badgeClass: "bg-knicks text-white border-transparent",
  },
  SPECIALTY: {
    label: "Specialty",
    badgeClass: "bg-knicks-600 text-white border-transparent",
  },
  OTHER: {
    label: "Other",
    badgeClass: "bg-steel-50 text-steel-700 border-steel-300",
  },
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amount);
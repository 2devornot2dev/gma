// lib/business-logic.ts
import type { ProductRow } from "@/lib/actions/get-products";

export const GMA_BUSINESS_RULES = {
  companyName: "GMA (Global Meat Import & Export)",
  headquarters: "Canada",
  currency: "CAD",
  supportEmail: "sales@gma-meats.example",
  hours: "Monday – Friday, 7:00 AM – 5:00 PM EST",
  minimumOrderValue: 500,
  volumeDiscounts: [
    { minSpend: 1000, discountPercent: 5, label: "5% off orders $1,000+" },
    { minSpend: 2500, discountPercent: 10, label: "10% off orders $2,500+" },
    { minSpend: 5000, discountPercent: 15, label: "15% off orders $5,000+" },
  ],
  coldChain: {
    leadTimeLocal: "24–48 hours within Canada",
    leadTimeExport: "3–7 business days via certified cold-chain freight",
    dryIceNote:
      "Dry ice (Full $44 CAD / Half $22 CAD) is recommended for long-haul or warm-weather transit.",
  },
  paymentTerms: "Prepaid for first order; Net-15 / Net-30 available for approved wholesale accounts.",
} as const;

export function calculateVolumeDiscount(subtotal: number) {
  const tier = [...GMA_BUSINESS_RULES.volumeDiscounts]
    .reverse()
    .find((t) => subtotal >= t.minSpend);

  const discountPercent = tier?.discountPercent ?? 0;
  const discountAmount = Number(((subtotal * discountPercent) / 100).toFixed(2));
  const total = Number((subtotal - discountAmount).toFixed(2));

  return { subtotal, discountPercent, discountAmount, total };
}

export function formatCatalogForPrompt(products: ProductRow[]): string {
  if (products.length === 0) return "No catalog items loaded.";

  return products
    .map((p) => {
      const spec = p.weight ? ` (${p.weight})` : "";
      return `- ${p.name}${spec} | ${p.category} | $${p.cost.toFixed(2)} CAD`;
    })
    .join("\n");
}

export function buildGmaSystemPrompt(products: ProductRow[] = []): string {
  const discountLines = GMA_BUSINESS_RULES.volumeDiscounts
    .map((d) => `  - ${d.label}`)
    .join("\n");

  const catalogBlock =
    products.length > 0
      ? `\n\nLIVE PRODUCT CATALOG (${products.length} SKUs):\n${formatCatalogForPrompt(products)}`
      : "";

  return [
    `You are the official wholesale assistant for ${GMA_BUSINESS_RULES.companyName}.`,
    "Be concise, direct, helpful, and accurate. Use CAD ($) for all prices.",
    "Never invent products or prices that are not in the catalog below. If an item isn't listed, say so and suggest the closest available cuts.",
    "",
    "BUSINESS RULES (MOCK):",
    `- Minimum wholesale order: $${GMA_BUSINESS_RULES.minimumOrderValue} ${GMA_BUSINESS_RULES.currency}`,
    `- Volume discount tiers:\n${discountLines}`,
    `- Cold-chain shipping: ${GMA_BUSINESS_RULES.coldChain.leadTimeLocal} (local) | ${GMA_BUSINESS_RULES.coldChain.leadTimeExport} (export).`,
    `- Packaging: ${GMA_BUSINESS_RULES.coldChain.dryIceNote}`,
    `- Payment terms: ${GMA_BUSINESS_RULES.paymentTerms}`,
    `- Support hours: ${GMA_BUSINESS_RULES.hours} (${GMA_BUSINESS_RULES.supportEmail})`,
    catalogBlock,
  ].join("\n");
}
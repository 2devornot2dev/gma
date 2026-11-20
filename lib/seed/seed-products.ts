// lib/seed/seed-products.ts
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  ProductCategory,
} from "@/lib/generated/prisma/client";
import { deleteAllByPrefix } from "@/lib/aws/s3";
import { generateAndSaveProductImage } from "@/lib/replicate";

const CATEGORY_MAP: Record<string, ProductCategory> = {
  beef: ProductCategory.BEEF,
  pork: ProductCategory.PORK,
  veal: ProductCategory.VEAL,
  lamb: ProductCategory.LAMB,
  game: ProductCategory.GAME,
  poultry: ProductCategory.POULTRY,
  chicken: ProductCategory.CHICKEN,
  fish: ProductCategory.FISH,
  "shellfish & seafood": ProductCategory.SHELLFISH,
  "prepared & appetizers": ProductCategory.APPETIZERS,
  desserts: ProductCategory.DESSERT,
  specialty: ProductCategory.SPECIALTY,
  other: ProductCategory.OTHER,
};

function mapCategory(raw: string): ProductCategory {
  return CATEGORY_MAP[raw.trim().toLowerCase()] ?? ProductCategory.OTHER;
}

function extractWeight(name: string): string | null {
  const match = name.match(/\b(\d+(?:\.\d+)?\s?oz|x{1,2}lp?|full|half)\b/i);
  return match ? match[1].replace(/\s+/g, " ").toUpperCase() : null;
}

function parseCsv(content: string) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.slice(1).map((line) => {
    const [rawName, rawCategory, rawPrice] = line.split(",");
    const name = rawName.trim();
    const category = mapCategory(rawCategory);
    const cost = Number.parseFloat(rawPrice.trim());

    if (!name || Number.isNaN(cost)) {
      throw new Error(`Invalid CSV row: "${line}"`);
    }

    return {
      name,
      category,
      cost,
      weight: extractWeight(name),
    };
  });
}

function parseLimit(): number | undefined {
  const arg = process.argv.find((a) => a.startsWith("--limit="));
  if (!arg) return undefined;
  const n = Number(arg.split("=")[1]);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL in .env");
  }

  const connectionString = databaseUrl.replace(
    "sslmode=require",
    "sslmode=verify-full"
  );
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const skipImages = process.argv.includes("--skip-images");
    const limit = parseLimit();

    console.log("[Seed] Deleting all existing products from database...");
    const { count: deletedRows } = await prisma.product.deleteMany();
    console.log(`[Seed] Deleted ${deletedRows} existing DB product row(s).`);

    console.log('[Seed] Deleting all existing S3 objects under "products/"...');
    await deleteAllByPrefix("products/");

    const csvPath = path.join(process.cwd(), "public", "gma-pricelist.csv");
    const csvContent = await fs.readFile(csvPath, "utf-8");
    const rows = parseCsv(csvContent);

    console.log(`[Seed] Inserting ${rows.length} products from CSV...`);
    await prisma.product.createMany({ data: rows });
    console.log(`[Seed] Inserted ${rows.length} products.`);

    if (skipImages) {
      console.log("[Seed] --skip-images passed, stopping before Replicate.");
      return;
    }

    const targets = await prisma.product.findMany({
      orderBy: { name: "asc" },
      ...(limit ? { take: limit } : {}),
    });

    console.log(
      `[Seed] Starting Replicate image generation for ${targets.length} product(s)...`
    );

    const BATCH_SIZE = 3;
    let succeeded = 0;
    let failed = 0;

    for (let i = 0; i < targets.length; i += BATCH_SIZE) {
      const batch = targets.slice(i, i + BATCH_SIZE);
      console.log(
        `\n[Seed] --- Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(targets.length / BATCH_SIZE)} ---`
      );

      await Promise.all(
        batch.map(async (product) => {
          try {
            const { key } = await generateAndSaveProductImage(
              product.name,
              product.category
            );
            await prisma.product.update({
              where: { id: product.id },
              data: { image: key },
            });
            succeeded++;
            console.log(
              `[Seed] [${succeeded + failed}/${targets.length}] ✓ Saved ${product.name} -> ${key}`
            );
          } catch (err) {
            failed++;
            console.error(
              `[Seed] [${succeeded + failed}/${targets.length}] ✗ FAILED ${product.name}:`,
              err
            );
          }
        })
      );

      if (i + BATCH_SIZE < targets.length) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    console.log(
      `\n[Seed] Finished. Succeeded: ${succeeded}/${targets.length} | Failed: ${failed}`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("[Seed] Fatal error:", err);
  process.exit(1);
});
// prisma/seed.ts
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  ProductCategory,
} from "@/lib/generated/prisma/client";
import {
  generateAndSaveProductImage,
  slugifyProductName,
} from "@/lib/replicate";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

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

  // Skip header row
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

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const shouldGenerateImages =
    process.argv.includes("--images") || process.env.SEED_IMAGES === "true";

  const csvPath = path.join(process.cwd(), "public", "gma-pricelist.csv");
  const csvContent = await fs.readFile(csvPath, "utf-8");
  const rows = parseCsv(csvContent);

  console.log(`Seeding ${rows.length} products from public/gma-pricelist.csv...`);

  for (const row of rows) {
    const localFilename = `${slugifyProductName(row.name)}.jpg`;
    const localAbsPath = path.join(
      process.cwd(),
      "public",
      "images",
      "products",
      localFilename
    );
    const hasLocalImage = await fileExists(localAbsPath);

    await prisma.product.upsert({
      where: { name: row.name },
      update: {
        category: row.category,
        cost: row.cost,
        weight: row.weight,
        ...(hasLocalImage ? { image: `/images/products/${localFilename}` } : {}),
      },
      create: {
        name: row.name,
        category: row.category,
        cost: row.cost,
        weight: row.weight,
        image: hasLocalImage ? `/images/products/${localFilename}` : null,
      },
    });
  }

  console.log("Database seed complete.");

  if (!shouldGenerateImages) {
    console.log(
      "Skipping Replicate image generation. Pass --images to generate missing product images."
    );
    return;
  }

  const missingImages = await prisma.product.findMany({
    where: { image: null },
    orderBy: { name: "asc" },
  });

  console.log(`Generating images for ${missingImages.length} products...`);

  // Process in small batches of 3 to avoid rate limits
  const BATCH_SIZE = 3;
  for (let i = 0; i < missingImages.length; i += BATCH_SIZE) {
    const batch = missingImages.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (product) => {
        try {
          const imagePath = await generateAndSaveProductImage(
            product.name,
            product.category
          );
          await prisma.product.update({
            where: { id: product.id },
            data: { image: imagePath },
          });
          console.log(`✓ Generated image for "${product.name}" -> ${imagePath}`);
        } catch (err) {
          console.error(`✗ Failed for "${product.name}":`, err);
        }
      })
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
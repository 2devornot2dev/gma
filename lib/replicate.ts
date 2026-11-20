// lib/replicate.ts

import type { ProductCategory } from "@/lib/generated/prisma/client";
import { uploadFromUrl, type UploadResult } from "@/lib/aws/s3";

export const REPLICATE_API_URL =
  "https://api.replicate.com/v1/models/prunaai/flux-fast/predictions";
export const PRODUCTS_IMAGE_MODEL = "flux-fast";

export interface ReplicateInput {
  prompt: string;
  seed?: number;
  guidance?: number;
  image_size?: number;
  speed_mode?: string;
  aspect_ratio?: "1:1" | "4:3" | "16:9" | "3:4";
  output_format?: "jpg" | "png" | "webp";
  output_quality?: number;
  num_inference_steps?: number;
  enable_safety_filter?: boolean;
}

interface ReplicatePredictionResponse {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed" | "canceled";
  output?: string | string[] | null;
  error?: string | null;
  urls?: { get: string };
}

export function slugifyProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CATEGORY_PROMPT_HINTS: Record<ProductCategory, string> = {
  BEEF: "premium butcher-cut beef, raw marbled cut with subtle fresh rosemary and cracked pepper on dark slate",
  PORK: "premium butcher-cut pork on clean dark slate board, fresh culinary presentation",
  VEAL: "fine gourmet veal cut on dark stone slate, clean butcher photography",
  LAMB: "premium trimmed lamb cut with subtle thyme sprig on dark slate",
  CHICKEN: "fresh gourmet chicken product, clean commercial food styling on dark stone",
  POULTRY: "premium gourmet poultry cut, clean editorial butcher styling on dark slate",
  GAME: "premium wild game meat cut, artisanal butcher presentation on dark slate",
  FISH: "fresh wild-caught fish fillet resting on crushed ice and dark slate, glistening, clean seafood photography",
  SHELLFISH: "fresh gourmet seafood on crushed ice and dark slate, vibrant natural color, commercial food photography",
  APPETIZERS: "chef-prepared gourmet appetizer plated cleanly on matte dark ceramic, warm appetizing lighting",
  DESSERT: "bakery-quality gourmet dessert plated cleanly on minimal slate plate, soft studio lighting",
  SPECIALTY: "gourmet specialty culinary delicacy, fine dining food photography on dark slate",
  OTHER: "clean commercial foodservice product studio shot on neutral light grey surface",
};

export function buildProductImagePrompt(
  name: string,
  category: ProductCategory
): string {
  const hint = CATEGORY_PROMPT_HINTS[category] ?? CATEGORY_PROMPT_HINTS.OTHER;
  return [
    `Commercial studio product photography of "${name}", ${hint}.`,
    "Centered composition, crisp focus, soft directional studio lighting, clean minimal background,",
    "high-end wholesale food catalog aesthetic, photorealistic, ultra sharp, no text, no labels, no watermarks, no hands.",
  ].join(" ");
}

export async function callReplicate(
  input: ReplicateInput
): Promise<string> {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error("Missing REPLICATE_API_TOKEN environment variable.");
  }

  const res = await fetch(REPLICATE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    },
    body: JSON.stringify({
      input: {
        seed: -1,
        guidance: 3.5,
        image_size: 1024,
        speed_mode: "Extra Juiced 🔥 (more speed)",
        aspect_ratio: "1:1",
        output_format: "jpg",
        output_quality: 80,
        num_inference_steps: 28,
        enable_safety_filter: false,
        ...input,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Replicate API error (${res.status}): ${text}`);
  }

  let prediction: ReplicatePredictionResponse = await res.json();

  // Fallback poll if "Prefer: wait" returned before completion
  let attempts = 0;
  while (
    (prediction.status === "starting" || prediction.status === "processing") &&
    prediction.urls?.get &&
    attempts < 20
  ) {
    await new Promise((r) => setTimeout(r, 1500));
    const pollRes = await fetch(prediction.urls.get, {
      headers: { Authorization: `Bearer ${token}` },
    });
    prediction = await pollRes.json();
    attempts++;
  }

  if (prediction.status !== "succeeded" || !prediction.output) {
    throw new Error(
      `Replicate prediction failed: ${prediction.error ?? prediction.status}`
    );
  }

  const imageUrl = Array.isArray(prediction.output)
    ? prediction.output[0]
    : prediction.output;

  if (!imageUrl) {
    throw new Error("Replicate returned empty output.");
  }

  return imageUrl;
}

/**
 * Generates an image via Replicate and persists it to /public/images/products/<slug>.jpg
 * Returns the public relative path for storing in Prisma (e.g. "/images/products/tomahawk.jpg").
 */
// lib/replicate.ts (replace generateAndSaveProductImage at the bottom)


export async function generateAndSaveProductImage(
  productName: string,
  category: ProductCategory
): Promise<UploadResult> {
  const prompt = buildProductImagePrompt(productName, category);
  const remoteUrl = await callReplicate({ prompt });

  const slug = slugifyProductName(productName);
  const key = `products/${slug}.jpg`;

  return uploadFromUrl(remoteUrl, key, "image/jpeg");
}
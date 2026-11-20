// app/api/products/[id]/generate-image/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAndSaveProductImage } from "@/lib/replicate";

interface Params {
  params: Promise<{
    productId: string;
  }>;
}

export async function POST(_req: Request, { params }: Params) {
  try {
    const { productId } = await params;
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const { key, url } = await generateAndSaveProductImage(
      product.name,
      product.category,
    );

    // Store the permanent S3 key in Postgres
    await prisma.product.update({
      where: { id: product.id },
      data: { image: key },
    });

    // Return the resolved/presigned URL so the table updates immediately
    return NextResponse.json({
      id: product.id,
      key,
      image: url,
    });
  } catch (error) {
    console.error("Admin product image generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate product image" },
      { status: 500 },
    );
  }
}

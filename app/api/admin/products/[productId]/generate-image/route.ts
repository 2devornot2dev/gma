// app/api/products/[id]/generate-image/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAndSaveProductImage } from "@/lib/replicate";

export async function POST(
  _req: Request,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await context.params;
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const imagePath = await generateAndSaveProductImage(
      product.name,
      product.category
    );

    // Cache-bust query param so browser refreshes updated images immediately
    const updated = await prisma.product.update({
      where: { id: product.id },
      data: { image: imagePath },
    });

    return NextResponse.json({
      id: updated.id,
      image: `${imagePath}?v=${Date.now()}`,
    });
  } catch (error) {
    console.error("Image generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate product image" },
      { status: 500 }
    );
  }
}
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{
    productId: string;
  }>;
}

export async function GET(_req: Request, { params }: Params) {
  const { productId } = await params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...product,
    cost: Number(product.cost), // Decimal -> number so the client doesn't get a string
  });
}
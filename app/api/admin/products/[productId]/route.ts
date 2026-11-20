import { prisma } from "@/lib/prisma"

interface Params {
    params: Promise<{
        productId: string
    }>
}

export async function GET(req: Request, {params}: Params) {
 const { productId } = await params

 const product = await prisma.product.findUnique({
    where: {id: productId}
 })
 return product
}

// export awaited
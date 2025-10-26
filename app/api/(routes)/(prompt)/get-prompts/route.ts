import prisma from "@/lib/prismaDb";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "url";

export async function GET(req: NextRequest) {
  try {
    const { query } = parse(req.url, true);
    const pageNumber = query.page ? parseInt(query.page.toString(), 10) : 1;

    const pageSize = 8;

    // Updated to use new Prisma schema (prompt instead of prompts)
    const prompts: any = await prisma.prompt.findMany({
      include: {
        orders: true,
        images: true,
        reviews: true,
        promptFiles: true, // Updated from promptUrl to promptFiles
        shop: true, // Include shop relation directly
      },
      where: {
        status: "Live",
      },
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalPrompts: any = await prisma.prompt.findMany({
      where: {
        status: "Live",
      },
      include: {
        images: true,
        shop: true, // Include shop relation directly
      },
    });

    // Transform to match expected format (MongoDB -> PostgreSQL)
    const transformedPrompts = prompts.map((p: any) => ({
      ...p,
      name: p.title, // Map title to name for backward compatibility
      price: Number(p.price),
      rating: Number(p.rating),
      sellerId: p.shopId, // Map shopId to sellerId for backward compatibility
    }));

    const transformedTotalPrompts = totalPrompts.map((p: any) => ({
      ...p,
      name: p.title,
      price: Number(p.price),
      rating: Number(p.rating),
      sellerId: p.shopId,
    }));

    return NextResponse.json({ 
      prompts: transformedPrompts, 
      totalPrompts: transformedTotalPrompts 
    });
  } catch (error) {
    console.log("get prompts error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

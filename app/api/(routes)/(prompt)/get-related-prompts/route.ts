import prisma from "@/lib/prismaDb";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "url";

export async function GET(req: NextRequest) {
  try {
    const { query } = parse(req.url, true);
    const promptCategory = query.promptCategory as string || "";

    if (!promptCategory) {
      return new NextResponse("Missing 'promptCategory' in the request.", {
        status: 400,
      });
    }

    // Updated to use new Prisma schema
    const prompts: any = await prisma.prompt.findMany({
      include: {
        orders: true,
        images: true,
        reviews: true,
        promptFiles: true, // Updated from promptUrl
        shop: true, // Include shop relation directly
      },
      where: {
        category: promptCategory,
        status: "Live",
      },
      take: 6, // Limit related prompts
    });

    // Transform to match expected format
    const transformedPrompts = prompts.map((p: any) => ({
      ...p,
      name: p.title,
      price: Number(p.price),
      rating: Number(p.rating),
      sellerId: p.shopId,
    }));

    return NextResponse.json(transformedPrompts);
  } catch (error) {
    console.log("get prompts error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

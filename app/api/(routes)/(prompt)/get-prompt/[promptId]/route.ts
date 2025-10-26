import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaDb";
import { clerkClient } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const promptId = resolvedParams.promptId;

    if (!promptId) {
      return new NextResponse("Missing 'promptId' query parameter", {
        status: 400,
      });
    }

    // Updated to use new Prisma schema
    const prompt: any = await prisma.prompt.findUnique({
      include: {
        orders: true,
        images: true,
        reviews: {
          include: {
            user: true, // Include user relation directly
          },
        },
        promptFiles: true, // Updated from promptUrl
        shop: true, // Include shop relation directly
      },
      where: {
        id: promptId,
      },
    });

    if (!prompt) {
      return new NextResponse("Prompt not found", { status: 404 });
    }

    // Transform to match expected format
    const transformedPrompt = {
      ...prompt,
      name: prompt.title,
      price: Number(prompt.price),
      rating: Number(prompt.rating),
      sellerId: prompt.shopId,
    };

    return NextResponse.json(transformedPrompt);
  } catch (error) {
    console.log("get prompts error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaDb";

export async function GET(req: NextRequest) {
  try {
    // Updated to use new Prisma schema (shop instead of shops)
    const sellers = await prisma.shop.findMany({
      take: 4,
      orderBy: {
        allProducts: "desc",
      },
      include: {
        owner: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Transform to match expected format
    const transformedSellers = sellers.map((shop: any) => ({
      ...shop,
      userId: shop.ownerId, // Map ownerId to userId for backward compatibility
      avatar: shop.avatarUrl, // Map avatarUrl to avatar
      description: shop.bio, // Map bio to description
    }));

    return NextResponse.json(transformedSellers);
  } catch (error) {
    console.log("load user error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

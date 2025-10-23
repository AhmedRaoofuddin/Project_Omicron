/**
 * Search API Route
 * Provides Elasticsearch-powered search with Prisma fallback
 */

import { NextResponse } from "next/server";
import { esClient, isElasticsearchAvailable, PROMPTS_INDEX } from "@/lib/elastic";
import prismaDb from "@/lib/prismaDb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    // Return empty if no query
    if (!query.trim()) {
      return NextResponse.json([]);
    }

    // Check if Elasticsearch is available
    const esAvailable = await isElasticsearchAvailable();

    if (esAvailable && esClient) {
      // Use Elasticsearch for search
      try {
        const result = await esClient.search({
          index: PROMPTS_INDEX,
          query: {
            multi_match: {
              query,
              fields: ["title^3", "description", "category", "sellerName"],
              fuzziness: "AUTO",
            },
          },
          size: 6,
        });

        const hits = result.hits.hits.map((h: any) => ({
          id: h._id,
          ...h._source,
        }));

        return NextResponse.json(hits);
      } catch (esError) {
        console.error("Elasticsearch search error:", esError);
        // Fall through to Prisma fallback
      }
    }

    // Fallback to Prisma database search
    const prompts = await prismaDb.prompts.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: 6,
    });

    // Get unique seller IDs to fetch shop names
    const sellerIds = Array.from(new Set(prompts.map((p) => p.sellerId)));
    const shops = await prismaDb.shops.findMany({
      where: {
        userId: { in: sellerIds },
      },
      select: {
        userId: true,
        name: true,
      },
    });

    // Create a map of seller ID to shop name
    const shopMap = new Map(shops.map((shop) => [shop.userId, shop.name]));

    // Format results to match Elasticsearch structure
    const formattedResults = prompts.map((prompt) => ({
      id: prompt.id,
      title: prompt.name,
      description: prompt.description || "",
      category: prompt.category,
      price: prompt.price,
      sellerName: shopMap.get(prompt.sellerId) || "Unknown",
      image: prompt.images[0]?.url || "/demo/seed/prompt-placeholder.svg",
      rating:
        prompt.reviews.length > 0
          ? prompt.reviews.reduce((sum, r) => sum + r.rating, 0) /
            prompt.reviews.length
          : 0,
    }));

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}


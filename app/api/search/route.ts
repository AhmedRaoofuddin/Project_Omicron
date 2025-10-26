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

    // Fallback to Supabase Full-Text Search (PostgreSQL)
    try {
      // Try FTS first (fastest, uses search_vector index)
      const ftsResults: any[] = await prismaDb.$queryRaw`
        SELECT 
          p.id::text as id,
          p.title,
          p.description,
          p.category,
          p.price::float,
          p.image_url as image,
          p.rating::float,
          s.name as "sellerName",
          ts_rank(p.search_vector, plainto_tsquery('simple', unaccent(${query}))) as rank
        FROM prompts p
        LEFT JOIN shops s ON p.shop_id = s.id
        WHERE p.search_vector @@ plainto_tsquery('simple', unaccent(${query}))
          AND p.status = 'Live'
        ORDER BY rank DESC, p.rating DESC
        LIMIT 8
      `;

      if (ftsResults && ftsResults.length > 0) {
        return NextResponse.json(ftsResults.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description || "",
          category: r.category || "",
          price: Number(r.price),
          image: r.image || "/demo/seed/prompt-placeholder.svg",
          rating: Number(r.rating),
          sellerName: r.sellerName || "Unknown"
        })));
      }
    } catch (ftsError) {
      console.warn("FTS search failed, falling back to ILIKE:", ftsError);
    }

    // Final fallback: ILIKE search (slower but always works)
    const prompts = await prismaDb.prompt.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ],
        status: "Live",
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
        shop: {
          select: {
            name: true,
          },
        },
      },
      take: 8,
      orderBy: [
        { rating: "desc" },
        { createdAt: "desc" },
      ],
    });

    // Format results to match structure
    const formattedResults = prompts.map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      description: prompt.description || "",
      category: prompt.category || "",
      price: Number(prompt.price),
      sellerName: prompt.shop?.name || "Unknown",
      image: prompt.images[0]?.url || prompt.imageUrl || "/demo/seed/prompt-placeholder.svg",
      rating: prompt.reviews.length > 0
        ? prompt.reviews.reduce((sum, r) => sum + r.rating, 0) / prompt.reviews.length
        : prompt.rating,
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


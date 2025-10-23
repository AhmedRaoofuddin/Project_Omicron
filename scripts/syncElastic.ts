/**
 * Elasticsearch Index Sync Script
 * Syncs all prompts from MongoDB to Elasticsearch
 * 
 * Usage: npm run sync:elastic
 */

import prismaDb from "../lib/prismaDb";
import { esClient, isElasticsearchAvailable, PROMPTS_INDEX } from "../lib/elastic";

async function main() {
  try {
    console.log("🔍 Checking Elasticsearch connection...");

    const esAvailable = await isElasticsearchAvailable();

    if (!esAvailable || !esClient) {
      console.error("❌ Elasticsearch is not available. Please check your ELASTICSEARCH_NODE and ELASTICSEARCH_API_KEY environment variables.");
      process.exit(1);
    }

    console.log("✅ Connected to Elasticsearch");

    // Check if index exists, if not create it
    try {
      const indexExists = await esClient.indices.exists({ index: PROMPTS_INDEX });
      
      if (!indexExists) {
        console.log(`📦 Creating index: ${PROMPTS_INDEX}`);
        await esClient.indices.create({
          index: PROMPTS_INDEX,
          mappings: {
            properties: {
              title: { type: "text", analyzer: "standard" },
              description: { type: "text" },
              category: { type: "keyword" },
              price: { type: "float" },
              sellerName: { type: "text" },
              image: { type: "keyword" },
              rating: { type: "float" },
            },
          },
        });
        console.log(`✅ Index created: ${PROMPTS_INDEX}`);
      } else {
        console.log(`✅ Index already exists: ${PROMPTS_INDEX}`);
      }
    } catch (error) {
      console.error("Error checking/creating index:", error);
    }

    console.log("📚 Fetching prompts from database...");

    const prompts = await prismaDb.prompts.findMany({
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

    console.log(`✅ Found ${prompts.length} prompts`);

    if (prompts.length === 0) {
      console.log("⚠️  No prompts to sync. Run 'npm run seed' first.");
      return;
    }

    console.log("🔄 Syncing to Elasticsearch...");

    let successCount = 0;
    let errorCount = 0;

    for (const prompt of prompts) {
      try {
        const rating =
          prompt.reviews.length > 0
            ? prompt.reviews.reduce((sum, r) => sum + r.rating, 0) /
              prompt.reviews.length
            : 0;

        await esClient.index({
          index: PROMPTS_INDEX,
          id: prompt.id.toString(),
          document: {
            title: prompt.name,
            description: prompt.description || "",
            category: prompt.category,
            price: prompt.price,
            sellerName: shopMap.get(prompt.sellerId) || "Unknown",
            image: prompt.images[0]?.url || "/demo/seed/prompt-placeholder.svg",
            rating: rating,
          },
        });

        successCount++;
        process.stdout.write(`\r✅ Synced: ${successCount}/${prompts.length}`);
      } catch (error) {
        errorCount++;
        console.error(`\n❌ Error syncing prompt ${prompt.id}:`, error);
      }
    }

    // Refresh index to make changes immediately available
    await esClient.indices.refresh({ index: PROMPTS_INDEX });

    console.log("\n\n✅ Elasticsearch sync complete!");
    console.log(`   Success: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
  } catch (error) {
    console.error("❌ Sync failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("\n🎉 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });


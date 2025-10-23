/**
 * Elasticsearch client for search functionality
 * Provides connection to Elasticsearch with fallback to Prisma
 */

import { Client } from "@elastic/elasticsearch";

// Initialize Elasticsearch client with environment config
export const esClient = process.env.ELASTICSEARCH_NODE
  ? new Client({
      node: process.env.ELASTICSEARCH_NODE,
      ...(process.env.ELASTICSEARCH_API_KEY && {
        auth: { apiKey: process.env.ELASTICSEARCH_API_KEY },
      }),
    })
  : null;

// Check if Elasticsearch is available
export async function isElasticsearchAvailable(): Promise<boolean> {
  if (!esClient) return false;
  
  try {
    await esClient.ping();
    return true;
  } catch (error) {
    console.warn("Elasticsearch not available, falling back to database search");
    return false;
  }
}

// Elasticsearch index name
export const PROMPTS_INDEX = "prompts";


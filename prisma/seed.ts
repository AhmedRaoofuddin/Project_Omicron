/**
 * Seed script for demo mode
 * Creates sample prompts and shops for testing
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if shop already exists
  let sellerShop = await prisma.shops.findUnique({
    where: { userId: 'demo_user_seller' },
  });

  if (!sellerShop) {
    sellerShop = await prisma.shops.create({
      data: {
        userId: 'demo_user_seller',
        name: 'Demo AI Prompts Shop',
        description: 'High-quality AI prompts for various use cases',
        shopProductsType: 'AI Prompts',
        avatar: '/demo/avatars/seller.png',
        ratings: 4.8,
        totalSales: 125,
        allProducts: 12,
      },
    });
    console.log('✅ Created seller shop');
  } else {
    console.log('✅ Seller shop already exists');
  }

  // Sample prompt data
  const promptsData = [
    {
      name: 'ChatGPT Marketing Expert',
      shortDescription: 'Professional marketing strategies and campaigns',
      description: 'Get expert marketing advice, campaign ideas, and strategy recommendations from this specialized ChatGPT prompt.',
      category: 'Marketing',
      tags: 'marketing,business,strategy',
      price: 9.99,
      estimatedPrice: 19.99,
      rating: 4.9,
    },
    {
      name: 'Midjourney Art Generator',
      shortDescription: 'Create stunning digital artwork',
      description: 'Generate beautiful, professional-quality digital art with this Midjourney prompt template.',
      category: 'Design',
      tags: 'art,design,midjourney',
      price: 14.99,
      estimatedPrice: 29.99,
      rating: 4.7,
    },
    {
      name: 'Content Writing Assistant',
      shortDescription: 'Blog posts and articles in minutes',
      description: 'Create engaging blog posts, articles, and web content quickly and efficiently.',
      category: 'Writing',
      tags: 'writing,content,blog',
      price: 7.99,
      estimatedPrice: 14.99,
      rating: 4.6,
    },
    {
      name: 'Code Review Expert',
      shortDescription: 'Get detailed code reviews and suggestions',
      description: 'Receive thorough code reviews with security, performance, and best practice recommendations.',
      category: 'Development',
      tags: 'coding,programming,development',
      price: 12.99,
      estimatedPrice: 24.99,
      rating: 4.8,
    },
    {
      name: 'Social Media Manager',
      shortDescription: 'Plan and create social media content',
      description: 'Generate social media posts, captions, and content calendars for all major platforms.',
      category: 'Marketing',
      tags: 'social-media,marketing,content',
      price: 8.99,
      estimatedPrice: 17.99,
      rating: 4.5,
    },
    {
      name: 'SEO Optimizer',
      shortDescription: 'Optimize content for search engines',
      description: 'Get SEO recommendations, keyword strategies, and content optimization tips.',
      category: 'Marketing',
      tags: 'seo,marketing,optimization',
      price: 11.99,
      estimatedPrice: 22.99,
      rating: 4.7,
    },
  ];

  // Create prompts
  for (const promptData of promptsData) {
    const prompt = await prisma.prompts.create({
      data: {
        ...promptData,
        sellerId: 'demo_user_seller',
        status: 'Live',
      },
    });

    // Add a sample image
    await prisma.images.create({
      data: {
        promptId: prompt.id,
        public_id: `demo_${prompt.id}_cover`,
        url: '/demo/seed/prompt-placeholder.svg',
      },
    });

    // Add a sample prompt file
    await prisma.promptFiles.create({
      data: {
        promptsId: prompt.id,
        public_id: `demo_${prompt.id}_file`,
        url: '/demo/seed/sample-prompt.txt',
      },
    });

    // Add a sample review
    await prisma.reviews.create({
      data: {
        promptId: prompt.id,
        userId: 'demo_user_buyer',
        rating: promptData.rating,
        comment: 'Excellent prompt! Very helpful and well-structured. Highly recommended!',
      },
    });

    console.log(`✅ Created prompt: ${prompt.name}`);
  }

  console.log('\n✅ Seeding complete! Created:');
  console.log(`  - 1 shop`);
  console.log(`  - ${promptsData.length} prompts`);
  console.log(`  - ${promptsData.length} images`);
  console.log(`  - ${promptsData.length} reviews`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


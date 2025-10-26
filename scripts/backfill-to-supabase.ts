/**
 * Backfill/Seed Script for Supabase
 * Attempts to migrate data from MongoDB if available, otherwise seeds demo data
 */

import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';

const prisma = new PrismaClient();

// Demo user IDs for Clerk (matching our demo auth system)
const DEMO_USERS = {
  buyer: { clerkId: 'demo-buyer-1', name: 'Demo Buyer', email: 'buyer@demo.com', role: 'buyer' },
  seller: { clerkId: 'demo-seller-1', name: 'Demo Seller', email: 'seller@demo.com', role: 'seller' },
  admin: { clerkId: 'demo-admin-1', name: 'Demo Admin', email: 'admin@demo.com', role: 'admin' },
};

async function tryMongoBackfill(): Promise<boolean> {
  const mongoUrl = process.env.DATABASE_URL_MONGO;
  
  if (!mongoUrl) {
    console.log('📦 No MongoDB URL found, will seed demo data instead\n');
    return false;
  }

  try {
    console.log('🔄 Attempting to backfill from MongoDB...\n');
    const client = new MongoClient(mongoUrl);
    await client.connect();
    const db = client.db();

    // Backfill users (from Clerk IDs if available)
    const mongoShops = await db.collection('Shops').find().toArray();
    console.log(`Found ${mongoShops.length} shops in MongoDB`);

    // Backfill shops and prompts
    let promptCount = 0;
    for (const shop of mongoShops) {
      // Create/get user for shop owner
      const user = await prisma.user.upsert({
        where: { clerkId: shop.userId || `mongo-user-${shop._id}` },
        update: {},
        create: {
          clerkId: shop.userId || `mongo-user-${shop._id}`,
          name: shop.name + ' Owner',
          role: 'seller',
        },
      });

      // Create shop
      const newShop = await prisma.shop.create({
        data: {
          ownerId: user.id,
          name: shop.name,
          bio: shop.description || '',
          totalSales: shop.totalSales || 0,
          allProducts: shop.allProducts || 0,
          ratings: shop.ratings || 0,
        },
      });

      // Backfill prompts for this shop
      const mongoPrompts = await db.collection('Prompts').find({ sellerId: shop.userId }).toArray();
      
      for (const mp of mongoPrompts) {
        const prompt = await prisma.prompt.create({
          data: {
            shopId: newShop.id,
            title: mp.name,
            shortDescription: mp.shortDescription || '',
            description: mp.description || '',
            category: mp.category || 'General',
            tags: mp.tags || '',
            price: mp.price,
            estimatedPrice: mp.estimatedPrice,
            rating: mp.rating || 0,
            status: mp.status || 'Live',
          },
        });

        // Backfill images
        const mongoImages = await db.collection('Images').find({ promptId: mp._id.toString() }).toArray();
        for (const img of mongoImages) {
          await prisma.image.create({
            data: {
              promptId: prompt.id,
              url: img.url,
            },
          });
        }

        // Backfill reviews
        const mongoReviews = await db.collection('Reviews').find({ promptId: mp._id.toString() }).toArray();
        for (const rev of mongoReviews) {
          // Get or create user for review
          const reviewUser = await prisma.user.upsert({
            where: { clerkId: rev.userId || `mongo-reviewer-${rev._id}` },
            update: {},
            create: {
              clerkId: rev.userId || `mongo-reviewer-${rev._id}`,
              name: 'User ' + rev.userId?.substring(0, 8),
            },
          });

          await prisma.review.create({
            data: {
              promptId: prompt.id,
              userId: reviewUser.id,
              rating: Math.round(rev.rating),
              comment: rev.comment || '',
            },
          });
        }

        promptCount++;
      }
    }

    await client.close();
    console.log(`✅ Backfilled ${promptCount} prompts from MongoDB\n`);
    return true;

  } catch (error) {
    console.log(`⚠️  MongoDB backfill failed: ${(error as Error).message}`);
    console.log('📦 Will seed demo data instead\n');
    return false;
  }
}

async function seedDemoData() {
  console.log('🌱 Seeding demo data to Supabase...\n');

  // Create demo users
  console.log('Creating demo users...');
  const buyer = await prisma.user.upsert({
    where: { clerkId: DEMO_USERS.buyer.clerkId },
    update: {},
    create: DEMO_USERS.buyer,
  });

  const seller = await prisma.user.upsert({
    where: { clerkId: DEMO_USERS.seller.clerkId },
    update: {},
    create: DEMO_USERS.seller,
  });

  const admin = await prisma.user.upsert({
    where: { clerkId: DEMO_USERS.admin.clerkId },
    update: {},
    create: DEMO_USERS.admin,
  });

  console.log(`✅ Created 3 users\n`);

  // Create demo shop
  console.log('Creating demo shop...');
  const shop = await prisma.shop.create({
    data: {
      ownerId: seller.id,
      name: 'PromptPlace Pro Shop',
      bio: 'Premium AI prompts for every platform - ChatGPT, Midjourney, Stable Diffusion, and more!',
      avatarUrl: '/demo/avatars/seller.svg',
      totalSales: 127,
      allProducts: 12,
      ratings: 4.8,
    },
  });

  console.log(`✅ Created shop: ${shop.name}\n`);

  // Create demo prompts with realistic data
  console.log('Creating demo prompts...');
  
  const prompts = [
    {
      title: 'Midjourney Artistic Portrait Generator',
      category: 'Design',
      tags: 'art,portrait,midjourney,creative',
      price: 14.99,
      rating: 4.9,
      description: 'Professional portrait prompts for Midjourney v6. Create stunning artistic portraits with detailed lighting, composition, and style controls.',
      imageUrl: '/demo/seed/prompt-placeholder.svg',
    },
    {
      title: 'ChatGPT Marketing Campaign Expert',
      category: 'Marketing',
      tags: 'marketing,chatgpt,campaigns,strategy',
      price: 9.99,
      rating: 4.7,
      description: 'Complete marketing campaign generator for ChatGPT. Includes social media, email, and content strategies for any product or service.',
      imageUrl: '/demo/seed/prompt-placeholder.svg',
    },
    {
      title: 'SEO Content Optimizer Pro',
      category: 'Writing',
      tags: 'seo,writing,content,optimization',
      price: 11.99,
      rating: 4.8,
      description: 'Advanced SEO-optimized content creation prompts. Perfect for blog posts, articles, and landing pages that rank.',
      imageUrl: '/demo/seed/prompt-placeholder.svg',
    },
    {
      title: 'Full-Stack Code Assistant',
      category: 'Development',
      tags: 'code,programming,development,fullstack',
      price: 19.99,
      rating: 5.0,
      description: 'Comprehensive coding prompts for ChatGPT and Claude. Covers React, Node.js, Python, databases, and deployment.',
      imageUrl: '/demo/seed/prompt-placeholder.svg',
    },
    {
      title: 'Stable Diffusion Fantasy Art Pack',
      category: 'Design',
      tags: 'fantasy,stablediffusion,art,illustration',
      price: 16.99,
      rating: 4.9,
      description: 'Create breathtaking fantasy scenes with Stable Diffusion. Includes character designs, landscapes, and magical elements.',
      imageUrl: '/demo/seed/prompt-placeholder.svg',
    },
    {
      title: 'Social Media Content Creator',
      category: 'Marketing',
      tags: 'socialmedia,content,instagram,tiktok',
      price: 8.99,
      rating: 4.6,
      description: 'Generate viral social media content for Instagram, TikTok, Twitter, and LinkedIn. Includes captions, hashtags, and hooks.',
      imageUrl: '/demo/seed/prompt-placeholder.svg',
    },
    {
      title: 'Business Email Writer',
      category: 'Writing',
      tags: 'email,business,professional,communication',
      price: 7.99,
      rating: 4.5,
      description: 'Professional business email templates for any situation. Sales, follow-ups, apologies, negotiations, and more.',
      imageUrl: '/demo/seed/prompt-placeholder.svg',
    },
    {
      title: 'Python Automation Scripts',
      category: 'Development',
      tags: 'python,automation,scripts,productivity',
      price: 15.99,
      rating: 4.8,
      description: 'Ready-to-use Python automation prompts. Web scraping, data processing, file management, and task scheduling.',
      imageUrl: '/demo/seed/prompt-placeholder.svg',
    },
    {
      title: 'Logo Design Generator',
      category: 'Design',
      tags: 'logo,branding,design,midjourney',
      price: 12.99,
      rating: 4.7,
      description: 'Create professional logos with AI. Includes prompts for various styles, industries, and brand personalities.',
      imageUrl: '/demo/seed/prompt-placeholder.svg',
    },
    {
      title: 'E-commerce Product Descriptions',
      category: 'Marketing',
      tags: 'ecommerce,products,descriptions,sales',
      price: 10.99,
      rating: 4.6,
      description: 'Convert browsers into buyers with compelling product descriptions. Optimized for SEO and conversion.',
      imageUrl: '/demo/seed/prompt-placeholder.svg',
    },
    {
      title: 'Technical Documentation Writer',
      category: 'Writing',
      tags: 'documentation,technical,api,guides',
      price: 13.99,
      rating: 4.9,
      description: 'Create clear, comprehensive technical documentation. Perfect for APIs, software guides, and user manuals.',
      imageUrl: '/demo/seed/prompt-placeholder.svg',
    },
    {
      title: 'React Component Builder',
      category: 'Development',
      tags: 'react,components,frontend,ui',
      price: 17.99,
      rating: 5.0,
      description: 'Generate production-ready React components. Includes TypeScript, hooks, styling, and best practices.',
      imageUrl: '/demo/seed/prompt-placeholder.svg',
    },
  ];

  const createdPrompts = [];
  
  for (const promptData of prompts) {
    const prompt = await prisma.prompt.create({
      data: {
        shopId: shop.id,
        ...promptData,
        shortDescription: promptData.description.substring(0, 100),
      },
    });

    // Add images
    await prisma.image.create({
      data: {
        promptId: prompt.id,
        url: promptData.imageUrl,
      },
    });

    // Add 2-3 reviews for each prompt
    const reviewCount = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < reviewCount; i++) {
      await prisma.review.create({
        data: {
          promptId: prompt.id,
          userId: buyer.id,
          rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
          comment: [
            'Excellent prompts! Exactly what I needed.',
            'Great value for money. Highly recommend!',
            'These prompts saved me hours of work.',
            'Professional quality, easy to use.',
            'Outstanding results with these prompts!',
          ][Math.floor(Math.random() * 5)],
        },
      });
    }

    createdPrompts.push(prompt);
  }

  console.log(`✅ Created ${createdPrompts.length} prompts\n`);

  // Create some demo orders
  console.log('Creating demo orders...');
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        promptId: createdPrompts[0].id,
        buyerId: buyer.id,
        amount: createdPrompts[0].price,
        paymentMethod: 'stripe',
        paymentId: 'demo_payment_1',
        status: 'paid',
      },
    }),
    prisma.order.create({
      data: {
        promptId: createdPrompts[3].id,
        buyerId: buyer.id,
        amount: createdPrompts[3].price,
        paymentMethod: 'stripe',
        paymentId: 'demo_payment_2',
        status: 'paid',
      },
    }),
    prisma.order.create({
      data: {
        promptId: createdPrompts[7].id,
        buyerId: buyer.id,
        amount: createdPrompts[7].price,
        paymentMethod: 'stripe',
        paymentId: 'demo_payment_3',
        status: 'paid',
      },
    }),
  ]);

  console.log(`✅ Created ${orders.length} orders\n`);
}

async function main() {
  console.log('🚀 Starting Supabase backfill/seed process...\n');

  try {
    // Try MongoDB backfill first
    const backfilled = await tryMongoBackfill();

    // If backfill failed or no MongoDB, seed demo data
    if (!backfilled) {
      await seedDemoData();
    }

    // Print summary
    console.log('📊 Database Summary:');
    const counts = {
      users: await prisma.user.count(),
      shops: await prisma.shop.count(),
      prompts: await prisma.prompt.count(),
      images: await prisma.image.count(),
      reviews: await prisma.review.count(),
      orders: await prisma.order.count(),
    };

    console.table(counts);

    console.log('\n✅ Backfill/seed complete!\n');
  } catch (error) {
    console.error('❌ Error during backfill/seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();


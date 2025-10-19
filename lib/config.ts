/**
 * Global configuration and feature flags
 */

export const DEMO = process.env.DEV_DEMO_MODE === '1';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const config = {
  demo: DEMO,
  appUrl: APP_URL,
  
  // Service flags
  useRealAuth: !DEMO,
  useRealUploads: !DEMO,
  useRealPayments: !DEMO,
  
  // Demo user presets
  demoUsers: {
    buyer: {
      id: 'demo_user_buyer',
      email: 'buyer@example.com',
      firstName: 'Demo',
      lastName: 'Buyer',
      role: 'buyer',
      imageUrl: '/demo/avatars/buyer.svg',
    },
    seller: {
      id: 'demo_user_seller',
      email: 'seller@example.com',
      firstName: 'Demo',
      lastName: 'Seller',
      role: 'seller',
      imageUrl: '/demo/avatars/seller.svg',
    },
    admin: {
      id: 'demo_user_admin',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      imageUrl: '/demo/avatars/admin.svg',
    },
  },
} as const;


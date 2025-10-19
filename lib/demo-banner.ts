/**
 * Display demo mode banner in console on server start
 * Only shown ONCE on initial server startup
 */

import { config } from './config';

let bannerShown = false;

export function showDemoBanner() {
  if (!config.demo || bannerShown) return;
  
  bannerShown = true;

  console.log('\n' + '='.repeat(70));
  console.log('[DEMO MODE] Running with local services');
  console.log('='.repeat(70));
  console.log('- Authentication: Local demo users');
  console.log('- Uploads: Local file storage');
  console.log('- Payments: Simulated checkout');
  console.log('- Quick login: Click "Sign In" button in header');
  console.log('='.repeat(70) + '\n');
}


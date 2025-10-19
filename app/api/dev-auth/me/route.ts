/**
 * Get current demo user from session cookie
 */

import { NextResponse } from 'next/server';
import { getDemoUser } from '@/lib/auth/demo-auth';
import { config } from '@/lib/config';

export async function GET() {
  if (!config.demo) {
    return NextResponse.json({ error: 'Demo mode not enabled' }, { status: 400 });
  }
  
  try {
    const user = await getDemoUser();
    
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error getting demo user:', error);
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}


/**
 * Demo mode logout endpoint
 * Clears session cookie
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { config } from '@/lib/config';

export async function POST() {
  if (!config.demo) {
    return NextResponse.json({ error: 'Demo mode not enabled' }, { status: 400 });
  }
  
  try {
    const cookieStore = await cookies();
    cookieStore.delete('demo_session');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Demo logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}


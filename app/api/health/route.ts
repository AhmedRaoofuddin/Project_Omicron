/**
 * Health Check API Route
 * Tests Supabase connection and returns status
 */

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Test Supabase connection with a simple query
    const { data, error } = await supabaseServer
      .from('_prisma_migrations')
      .select('id')
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = table doesn't exist (expected before migration)
      throw error;
    }

    return NextResponse.json({ 
      ok: true,
      message: 'Supabase connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Supabase health check failed:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message,
      hint: 'Check your Supabase credentials in .env.local'
    }, { status: 500 });
  }
}


/**
 * Login endpoint - handles both preset demo logins and custom user logins
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { config } from '@/lib/config';
import { setDemoSession } from '@/lib/auth/demo-auth';

export async function POST(request: Request) {
  if (!config.demo) {
    return NextResponse.json({ error: 'Demo mode not enabled' }, { status: 400 });
  }
  
  try {
    const body = await request.json();
    
    let session;
    
    // Handle preset demo login
    if (body.preset && ['buyer', 'seller', 'admin'].includes(body.preset)) {
      session = setDemoSession(body.preset);
    }
    // Handle custom user login
    else if (body.user) {
      session = {
        userId: body.user.id,
        email: body.user.email,
        firstName: body.user.firstName || 'User',
        lastName: body.user.lastName || '',
        role: body.user.role || 'buyer',
        imageUrl: body.user.imageUrl || '/demo/avatars/default.svg',
      };
    } else {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('demo_session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return NextResponse.json({
      success: true,
      user: {
        id: session.userId,
        email: session.email,
        firstName: session.firstName,
        lastName: session.lastName,
        imageUrl: session.imageUrl,
        role: session.role,
        emailAddresses: [{ emailAddress: session.email }],
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}


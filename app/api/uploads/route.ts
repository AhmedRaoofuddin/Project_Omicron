/**
 * Local file upload endpoint for DEMO mode
 * Saves files to public/uploads directory
 */

import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { config } from '@/lib/config';

export async function POST(request: Request) {
  if (!config.demo) {
    return NextResponse.json({ error: 'Local uploads only available in demo mode' }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const files: File[] = [];
    
    // Extract all files from form data
    const entries = Array.from(formData.entries());
    for (const [key, value] of entries) {
      if (value instanceof File) {
        files.push(value);
      }
    }
    
    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }
    
    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    // Save each file
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const extension = file.name.split('.').pop();
        const filename = `${timestamp}_${randomString}.${extension}`;
        
        const filepath = join(uploadsDir, filename);
        await writeFile(filepath, buffer);
        
        return {
          public_id: filename,
          url: `/uploads/${filename}`,
          width: 800, // Mock dimensions
          height: 600,
        };
      })
    );
    
    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}


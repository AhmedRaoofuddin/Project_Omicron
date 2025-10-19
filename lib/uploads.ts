/**
 * Unified upload API - switches between local disk and Cloudinary
 */

import { config } from './config';

export interface UploadedFile {
  public_id: string;
  url: string;
  width?: number;
  height?: number;
}

/**
 * Upload images (supports both demo and production modes)
 */
export async function uploadImages(files: File[]): Promise<UploadedFile[]> {
  if (config.demo) {
    // Demo mode: upload to local server
    return uploadImagesLocal(files);
  } else {
    // Production: use Cloudinary
    return uploadImagesToCloudinary(files);
  }
}

/**
 * Upload to local server (demo mode)
 */
async function uploadImagesLocal(files: File[]): Promise<UploadedFile[]> {
  const formData = new FormData();
  
  files.forEach((file, index) => {
    formData.append(`file_${index}`, file);
  });
  
  const response = await fetch('/api/uploads', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  
  const result = await response.json();
  return result.files;
}

/**
 * Upload to Cloudinary (production mode)
 */
async function uploadImagesToCloudinary(files: File[]): Promise<UploadedFile[]> {
  // This will be handled server-side with Cloudinary SDK
  const formData = new FormData();
  
  files.forEach((file, index) => {
    formData.append(`file_${index}`, file);
  });
  
  const response = await fetch('/api/uploads/cloudinary', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  
  const result = await response.json();
  return result.files;
}

/**
 * Delete uploaded image
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  if (config.demo) {
    // In demo mode, just return success (files stay on disk)
    return true;
  } else {
    // Production: delete from Cloudinary
    const response = await fetch('/api/uploads/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    });
    
    return response.ok;
  }
}


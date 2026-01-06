import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { readFile } from 'fs/promises';


// Optionally, you can use a simple mime type map for common image types
const mimeTypes: Record<string, string> = {
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'webp': 'image/webp',
  'svg': 'image/svg+xml',
};



export async function GET( req: NextRequest,{ params }: { params: Promise<{ filename: string }> })

{
  const { filename } = await params;
  const filePath = path.join(
    process.cwd(),
    'public',
    'uploads',
    'subcategories',
    filename
  );

  try {
    const fileBuffer = await readFile(filePath);
    // Get file extension for mime type
    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: { 'Content-Type': mimeType },
    });
  } catch(error) {
    console.error('Error fetching file:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
} 

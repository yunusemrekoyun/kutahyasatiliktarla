import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import type { NextRequest } from 'next/server';
import {
  CONTENT_TYPES,
  UPLOAD_DIR,
  isSafeSegment,
  mediaFilePath,
} from '@/lib/media-store';

/** Yüklenen medyayı diskten akıtır: /m/{listingId}/{dosya}.
 * Dosya adları içerik-adresli (mediaId + ek) olduğundan immutable cache'lenir.
 * Prod'da istenirse nginx aynı volume'u doğrudan servis edebilir. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  if (
    !Array.isArray(segments) ||
    segments.length !== 2 ||
    !segments.every(isSafeSegment)
  ) {
    return new Response('Not found', { status: 404 });
  }

  const [listingId, fileName] = segments;
  const filePath = mediaFilePath(listingId, fileName);
  // isSafeSegment '..' ve ayraçları eler; yine de kök dışına çıkışı reddet
  if (!filePath.startsWith(UPLOAD_DIR)) {
    return new Response('Not found', { status: 404 });
  }

  let info;
  try {
    info = await stat(filePath);
  } catch {
    return new Response('Not found', { status: 404 });
  }
  if (!info.isFile()) return new Response('Not found', { status: 404 });

  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream;

  return new Response(stream, {
    headers: {
      'Content-Type': CONTENT_TYPES[ext] ?? 'application/octet-stream',
      'Content-Length': String(info.size),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

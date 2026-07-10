import { createWriteStream } from 'node:fs';
import { rm } from 'node:fs/promises';
import { once } from 'node:events';
import { NextResponse, type NextRequest } from 'next/server';
import { requireUser } from '@/lib/auth-guards';
import { redisConnection } from '@/lib/redis';
import {
  IMAGE_EXTS,
  ensureMediaDir,
  mediaFilePath,
  mediaUrl,
  safeExt,
} from '@/lib/media-store';

const MAX_BYTES = 5 * 1024 * 1024; // ekran görüntüsü için 5 MB yeter
const FOLDER = 'sikayet'; // /m/sikayet/... altından servis edilir

/** Şikayet ekran görüntüsü yükleme (üye) — ham akış, tek dosya.
 * POST /api/hesap/sikayet-gorsel?filename=ss.png → { url } */
export async function POST(request: NextRequest) {
  let userId: string;
  try {
    const session = await requireUser();
    userId = session.user.id;
  } catch {
    return NextResponse.json({ error: 'Giriş yapın.' }, { status: 401 });
  }

  try {
    const key = `sikayet:rl:${userId}`;
    const count = await redisConnection.incr(key);
    if (count === 1) await redisConnection.expire(key, 3600);
    if (count > 10) {
      return NextResponse.json({ error: 'Çok fazla deneme — sonra tekrar deneyin.' }, { status: 429 });
    }
  } catch {
    // Redis düşükse engelleme
  }

  const filename = request.nextUrl.searchParams.get('filename') ?? '';
  const ext = safeExt(filename, IMAGE_EXTS);
  if (!ext) {
    return NextResponse.json({ error: 'jpg, png veya webp yükleyin.' }, { status: 400 });
  }
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BYTES || !request.body) {
    return NextResponse.json({ error: 'Dosya en fazla 5 MB olabilir.' }, { status: 413 });
  }

  const name = `${userId.slice(0, 8)}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = mediaFilePath(FOLDER, name);

  try {
    await ensureMediaDir(FOLDER);
    const reader = request.body.getReader();
    const out = createWriteStream(filePath);
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BYTES) {
        out.destroy();
        await rm(filePath, { force: true });
        return NextResponse.json({ error: 'Dosya en fazla 5 MB olabilir.' }, { status: 413 });
      }
      if (!out.write(value)) await once(out, 'drain');
    }
    await new Promise<void>((resolve, reject) => {
      out.end(() => resolve());
      out.on('error', reject);
    });
    if (total === 0) {
      await rm(filePath, { force: true });
      return NextResponse.json({ error: 'Dosya boş.' }, { status: 400 });
    }
    return NextResponse.json({ ok: true, url: mediaUrl(FOLDER, name) });
  } catch (err) {
    console.error('[şikayet] yükleme hatası:', err);
    await rm(filePath, { force: true }).catch(() => {});
    return NextResponse.json({ error: 'Yükleme başarısız.' }, { status: 500 });
  }
}

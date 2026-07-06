import type { Prisma } from '@prisma/client';

const MAX_MEDIA = 25; // PDD: ilan başına en fazla 25 medya öğesi

type Tx = Prisma.TransactionClient;

/** Admin'in girdiği görsel URL listesi + drone video URL'ini Media satırlarıyla
 * senkronlar: URL bazlı diff (variants[0].url anahtar), position = satır sırası.
 * Faz 3'te gerçek upload aynı satır modelini devralacak (variants değişir,
 * position kalır). $transaction içinde çağrılmalı. */
export async function syncListingMedia(
  tx: Tx,
  listingId: string,
  imageUrls: string[],
  videoUrl?: string,
) {
  const images = imageUrls.map((u) => u.trim()).filter(Boolean);
  const video = videoUrl?.trim() || null;
  const total = images.length + (video ? 1 : 0);
  if (total > MAX_MEDIA) {
    throw new Error(`En fazla ${MAX_MEDIA} medya öğesi eklenebilir (şu an ${total}).`);
  }

  const existing = await tx.media.findMany({ where: { listingId } });
  const urlOf = (m: (typeof existing)[number]) =>
    ((m.variants as { url?: string }[] | null)?.[0]?.url ?? '').trim();

  const existingImages = new Map(
    existing.filter((m) => m.type === 'image').map((m) => [urlOf(m), m]),
  );
  const existingVideo = existing.find((m) => m.type === 'video') ?? null;

  // Listeden çıkarılan görseller silinir
  const keep = new Set(images);
  const toDelete = [...existingImages.entries()]
    .filter(([url]) => !keep.has(url))
    .map(([, m]) => m.id);
  if (toDelete.length) {
    await tx.media.deleteMany({ where: { id: { in: toDelete } } });
  }

  // Sıra + yeni eklemeler
  for (const [i, url] of images.entries()) {
    const current = existingImages.get(url);
    if (current) {
      if (current.position !== i) {
        await tx.media.update({ where: { id: current.id }, data: { position: i } });
      }
    } else {
      await tx.media.create({
        data: {
          listingId,
          type: 'image',
          variants: [{ width: 0, format: 'source', url }],
          position: i,
        },
      });
    }
  }

  // Video: tek satır — güncelle / oluştur / kaldır
  if (video) {
    if (existingVideo) {
      await tx.media.update({
        where: { id: existingVideo.id },
        data: {
          variants: [{ width: 0, format: 'mp4', url: video }],
          position: images.length,
        },
      });
    } else {
      await tx.media.create({
        data: {
          listingId,
          type: 'video',
          variants: [{ width: 0, format: 'mp4', url: video }],
          position: images.length,
        },
      });
    }
  } else if (existingVideo) {
    await tx.media.delete({ where: { id: existingVideo.id } });
  }
}

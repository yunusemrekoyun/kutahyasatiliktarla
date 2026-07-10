'use server';

import { redirect } from 'next/navigation';
import { updateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guards';
import { TAGS } from '@/lib/cache-tags';
import { TYPE_MAP } from '@/lib/mappers';
import { formatArea, formatPricePerM2, formatTRY } from '@/lib/format';
import { uniqueListingSlug } from '@/lib/slugify';
import { syncListingMedia } from '@/lib/media-sync';
import { removeListingDir } from '@/lib/media-store';
import { notifyOwnerPublished } from '@/lib/notify';
import {
  actionError,
  actionOk,
  zodToActionResult,
  type ActionResult,
} from '@/lib/action-result';
import { listingAdminSchema } from './schema';

function parseForm(formData: FormData) {
  return listingAdminSchema.safeParse({
    title: formData.get('title'),
    district: formData.get('district'),
    location: formData.get('location'),
    type: formData.get('type'),
    purpose: formData.get('purpose'),
    status: formData.get('status'),
    badge: formData.get('badge') ?? '',
    areaM2: formData.get('areaM2'),
    priceTRY: formData.get('priceTRY'),
    lat: formData.get('lat') ?? '',
    lng: formData.get('lng') ?? '',
    description: formData.get('description'),
    droneVideo: formData.get('droneVideo') ?? '',
    images: formData.get('images') ?? '',
    tags: formData.get('tags') ?? '',
    highlights: formData.get('highlights') ?? '',
    specs: formData.get('specs') ?? '',
    droneRequested: formData.get('droneRequested') === 'on',
  });
}

/** Admin ilan kaydı — id null ise yeni kayıt (sahibi admin'in kendisi).
 * status 'aktif' seçildiyse şema yayın şartlarını (koordinat, görsel,
 * arazi bilgisi) zorlar; ilk kez yayına çıkan ilana publishedAt yazılır
 * ve sahibine "ilanınız yayında" e-postası gider. */
export async function saveListing(
  listingId: string | null,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireAdmin();

  const parsed = parseForm(formData);
  if (!parsed.success) return zodToActionResult(parsed.error);
  const d = parsed.data;

  // Yayın şartı: en az bir görsel — yüklenen dosyalar VEYA formdaki harici URL'ler
  if (d.status === 'aktif') {
    const uploadedImages = listingId
      ? await prisma.media.count({ where: { listingId, type: 'image' } })
      : 0;
    if (uploadedImages + d.images.length === 0) {
      return {
        ok: false,
        fieldErrors: {
          images: ['Yayına almak için en az bir görsel yükleyin veya URL girin.'],
        },
      };
    }
  }

  const data = {
    title: d.title,
    purpose: d.purpose,
    type: TYPE_MAP[d.type],
    location: d.location,
    district: d.district,
    area: formatArea(d.areaM2),
    price: formatTRY(d.priceTRY),
    pricePerM2: formatPricePerM2(d.priceTRY, d.areaM2),
    badge: d.badge || null,
    lat: d.lat ?? null,
    lng: d.lng ?? null,
    tags: d.tags,
    description: d.description,
    highlights: d.highlights,
    specs: d.specs,
    status: d.status,
    droneRequested: d.droneRequested,
  };

  let slug: string;
  let publishedNow = false;
  let ownerEmail: string | null = null;

  if (listingId) {
    const existing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: {
        slug: true,
        status: true,
        publishedAt: true,
        owner: { select: { email: true, id: true } },
      },
    });
    if (!existing) return actionError('İlan bulunamadı.');
    slug = existing.slug;
    publishedNow = d.status === 'aktif' && !existing.publishedAt;
    if (publishedNow && existing.owner.id !== session.user.id) {
      ownerEmail = existing.owner.email;
    }

    const id = listingId;
    await prisma.$transaction(async (tx) => {
      await tx.listing.update({
        where: { id },
        data: {
          ...data,
          // yayına dönen ilanda eski red nedeni kalmasın
          rejectReason: d.status === 'reddedildi' ? undefined : null,
          publishedAt: publishedNow ? new Date() : undefined,
        },
      });
      await syncListingMedia(tx, id, d.images, d.droneVideo || undefined);
    });
  } else {
    slug = await uniqueListingSlug(d.title);
    publishedNow = d.status === 'aktif';
    const created = await prisma.$transaction(async (tx) => {
      const row = await tx.listing.create({
        data: {
          ...data,
          slug,
          ownerId: session.user.id,
          publishedAt: publishedNow ? new Date() : null,
        },
        select: { id: true },
      });
      await syncListingMedia(tx, row.id, d.images, d.droneVideo || undefined);
      return row;
    });
    listingId = created.id;
  }

  updateTag(TAGS.listings);
  updateTag(TAGS.listing(slug));

  if (publishedNow && ownerEmail) {
    await notifyOwnerPublished(ownerEmail, d.title, slug);
  }

  redirect(`/admin/ilanlar?kayit=${listingId}`);
}

export async function deleteListing(listingId: string): Promise<ActionResult> {
  await requireAdmin();
  const existing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { slug: true },
  });
  if (!existing) return actionError('İlan bulunamadı.');
  await prisma.listing.delete({ where: { id: listingId } });
  await removeListingDir(listingId); // yüklenen dosyalar diskte kalmasın
  updateTag(TAGS.listings);
  updateTag(TAGS.listing(existing.slug));
  redirect('/admin/ilanlar?silindi=1');
}

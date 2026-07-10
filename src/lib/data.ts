import 'server-only';
import { unstable_cache } from 'next/cache';
import { defaultContent, type Listing } from '@/content';
import { TAGS } from './cache-tags';
import { assembleChrome, mapListingRow, type SiteChrome } from './mappers';
import { slugify } from './slugify';
import { prisma } from './prisma';

/**
 * Public veri katmanı — tag'li unstable_cache + content.ts fallback'i.
 *
 * Fallback tasarımı: build sırasında (ör. VPS Docker build'inde) DATABASE_URL
 * yoktur; her fonksiyon DB hatasında seed'le birebir aynı içerikli
 * defaultContent'e düşer, build DB'siz geçer. unstable_cache hata fırlatan
 * sonucu CACHE'LEMEZ — runtime'da ilk istek/revalidate DB'ye döner; deploy
 * sonrası /api/revalidate çağrısı fallback'le üretilmiş rotaları düşürür.
 */

function logDbFallback(scope: string, err: unknown) {
  const msg = err instanceof Error ? err.message.split('\n')[0] : String(err);
  console.warn(`[data] ${scope}: DB erişilemedi, content.ts fallback (${msg})`);
}

function fallbackChrome(): SiteChrome {
  const { listings: _unused, ...chrome } = defaultContent;
  return structuredClone(chrome);
}

const loadChrome = unstable_cache(
  async (): Promise<SiteChrome> => {
    const [siteContent, stats, districts, features, posts] = await Promise.all([
      prisma.siteContent.findUniqueOrThrow({ where: { id: 1 } }),
      prisma.stat.findMany({ orderBy: { position: 'asc' } }),
      prisma.district.findMany({ orderBy: { position: 'asc' } }),
      prisma.feature.findMany({ orderBy: { position: 'asc' } }),
      prisma.blogPost.findMany({
        where: { status: 'yayinda' },
        orderBy: { createdAt: 'asc' },
      }),
    ]);
    return assembleChrome({ siteContent, stats, districts, features, posts });
  },
  ['site-chrome'],
  { tags: [TAGS.siteContent, TAGS.articles], revalidate: 300 },
);

export async function getSiteChrome(): Promise<SiteChrome> {
  try {
    return await loadChrome();
  } catch (e) {
    logDbFallback('site-chrome', e);
    return fallbackChrome();
  }
}

const loadPublishedListings = unstable_cache(
  async (): Promise<Listing[]> => {
    const rows = await prisma.listing.findMany({
      where: { status: 'aktif' },
      include: { media: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });
    return rows.map(mapListingRow);
  },
  ['published-listings'],
  { tags: [TAGS.listings], revalidate: 300 },
);

export async function getPublishedListings(): Promise<Listing[]> {
  try {
    return await loadPublishedListings();
  } catch (e) {
    logDbFallback('published-listings', e);
    return structuredClone(defaultContent.listings);
  }
}

export async function getListing(slug: string): Promise<Listing | null> {
  const load = unstable_cache(
    async (): Promise<Listing | null> => {
      const row = await prisma.listing.findUnique({
        where: { slug },
        include: { media: true },
      });
      if (!row || row.status !== 'aktif') return null;
      return mapListingRow(row);
    },
    ['listing', slug],
    { tags: [TAGS.listings, TAGS.listing(slug)], revalidate: 3600 },
  );
  try {
    return await load();
  } catch (e) {
    logDbFallback(`listing:${slug}`, e);
    return (
      structuredClone(defaultContent.listings.find((l) => l.id === slug)) ?? null
    );
  }
}

const loadSitemapEntries = unstable_cache(
  async (): Promise<{ slug: string; updatedAt: Date }[]> => {
    const rows = await prisma.listing.findMany({
      where: { status: 'aktif' },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
    });
    return rows;
  },
  ['sitemap-entries'],
  { tags: [TAGS.listings], revalidate: 3600 },
);

export async function getSitemapEntries(): Promise<
  { slug: string; updatedAt: Date }[]
> {
  try {
    return await loadSitemapEntries();
  } catch (e) {
    logDbFallback('sitemap-entries', e);
    return defaultContent.listings.map((l) => ({
      slug: l.id,
      updatedAt: new Date(0),
    }));
  }
}

/** LegalDoc içeriği (public /yasal/[key] sayfaları). */
export async function getLegalDoc(key: string) {
  const valid = ['kvkk', 'gizlilik', 'cerez', 'kosullar', 'iys'] as const;
  type LegalKey = (typeof valid)[number];
  if (!valid.includes(key as LegalKey)) return null;
  const load = unstable_cache(
    async () =>
      prisma.legalDoc.findUnique({ where: { key: key as LegalKey } }),
    ['legal-doc', key],
    { tags: [TAGS.siteContent], revalidate: 3600 },
  );
  try {
    return await load();
  } catch (e) {
    logDbFallback(`legal:${key}`, e);
    return null;
  }
}

export type GuidePost = {
  slug: string;
  title: string;
  category: string;
  body: string;
  // ISO string: unstable_cache sonucu JSON round-trip'inden geçer, Date
  // nesnesi hit'te string'e dönüşür (canlıda 500'e yol açtı) — baştan string.
  createdAt: string | null;
};

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/** Rehber özeti (kart metni) — HTML gövdeden düz metin kırpar. */
export function guideSnippet(body: string, max = 180): string {
  const text = stripHtml(body);
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

function fallbackPosts(): GuidePost[] {
  return defaultContent.articles.map((a) => ({
    slug: slugify(a.title),
    title: a.title,
    category: a.category,
    body: a.text,
    createdAt: null,
  }));
}

const loadGuidePosts = unstable_cache(
  async (): Promise<GuidePost[]> =>
    (
      await prisma.blogPost.findMany({
        where: { status: 'yayinda' },
        orderBy: { createdAt: 'desc' },
      })
    ).map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      body: p.body,
      createdAt: p.createdAt.toISOString(),
    })),
  ['guide-posts'],
  { tags: [TAGS.articles], revalidate: 300 },
);

export async function getGuidePosts(): Promise<GuidePost[]> {
  try {
    return await loadGuidePosts();
  } catch (e) {
    logDbFallback('guide-posts', e);
    return fallbackPosts();
  }
}

export async function getGuidePost(slug: string): Promise<GuidePost | null> {
  const load = unstable_cache(
    async () => prisma.blogPost.findUnique({ where: { slug } }),
    ['guide-post', slug],
    { tags: [TAGS.articles], revalidate: 3600 },
  );
  try {
    const post = await load();
    if (!post || post.status !== 'yayinda') return null;
    return {
      slug: post.slug,
      title: post.title,
      category: post.category,
      body: post.body,
      createdAt: post.createdAt.toISOString(),
    };
  } catch (e) {
    logDbFallback('guide-post', e);
    return fallbackPosts().find((p) => p.slug === slug) ?? null;
  }
}

export type MapPoint = {
  slug: string;
  title: string;
  price: string;
  area: string;
  district: string;
  type: string;
  lat: number;
  lng: number;
  img: string | null;
};

const loadMapPoints = unstable_cache(
  async (): Promise<MapPoint[]> => {
    const rows = await prisma.listing.findMany({
      where: { status: 'aktif', lat: { not: null }, lng: { not: null } },
      include: {
        media: { where: { type: 'image' }, orderBy: { position: 'asc' }, take: 1 },
      },
      orderBy: { publishedAt: 'desc' },
    });
    return rows.map((r) => {
      const url =
        ((r.media[0]?.variants as { url?: string }[] | null)?.[0]?.url ?? '') || null;
      return {
        slug: r.slug,
        title: r.title,
        price: r.price,
        area: r.area,
        district: r.district,
        type: r.type,
        lat: r.lat as number,
        lng: r.lng as number,
        img: url,
      };
    });
  },
  ['map-points'],
  { tags: [TAGS.listings], revalidate: 300 },
);

export async function getMapPoints(): Promise<MapPoint[]> {
  try {
    return await loadMapPoints();
  } catch (e) {
    logDbFallback('map-points', e);
    return defaultContent.listings.map((l) => ({
      slug: l.id,
      title: l.title,
      price: l.price,
      area: l.area,
      district: l.district,
      type: l.type,
      lat: l.lat,
      lng: l.lng,
      img: l.images[0] ?? null,
    }));
  }
}

'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ChevronRight,
  CircleCheck,
  ExternalLink,
  MapPin,
  Maximize,
  MessageCircle,
  Phone,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { ParcelFrame, TopoLines } from '@/components/site/topo';
import { useParallax } from '@/lib/parallax';
import { cn } from '@/lib/utils';
import { useStore, telLink, waLink } from '@/store';
import type { MapMarker } from '@/LeafletMap';

const LeafletMap = dynamic(() => import('@/LeafletMap'), { ssr: false });

/** Bölüm başlığı — brass ölçüm çubuğu motifiyle tutarlı alan etiketi. */
function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 font-heading text-lg font-semibold text-foreground">
      <span className="h-4 w-0.5 shrink-0 bg-brass" aria-hidden="true" />
      {children}
    </h2>
  );
}

export function ListingDetail({ id }: { id: string }) {
  const { content, hydrated } = useStore();
  const [idx, setIdx] = useState(0);
  // Paylaşım linki istemcide üretilir (canonical domain varsayımı yok)
  const [pageUrl, setPageUrl] = useState('');
  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);
  // Kapak görselinde ölçülü ken-burns/parallax (ana sayfadaki kartlarla aynı dil)
  const coverRef = useParallax<HTMLDivElement>(14);
  // Küçük resme tıklanınca kapak yumuşak geçer; ilk yüklemede (LCP) sabit.
  const [interacted, setInteracted] = useState(false);

  const listing = content.listings.find((l) => l.id === id);

  if (!listing) {
    // localStorage yüklenmeden "bulunamadı" göstermeyelim
    if (!hydrated) return <div className="min-h-[50vh]" aria-hidden="true" />;
    return (
      <div className="container py-24 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          İlan bulunamadı
        </h1>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
          Aradığınız ilan yayından kaldırılmış ya da bağlantı hatalı olabilir.
        </p>
        <Button asChild className="mt-8">
          <Link href="/ilanlar">Tüm ilanlara dönün</Link>
        </Button>
      </div>
    );
  }

  const images = listing.images ?? [];
  const cover = images[Math.min(idx, Math.max(images.length - 1, 0))];
  const marker: MapMarker[] = [
    { lat: listing.lat, lng: listing.lng, title: listing.title, price: listing.price },
  ];
  const wa = waLink(
    content.contact.whatsapp,
    `Merhaba, "${listing.title}" (${listing.price}) ilanı hakkında bilgi almak istiyorum.`,
  );
  const share = `https://wa.me/?text=${encodeURIComponent(`${listing.title} · ${listing.price} — ${pageUrl}`)}`;

  const specs = [
    { label: 'Alan', value: listing.area },
    ...(listing.specs ?? []),
  ];

  return (
    <div className="bg-background py-8 sm:py-12">
      <div className="container">
        {/* Kırıntı */}
        <Reveal immediate>
          <nav aria-label="Sayfa yolu" className="flex items-center gap-1.5 text-[14px] text-muted-foreground">
            <Link href="/ilanlar" className="transition-colors hover:text-foreground">
              İlanlar
            </Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span className="truncate font-medium text-foreground">{listing.title}</span>
          </nav>
        </Reveal>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          {/* Sol: medya + açıklama — bölüm bölüm scroll ile canlanır */}
          <div className="min-w-0">
            {/* Kapak — ölçülmüş parsel çerçevesi + tıklamada yumuşak geçen görsel */}
            <Reveal immediate>
              <ParcelFrame>
                <div className="relative overflow-hidden rounded-lg border border-border bg-muted">
                  <div ref={coverRef} className="parallax-cover relative aspect-[16/10]">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={idx}
                        src={cover}
                        alt={listing.title}
                        className={cn(
                          'absolute inset-0 h-full w-full object-cover',
                          interacted && 'detail-cover-in',
                        )}
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-muted-foreground">
                        <MapPin className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  {listing.badge ? (
                    <span className="absolute left-5 top-5 z-10 rounded-sm bg-background/90 px-3 py-1.5 text-[12px] font-semibold text-foreground backdrop-blur-sm">
                      {listing.badge}
                    </span>
                  ) : null}
                </div>
              </ParcelFrame>

              {images.length > 1 ? (
                <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {images.map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      onClick={() => {
                        setIdx(i);
                        setInteracted(true);
                      }}
                      aria-label={`${i + 1}. fotoğrafı gösterin`}
                      aria-current={i === idx}
                      className={cn(
                        'relative aspect-[4/3] overflow-hidden rounded-sm border bg-muted transition-[transform,border-color] duration-200 ease-out-quart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        i === idx
                          ? 'border-primary ring-1 ring-primary'
                          : 'border-border hover:-translate-y-0.5 hover:border-primary/40',
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </Reveal>

            {listing.description ? (
              <Reveal className="mt-8">
                <FieldLabel>İlan açıklaması</FieldLabel>
                <p className="mt-3 leading-relaxed text-foreground/85">
                  {listing.description}
                </p>
              </Reveal>
            ) : null}

            {listing.highlights?.length > 0 ? (
              <Reveal className="mt-8">
                <FieldLabel>Öne çıkanlar</FieldLabel>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {listing.highlights.map((h, i) => (
                    <li
                      key={h}
                      className="draw-pop flex items-start gap-2 text-[15px] text-foreground/85"
                      style={{ transitionDelay: `${120 + i * 70}ms` }}
                    >
                      <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-brass-strong" />
                      {h}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}

            {listing.droneVideo ? (
              <Reveal className="mt-8">
                <FieldLabel>Drone ile havadan bakış</FieldLabel>
                <div className="mt-3 overflow-hidden rounded-lg border border-border bg-primary">
                  <video
                    src={listing.droneVideo}
                    controls
                    playsInline
                    preload="metadata"
                    poster={images[0]}
                    className="aspect-video h-auto w-full object-cover"
                  />
                </div>
              </Reveal>
            ) : null}

            <Reveal className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <FieldLabel>Konum</FieldLabel>
                <a
                  href={`https://www.google.com/maps?q=${listing.lat},${listing.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  Google Haritalar
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <div className="overflow-hidden rounded-lg border border-border">
                <LeafletMap
                  markers={marker}
                  center={[listing.lat, listing.lng]}
                  zoom={13}
                  fitBounds={false}
                  className="h-72 w-full"
                />
              </div>
            </Reveal>
          </div>

          {/* Sağ: künye kartı — tapu dosyası dili */}
          <Reveal immediate>
            <div className="lg:sticky lg:top-28">
              {/* Künye — tapu dosyası dili: parsel köşeleri + topo filigran */}
              <ParcelFrame>
                <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 sm:p-7">
                  <TopoLines className="inset-0 h-full w-full text-primary/[0.03]" />
                  <div className="relative">
                    <p className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-brass-strong">
                      <span className="h-0.5 w-6 bg-brass" aria-hidden="true" />
                      {listing.type}
                    </p>
                <h1 className="mt-3 font-heading text-2xl font-bold leading-tight tracking-[-0.01em] text-foreground">
                  {listing.title}
                </h1>
                <p className="mt-2 flex items-center gap-1.5 text-[15px] text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 text-brass-strong" />
                  {listing.location}
                </p>

                <div className="mt-6 border-y border-border py-4">
                  <div className="nums font-heading text-3xl font-bold leading-none text-foreground">
                    <span className="sr-only">Fiyat: </span>
                    {listing.price}
                  </div>
                  <div className="nums mt-1.5 text-sm text-muted-foreground">
                    {listing.pricePerM2}
                  </div>
                </div>

                <dl className="mt-2 divide-y divide-border">
                  {specs.map((s) => (
                    <div key={s.label} className="flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {s.label === 'Alan' ? (
                          <Maximize className="h-4 w-4 text-brass-strong" aria-hidden="true" />
                        ) : null}
                        {s.label}
                      </dt>
                      <dd className="nums text-right text-[15px] font-semibold text-foreground">
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 flex flex-col gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 gap-2 bg-whatsapp text-base text-white hover:bg-whatsapp/90"
                  >
                    <a href={wa} target="_blank" rel="noreferrer">
                      <MessageCircle className="size-5" />
                      WhatsApp’tan Bilgi Al
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-12 gap-2 text-base">
                    <a href={telLink(content.contact.phone)}>
                      <Phone className="size-5" />
                      Ara: {content.contact.phone}
                    </a>
                  </Button>
                  <a
                    href={share}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex min-h-11 items-center justify-center gap-2 text-[14px] font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Share2 className="h-4 w-4" />
                    İlanı WhatsApp’tan paylaşın
                  </a>
                    </div>
                  </div>
                </div>
              </ParcelFrame>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

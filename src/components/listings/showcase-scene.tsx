'use client';

import Link from 'next/link';
import { ArrowRight, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountUp } from '@/components/motion/count-up';
import { Reveal } from '@/components/motion/reveal';
import { ShowcaseListing } from './showcase-listing';
import { useScrollScene } from '@/lib/use-scroll-scene';
import { useStore, waLink } from '@/store';
import type { Listing } from '@/content';

// Dummy "drone açıları" — sonra ilanın gerçek çekimiyle değişecek
const ANGLES = [
  'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1600&q=80',
];

const CORNERS = [
  [420, 300],
  [1230, 250],
  [1360, 760],
  [500, 830],
] as const;

/**
 * Öne çıkan ilan = ikinci "çapa sahne": kaydırdıkça ilanın görseli drone
 * açıları arasında geçer, üstüne kadastro parseli çizilir, künye belirir —
 * hero ile aynı sticky/scrub mekaniği (kaydırma kilitlenmez). Mobil /
 * reduced-motion / masaüstü-dışı: mevcut sabit vitrin kartı.
 */
export function ShowcaseScene({ listing }: { listing: Listing }) {
  const { sectionRef, rootRef, scenic } = useScrollScene<HTMLElement, HTMLDivElement>();
  const { content } = useStore();

  const wa = waLink(
    content.contact.whatsapp,
    `Merhaba, "${listing.title}" (${listing.price}) ilanı hakkında bilgi almak istiyorum.`,
  );
  const specs: Array<[string, string]> = [
    ['Alan', listing.area],
    ['Tür', listing.type],
    ['Birim', listing.pricePerM2],
    ...(listing.specs?.[0]
      ? [[listing.specs[0].label, listing.specs[0].value] as [string, string]]
      : []),
  ];

  return (
    <section ref={sectionRef} className={scenic ? 'relative h-[165vh]' : 'relative'}>
      <div
        ref={rootRef}
        className={scenic ? 'sticky top-0 flex h-[100svh] items-center' : ''}
      >
        {scenic ? (
          <div className="container w-full">
            <article className="group grid overflow-hidden rounded-lg border border-border bg-card shadow-soft lg:grid-cols-[1.55fr_1fr]">
              {/* Görsel: drone açıları cross-fade + parsel çizimi */}
              <div className="relative aspect-[16/10] overflow-hidden bg-muted lg:aspect-auto lg:min-h-[30rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ANGLES[0]}
                  alt={listing.title}
                  className="hz-a absolute inset-0 h-full w-full object-cover"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ANGLES[1]}
                  alt=""
                  aria-hidden="true"
                  className="hz-b absolute inset-0 h-full w-full object-cover"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ANGLES[2]}
                  alt=""
                  aria-hidden="true"
                  className="hz-c absolute inset-0 h-full w-full object-cover"
                />
                {/* Okunurluk için hafif alt gölge */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[hsl(154_42%_8%_/_0.35)] via-transparent to-transparent"
                  aria-hidden="true"
                />

                {/* Kadastro parseli — kaydırınca çizilir */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 1600 1000"
                  preserveAspectRatio="xMidYMid slice"
                  fill="none"
                  aria-hidden="true"
                >
                  <polygon
                    className="scene-parcel"
                    points="420,300 1230,250 1360,760 500,830"
                    pathLength={1}
                    stroke="hsl(36 74% 66%)"
                    strokeWidth={3}
                    strokeDasharray={1}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {CORNERS.map(([x, y]) => (
                    <g key={`${x}-${y}`} className="scene-corner">
                      <line x1={x - 13} y1={y} x2={x + 13} y2={y} stroke="hsl(36 74% 66%)" strokeWidth={3} />
                      <line x1={x} y1={y - 13} x2={x} y2={y + 13} stroke="hsl(36 74% 66%)" strokeWidth={3} />
                    </g>
                  ))}
                </svg>

                {/* Alan künyesi — parsel çizilince belirir */}
                <div
                  className="scene-chip pointer-events-none absolute left-[46%] top-[54%] rounded-sm border border-white/15 bg-[hsl(154_42%_9%_/_0.74)] px-3.5 py-2 backdrop-blur-sm"
                  aria-hidden="true"
                >
                  <div className="nums font-heading text-lg font-bold leading-none text-white">
                    {listing.area}
                  </div>
                  <div className="nums mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                    39.42° K · 29.98° D
                  </div>
                </div>

                {listing.badge ? (
                  <span className="pointer-events-none absolute left-5 top-5 rounded-sm bg-background/90 px-3 py-1.5 text-[12px] font-semibold text-foreground backdrop-blur-sm">
                    {listing.badge}
                  </span>
                ) : null}

                <Link
                  href={`/ilan/${listing.id}`}
                  className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  aria-label={`${listing.title} detaylarını açın`}
                />
              </div>

              {/* Künye sütunu */}
              <div className="flex flex-col p-6 sm:p-8 lg:border-l lg:border-dashed lg:border-border">
                <p className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-brass-strong">
                  <span className="draw-dash h-0.5 w-6 bg-brass" aria-hidden="true" />
                  Öne çıkan parsel
                </p>
                <h3 className="mt-3 font-heading text-2xl font-bold leading-tight tracking-[-0.01em] text-foreground sm:text-[1.75rem]">
                  {listing.title}
                </h3>
                <p className="mt-2 flex items-center gap-1.5 text-[15px] text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 text-brass-strong" />
                  {listing.location}
                </p>

                <dl className="mt-6 divide-y divide-border border-y border-border">
                  {specs.map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        {label}
                      </dt>
                      <dd className="nums text-right text-[15px] font-semibold text-foreground">
                        <CountUp value={value} />
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-auto pt-6">
                  <div className="font-heading text-3xl font-bold leading-none text-foreground">
                    <span className="sr-only">Fiyat: </span>
                    <CountUp value={listing.price} className="nums" />
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <Button asChild size="lg" className="h-12 flex-1">
                      <Link href={`/ilan/${listing.id}`}>
                        Detayları Gör
                        <ArrowRight className="size-5" />
                      </Link>
                    </Button>
                    <a
                      href={wa}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="WhatsApp’tan yazın"
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-sm border border-border text-whatsapp transition-colors hover:border-whatsapp/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </div>
        ) : (
          <div className="container">
            <Reveal>
              <ShowcaseListing listing={listing} />
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}

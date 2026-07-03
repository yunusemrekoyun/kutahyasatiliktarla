'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountUp } from '@/components/motion/count-up';
import { Reveal } from '@/components/motion/reveal';
import { TopoLines } from '@/components/site/topo';
import { ShowcaseListing } from '@/components/listings/showcase-listing';
import { useScrollScene } from '@/lib/use-scroll-scene';
import { useStore, telLink, waLink } from '@/store';
import type { Listing } from '@/content';

const HERO_IMG =
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=80';

/**
 * Açılış sekansı: hero → öne çıkan ilan tek kesintisiz morph. Kaydırdıkça
 * hero görseli fildişi matte ile çerçevelenip küçülür, ilan fotoğrafına
 * geçer, üstüne parsel çizilir ve künye belirir — bölüm dikişi kaybolur.
 * Kaydırma kilitlenmez (sticky + --p). Mobil/reduced-motion: normal hero +
 * sabit vitrin kartı.
 */
export function OpeningSequence({ listing }: { listing: Listing }) {
  const { sectionRef, rootRef, scenic } = useScrollScene<HTMLElement, HTMLDivElement>();
  const { content } = useStore();
  const phone = content.contact.phone;
  const cover = listing.images?.[0] ?? HERO_IMG;

  const stats = [
    { value: String(content.listings.length), label: 'Yayında arazi ilanı' },
    ...content.stats.filter((s) => !/ilan/i.test(s.label)).slice(0, 3),
  ];
  const wa = waLink(
    content.contact.whatsapp,
    `Merhaba, "${listing.title}" (${listing.price}) ilanı hakkında bilgi almak istiyorum.`,
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Tanıtım"
      className={scenic ? 'relative -mt-20 h-[260vh] bg-primary lg:-mt-24' : '-mt-20 lg:-mt-24'}
    >
      <div
        ref={rootRef}
        className={scenic ? 'sticky top-0 h-[100svh] overflow-hidden bg-background' : ''}
      >
        {scenic ? (
          <div className="relative h-full w-full">
            {/* Morph penceresi: tam ekrandan kart-görseline çerçevelenir */}
            <div className="op-window absolute inset-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt={listing.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_IMG}
                alt=""
                aria-hidden="true"
                className="op-img-a absolute inset-0 h-full w-full object-cover"
              />
              <div className="op-scrim absolute inset-0" aria-hidden="true">
                <div className="absolute inset-0 bg-gradient-to-r from-[hsl(155_34%_5%_/_0.9)] via-[hsl(155_30%_7%_/_0.4)] via-[42%] to-transparent to-[72%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(155_34%_5%_/_0.78)] via-transparent via-[46%] to-transparent" />
                <TopoLines className="inset-0 h-full w-full text-white/[0.06]" />
              </div>

              {/* Kadastro parseli — kaydırınca çerçevelenmiş görsele çizilir */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 1440 900"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                aria-hidden="true"
              >
                <polygon
                  className="scene-parcel"
                  points="470,436 980,404 1046,712 536,760"
                  pathLength={1}
                  stroke="hsl(36 74% 66%)"
                  strokeWidth={3}
                  strokeDasharray={1}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {[
                  [470, 436],
                  [980, 404],
                  [1046, 712],
                  [536, 760],
                ].map(([x, y]) => (
                  <g key={`${x}-${y}`} className="scene-corner">
                    <line x1={x - 13} y1={y} x2={x + 13} y2={y} stroke="hsl(36 74% 66%)" strokeWidth={3} />
                    <line x1={x} y1={y - 13} x2={x} y2={y + 13} stroke="hsl(36 74% 66%)" strokeWidth={3} />
                  </g>
                ))}
              </svg>
            </div>

            {/* Hero metni — çerçeveleme başlayınca çıkar */}
            <div className="op-hero absolute inset-0 z-10 flex items-center">
              <div className="container">
                <div className="max-w-2xl">
                  <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-brass-ondark">
                    <span className="h-0.5 w-8 bg-brass-ondark" aria-hidden="true" />
                    {content.hero.badge}
                  </p>
                  <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.75rem]">
                    {content.hero.titleLine1}{' '}
                    <span className="text-brass-ondark">{content.hero.titleAccent}</span>
                  </h1>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">
                    {content.hero.subtitle}
                  </p>
                  <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                    <Button asChild variant="brass" size="lg" className="h-[52px] px-8 text-base">
                      <Link href="/ilanlar">
                        İlanları Görün
                        <ArrowRight className="size-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="outlineOnDark" size="lg" className="h-[52px] px-8 text-base">
                      <a href={telLink(phone)}>
                        <Phone className="size-5" />
                        {phone}
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="mt-14 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <div className="nums font-heading text-3xl font-bold leading-none text-white">
                        {s.value}
                      </div>
                      <div className="mt-2 text-[13px] leading-snug text-white/75">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Künye kartı — çerçevelenmiş görselin alt kenarına oturur */}
            <div className="op-caption absolute inset-x-0 top-[68.5%] z-20 flex justify-center">
              <div className="w-[50%] max-w-[52rem] rounded-lg border border-border bg-card/95 p-5 shadow-soft-lg backdrop-blur-sm sm:p-6">
                <p className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-brass-strong">
                  <span className="h-0.5 w-6 bg-brass" aria-hidden="true" />
                  Öne çıkan parsel
                </p>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="font-heading text-xl font-bold leading-tight tracking-[-0.01em] text-foreground sm:text-2xl">
                      {listing.title}
                    </h2>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[14px] text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 text-brass-strong" />
                      {listing.location}
                      <span aria-hidden="true" className="text-border">·</span>
                      <span className="nums">{listing.area}</span>
                    </p>
                  </div>
                  <div className="nums font-heading text-2xl font-bold leading-none text-foreground sm:text-[1.75rem]">
                    {listing.price}
                  </div>
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

            {/* Kaydırma ipucu */}
            <div
              className="op-cue pointer-events-none absolute inset-x-0 bottom-7 z-20 flex flex-col items-center gap-1.5 text-white/70"
              aria-hidden="true"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">Kaydırın</span>
              <ChevronDown className="hint-float h-5 w-5" />
            </div>
          </div>
        ) : (
          <>
            {/* Fallback: normal hero + sabit vitrin kartı */}
            <div className="relative flex min-h-[42rem] items-center overflow-hidden bg-primary lg:min-h-[48rem]">
              <div className="absolute inset-0 -z-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={HERO_IMG} alt="Kütahya kırsalında gün batımında tarlalar" className="kenburns h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[hsl(154_40%_10%_/_0.12)]" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-r from-[hsl(155_34%_5%_/_0.92)] via-[hsl(155_30%_7%_/_0.42)] via-[42%] to-transparent to-[72%]" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(155_34%_5%_/_0.78)] via-transparent via-[46%] to-transparent" aria-hidden="true" />
                <TopoLines className="inset-0 h-full w-full text-white/[0.06]" />
              </div>
              <div className="container pb-20 pt-32 lg:pb-24 lg:pt-40">
                <div className="max-w-2xl">
                  <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-brass-ondark">
                    <span className="h-0.5 w-8 bg-brass-ondark" aria-hidden="true" />
                    {content.hero.badge}
                  </p>
                  <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.75rem]">
                    {content.hero.titleLine1}{' '}
                    <span className="text-brass-ondark">{content.hero.titleAccent}</span>
                  </h1>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">
                    {content.hero.subtitle}
                  </p>
                  <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                    <Button asChild variant="brass" size="lg" className="h-[52px] px-8 text-base">
                      <Link href="/ilanlar">
                        İlanları Görün
                        <ArrowRight className="size-5" />
                      </Link>
                    </Button>
                    <Button asChild variant="outlineOnDark" size="lg" className="h-[52px] px-8 text-base">
                      <a href={telLink(phone)}>
                        <Phone className="size-5" />
                        {phone}
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="mt-14 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <div className="nums font-heading text-3xl font-bold leading-none text-white">
                        {s.value.includes('–') ? s.value : <CountUp value={s.value} />}
                      </div>
                      <div className="mt-2 text-[13px] leading-snug text-white/75">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-background py-16 sm:py-20">
              <div className="container">
                <Reveal>
                  <ShowcaseListing listing={listing} />
                </Reveal>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

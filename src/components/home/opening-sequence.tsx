'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { TopoLines } from '@/components/site/topo';
import { ShowcaseListing } from '@/components/listings/showcase-listing';
import { useScrollScene } from '@/lib/use-scroll-scene';
import { cn } from '@/lib/utils';
import { useStore, telLink, waLink } from '@/store';

const HERO_IMG =
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=80';

/**
 * Açılış sekansı: hero → öne çıkan ilan tek kesintisiz morph. Kaydırdıkça
 * hero görseli fildişi matte ile çerçevelenip küçülür, ilan fotoğrafına
 * geçer, üstüne parsel çizilir ve künye belirir. Kart oluşunca yanlardaki
 * oklarla ilanlar arasında geçilir (görsel çapraz geçişle akar); aşağı
 * kaydırınca sayfa normal akışına döner. Kaydırma kilitlenmez (sticky + --p).
 * Mobil/reduced-motion: normal hero + sabit vitrin kartı.
 */
export function OpeningSequence() {
  const { sectionRef, rootRef, scenic } = useScrollScene<HTMLElement, HTMLDivElement>();
  const { content } = useStore();
  const listings = content.listings;
  const phone = content.contact.phone;

  const first = listings[0];
  const firstCover = first?.images?.[0] ?? HERO_IMG;

  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  // Taban görsel sabit durur; ok'a basınca yeni görsel yandan kayıp üstüne
  // biner, kayma bitince taban güncellenir → çerçeve hep dolu, temiz kayma.
  const [baseSrc, setBaseSrc] = useState(firstCover);
  const [incoming, setIncoming] = useState<{ src: string; dir: 1 | -1; seq: number } | null>(
    null,
  );
  const seq = useRef(0);

  const active = listings[idx] ?? first;

  // Açılışta duvardan rastgele bir ilan öne çıkar (kart görünmeden önce
  // seçildiği için ekranda takla olmaz). SSR'da idx=0, istemcide rastgele.
  useEffect(() => {
    if (listings.length > 1) {
      const r = Math.floor(Math.random() * listings.length);
      setIdx(r);
      setBaseSrc(listings[r]?.images?.[0] ?? firstCover);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // İlan duvarı: tüm ilan görsellerinden küçük karolar, 3 sıraya dağıtılır.
  const wallPool = listings
    .flatMap((l) => l.images ?? [])
    .map((u) => u.replace(/w=\d+/, 'w=520'));
  const wallRows = [0, 1, 2].map((r) => {
    const a = wallPool.filter((_, i) => i % 3 === r);
    const b = a.length >= 4 ? a : wallPool;
    return b.length ? b : [firstCover];
  });

  function go(d: 1 | -1) {
    if (listings.length < 2) return;
    const next = (idx + d + listings.length) % listings.length;
    const cover = listings[next]?.images?.[0] ?? HERO_IMG;
    seq.current += 1;
    setDir(d);
    setIdx(next);
    setIncoming({ src: cover, dir: d, seq: seq.current });
  }

  function onIncomingEnd(src: string) {
    setBaseSrc(src);
    setIncoming(null);
  }

  const wa = active
    ? waLink(
        content.contact.whatsapp,
        `Merhaba, "${active.title}" (${active.price}) ilanı hakkında bilgi almak istiyorum.`,
      )
    : '#';

  const stats = [
    { value: String(listings.length), label: 'Yayında arazi ilanı' },
    ...content.stats.filter((s) => !/ilan/i.test(s.label)).slice(0, 3),
  ];

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
        {scenic && active ? (
          <div className="relative h-full w-full">
            {/* İlan duvarı — hero arka planı: 3 sıra yatay marquee (gerçek ilanlar) */}
            <div className="op-wall absolute inset-0 overflow-hidden">
              <div className="flex h-full flex-col justify-center gap-3 lg:gap-4">
                {wallRows.map((tiles, r) => (
                  <div
                    key={r}
                    className={cn('op-row gap-3 lg:gap-4', r === 1 ? 'op-row-r' : 'op-row-l')}
                    style={{ ['--dur' as string]: `${[74, 96, 62][r]}s` }}
                  >
                    {[...tiles, ...tiles].map((src, i) => (
                      <div
                        key={i}
                        className="relative h-40 w-60 shrink-0 overflow-hidden rounded-md lg:h-48 lg:w-72"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Fildişi veil — görsel çerçevelenirken duvarı kapatır (kart zemini) */}
            <div className="op-veil absolute inset-0 bg-background" aria-hidden="true" />

            {/* Seçili karo — duvardan yaklaşıp büyür, çerçevelenir; ok'la değişir */}
            <div className="op-window absolute inset-0 z-[6] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={baseSrc}
                alt={active.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {incoming ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={incoming.seq}
                  src={incoming.src}
                  alt=""
                  aria-hidden="true"
                  onAnimationEnd={() => onIncomingEnd(incoming.src)}
                  className={cn(
                    'absolute inset-0 h-full w-full object-cover',
                    incoming.dir === 1 ? 'op-slide-r' : 'op-slide-l',
                  )}
                />
              ) : null}

              {/* Kadastro parseli — çerçevelenmiş görsele çizilir */}
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

            {/* Metin scrim'i — duvar ve büyüyen görsel üstünde okunurluk */}
            <div className="op-scrim absolute inset-0 z-[5]" aria-hidden="true">
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(155_36%_5%_/_0.92)] via-[hsl(155_32%_7%_/_0.5)] via-[44%] to-[hsl(155_32%_8%_/_0.15)] to-[80%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(155_36%_5%_/_0.72)] via-transparent via-[48%] to-transparent" />
              <TopoLines className="inset-0 h-full w-full text-white/[0.05]" />
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

            {/* Slider okları — ekranın sağ/sol kenarında, kart oluşunca belirir */}
            {listings.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Önceki ilan"
                  className="op-arrows absolute left-4 top-[42%] z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-card/85 text-foreground shadow-soft backdrop-blur transition hover:bg-card hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:left-8"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Sonraki ilan"
                  className="op-arrows absolute right-4 top-[42%] z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-card/85 text-foreground shadow-soft backdrop-blur transition hover:bg-card hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:right-8"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            ) : null}

            {/* Künye kartı — kap sabit, içerik ilan değişince yumuşak geçer */}
            <div className="op-caption absolute inset-x-0 top-[68.5%] z-20 flex justify-center">
              <div className="w-[50%] max-w-[52rem] overflow-hidden rounded-lg border border-border bg-card/95 p-5 shadow-soft-lg backdrop-blur-sm sm:p-6">
                <div
                  key={idx}
                  className="op-fade"
                  style={{ ['--sdir' as string]: `${dir * 22}px` }}
                >
                  <p className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-brass-strong">
                    <span className="h-0.5 w-6 bg-brass" aria-hidden="true" />
                    Öne çıkan parsel
                    <span className="nums ml-auto normal-case tracking-normal text-muted-foreground">
                      {idx + 1} / {listings.length}
                    </span>
                  </p>
                  <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="font-heading text-xl font-bold leading-tight tracking-[-0.01em] text-foreground sm:text-2xl">
                        {active.title}
                      </h2>
                      <p className="mt-1.5 flex items-center gap-1.5 text-[14px] text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 text-brass-strong" />
                        {active.location}
                        <span aria-hidden="true" className="text-border">·</span>
                        <span className="nums">{active.area}</span>
                      </p>
                    </div>
                    <div className="nums font-heading text-2xl font-bold leading-none text-foreground sm:text-[1.75rem]">
                      {active.price}
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <Button asChild size="lg" className="h-12 flex-1">
                      <Link href={`/ilan/${active.id}`}>
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
                        {s.value}
                      </div>
                      <div className="mt-2 text-[13px] leading-snug text-white/75">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {first ? (
              <div className="bg-background py-16 sm:py-20">
                <div className="container">
                  <Reveal>
                    <ShowcaseListing listing={first} />
                  </Reveal>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

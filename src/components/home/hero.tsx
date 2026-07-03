'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { CountUp } from '@/components/motion/count-up';
import { TopoLines } from '@/components/site/topo';
import { useStore, telLink } from '@/store';

export function Hero() {
  const { content } = useStore();
  const sectionRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  // "Sahne" modu yalnızca masaüstünde ve reduced-motion kapalıyken açılır;
  // aksi halde (mobil / hareket azaltma / JS-yok) sabit hero kalır.
  const [scenic, setScenic] = useState(false);

  const stats = [
    { value: String(content.listings.length), label: 'Yayında arazi ilanı' },
    ...content.stats.filter((s) => !/ilan/i.test(s.label)).slice(0, 3),
  ];

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!desktop.matches || reduce.matches) return;
    setScenic(true);

    const section = sectionRef.current;
    const root = rootRef.current;
    if (!section || !root) return;

    let ticking = false;
    let last = -1;
    const update = () => {
      ticking = false;
      const dist = section.offsetHeight - window.innerHeight;
      const top = section.getBoundingClientRect().top;
      const p = dist > 0 ? Math.min(1, Math.max(0, -top / dist)) : 0;
      if (Math.abs(p - last) < 0.001) return;
      last = p;
      root.style.setProperty('--p', p.toFixed(4));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Tanıtım"
      className={`relative isolate -mt-20 bg-primary lg:-mt-24 ${scenic ? 'h-[190vh]' : ''}`}
    >
      <div
        ref={rootRef}
        className={`relative flex items-center overflow-hidden ${
          scenic
            ? 'sticky top-0 h-[100svh]'
            : 'min-h-[42rem] lg:min-h-[48rem]'
        }`}
      >
        {/* Sinematik arka plan */}
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* Sahne A — açılış: kaydırma yoksa tek gösterilen (sabit/mobil fallback) */}
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=80"
            alt="Kütahya kırsalında gün batımında tarlalar"
            className={`absolute inset-0 h-full w-full object-cover ${
              scenic ? 'hz-a' : 'kenburns'
            }`}
          />
          {/* Sahne B ve C yalnızca sahne modunda — kaydırdıkça açı değişir */}
          {scenic ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=2400&q=80"
                alt=""
                aria-hidden="true"
                className="hz-b absolute inset-0 h-full w-full object-cover"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=2400&q=80"
                alt=""
                aria-hidden="true"
                className="hz-c absolute inset-0 h-full w-full object-cover"
              />
            </>
          ) : null}
          {/* Not: arbitrary hsl'de opaklık değerin İÇİNE yazılır ([hsl(… _/_0.9)]);
              slash-opacity bu sürümde derlenmez. Görsel öne çıkar, gölge yalnız
              metnin arkasında yoğun, sağdaki gün batımı canlı kalır. */}
          <div className="absolute inset-0 bg-[hsl(154_40%_10%_/_0.12)]" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[hsl(155_34%_5%_/_0.92)] via-[hsl(155_30%_7%_/_0.42)] via-[42%] to-transparent to-[72%]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[hsl(155_34%_5%_/_0.78)] via-transparent via-[46%] to-transparent"
            aria-hidden="true"
          />
          <TopoLines className="inset-0 h-full w-full text-white/[0.06]" />
        </div>

        {/* Kadastro overlay — kaydırdıkça parsel çizilir (dekoratif) */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1440 810"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden="true"
        >
          <polygon
            className="scene-parcel"
            points="906,470 1256,432 1310,700 946,748"
            pathLength={1}
            stroke="hsl(36 74% 66%)"
            strokeWidth={2.5}
            strokeDasharray={1}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {[
            [906, 470],
            [1256, 432],
            [1310, 700],
            [946, 748],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`} className="scene-corner">
              <line x1={x - 11} y1={y} x2={x + 11} y2={y} stroke="hsl(36 74% 66%)" strokeWidth={2.5} />
              <line x1={x} y1={y - 11} x2={x} y2={y + 11} stroke="hsl(36 74% 66%)" strokeWidth={2.5} />
            </g>
          ))}
        </svg>

        {/* Alan/koordinat künyesi — parsel çizilince belirir */}
        <div
          className="scene-chip pointer-events-none absolute left-[68%] top-[60%] hidden rounded-sm border border-white/15 bg-[hsl(154_42%_9%_/_0.72)] px-3.5 py-2 backdrop-blur-sm lg:block"
          aria-hidden="true"
        >
          <div className="nums font-heading text-lg font-bold leading-none text-white">
            ≈ 12.500 m²
          </div>
          <div className="nums mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
            39.42° K · 29.98° D
          </div>
        </div>

        {/* İçerik */}
        <div className="container relative z-10 pb-20 pt-32 lg:pb-24 lg:pt-40">
          <Reveal immediate className="max-w-2xl">
            <div className="scene-lead">
              <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-brass-ondark">
                <span className="h-0.5 w-8 bg-brass-ondark" aria-hidden="true" />
                {content.hero.badge}
              </p>

              <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.75rem]">
                {content.hero.titleLine1}{' '}
                <span className="text-brass-ondark">{content.hero.titleAccent}</span>
              </h1>
            </div>

            <div className="scene-mid">
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
                <Button
                  asChild
                  variant="outlineOnDark"
                  size="lg"
                  className="h-[52px] px-8 text-base"
                >
                  <a href={telLink(content.contact.phone)}>
                    <Phone className="size-5" />
                    {content.contact.phone}
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>

          {/* İstatistik şeridi */}
          <Reveal
            immediate
            className="scene-stats mt-14 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div className="nums font-heading text-3xl font-bold leading-none text-white">
                  {s.value.includes('–') ? s.value : <CountUp value={s.value} />}
                </div>
                <div className="mt-2 text-[13px] leading-snug text-white/75">{s.label}</div>
              </div>
            ))}
          </Reveal>
        </div>

        {/* Kaydırma ipucu — yalnızca sahne modunda */}
        {scenic ? (
          <div
            className="scene-cue pointer-events-none absolute inset-x-0 bottom-7 flex flex-col items-center gap-1.5 text-white/70"
            aria-hidden="true"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
              Kaydırın
            </span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

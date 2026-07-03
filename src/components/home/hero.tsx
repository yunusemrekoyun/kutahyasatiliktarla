'use client';

import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { TopoLines } from '@/components/site/topo';
import { useStore, telLink } from '@/store';

export function Hero() {
  const { content } = useStore();
  // İlan sayısı elle yazılmaz; gerçek ilan listesinden türetilir ki
  // vitrindeki sayıyla asla çelişmesin.
  const stats = [
    { value: String(content.listings.length), label: 'Yayında arazi ilanı' },
    ...content.stats.filter((s) => !/ilan/i.test(s.label)).slice(0, 3),
  ];

  return (
    <section
      aria-label="Tanıtım"
      className="relative isolate flex min-h-[38rem] items-center overflow-hidden bg-primary lg:min-h-[44rem]"
    >
      {/* Sinematik arka plan */}
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=80"
          alt="Kütahya kırsalında gün batımında tarlalar"
          className="kenburns h-full w-full object-cover"
        />
        {/* Dikkat: eğik çizgili opaklıklar Tailwind ölçeğinde olmalı (5'in katı),
            aksi halde sınıf üretilmez ve scrim sessizce kaybolur. */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[hsl(154_46%_8%)]/90 via-[hsl(154_46%_9%)]/75 to-[hsl(154_46%_10%)]/30"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[hsl(154_46%_8%)]/80 via-transparent to-transparent"
          aria-hidden="true"
        />
        {/* Pafta motifi: soluk eş yükselti eğrileri */}
        <TopoLines className="inset-0 h-full w-full text-white/[0.06]" />
      </div>

      <div className="container py-24 lg:py-28">
        <Reveal immediate className="max-w-2xl">
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
        </Reveal>

        {/* İstatistik şeridi */}
        <Reveal
          immediate
          className="mt-14 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div className="nums font-heading text-3xl font-bold leading-none text-white">
                {s.value}
              </div>
              <div className="mt-2 text-[13px] leading-snug text-white/75">{s.label}</div>
            </div>
          ))}
        </Reveal>

        {/* Saha kaydı: koordinat mikro-metni */}
        <p className="nums mt-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
          39.42° K · 29.98° D · Kütahya
        </p>
      </div>
    </section>
  );
}

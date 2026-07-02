'use client';

import {
  BadgeCheck,
  Camera,
  MapPinned,
  Maximize,
  MessageCircle,
  Search,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { useStore } from '@/store';
import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/motion/reveal';

const steps = [
  {
    icon: Search,
    title: 'Arayın',
    text: 'İlçe ve arazi türünü seçin; size uygun ilanlar saniyeler içinde listelensin.',
  },
  {
    icon: Maximize,
    title: 'İnceleyin',
    text: 'Gerçek fotoğraflar, konum haritası ve net künye bilgisiyle araziyi uzaktan tanıyın.',
  },
  {
    icon: MessageCircle,
    title: 'İletişime geçin',
    text: 'Tek dokunuşla telefonla arayın ya da WhatsApp’tan yazın; ekibimiz yanınızda.',
  },
];

const FEATURE_ICONS: Record<string, LucideIcon> = {
  local: MapPinned,
  drone: Camera,
  verified: ShieldCheck,
  invest: TrendingUp,
};

export function HowItWorks() {
  const { content } = useStore();
  return (
    <section id="nasil-calisir" className="bg-background py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Süreç"
          title="Nasıl çalışır?"
          subtitle="Arazi almak güven ister. Süreci üç basit adıma indirdik; her adımda yanınızdayız."
        />

        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <li className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-sm bg-primary text-primary-foreground">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <span className="nums font-heading text-2xl font-bold text-brass">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-[1.35rem] font-semibold tracking-[-0.01em] text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        {/* Neden biz: güven şeridi */}
        <Reveal delay={120}>
          <div className="mt-14 grid gap-x-8 gap-y-8 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {content.features.map((f) => {
              const Icon = FEATURE_ICONS[f.iconKey] ?? BadgeCheck;
              return (
                <div key={f.title} className="flex items-start gap-3.5">
                  <Icon className="mt-0.5 h-6 w-6 shrink-0 text-brass" />
                  <div>
                    <h3 className="text-[16px] font-semibold text-foreground">{f.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
                      {f.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

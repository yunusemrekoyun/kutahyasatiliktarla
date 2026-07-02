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
    <section id="nasil-calisir" className="bg-background py-16 sm:py-24">
      <div className="container">
        <h2 className="title-rule title-rule-center text-center font-heading text-3xl font-light text-foreground sm:text-4xl">
          Nasıl çalışır?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-[17px] text-muted-foreground">
          Arazi almak güven ister. Süreci üç basit adıma indirdik; her adımda
          yanınızdayız.
        </p>

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s) => (
            <li key={s.title}>
              <span className="grid h-12 w-12 place-items-center bg-primary">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </span>
              <h3 className="mt-5 font-heading text-[1.35rem] font-medium text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 max-w-sm leading-relaxed text-muted-foreground">
                {s.text}
              </p>
            </li>
          ))}
        </ol>

        {/* Neden biz: kurumsal güven şeridi */}
        <div className="mt-14 grid gap-x-8 gap-y-6 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {content.features.map((f) => {
            const Icon = FEATURE_ICONS[f.iconKey] ?? BadgeCheck;
            return (
              <div key={f.title} className="flex items-start gap-3.5">
                <Icon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
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
      </div>
    </section>
  );
}

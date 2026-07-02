import { CircleCheck, Maximize, MessageCircle, Search } from 'lucide-react';
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

const trust = [
  'Her ilanda gerçek fotoğraf ve drone görüntüsü',
  'Tapu, ada/parsel ve imar bilgisi tek tek kontrol edilir',
  'Kütahyalı yerel ekip, ücretsiz danışmanlık',
];

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="py-20 sm:py-28">
      <div className="container grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <h2 className="font-heading text-3xl font-semibold leading-[1.12] text-foreground sm:text-[2.6rem]">
              Tanıdık güven,
              <br />
              <span className="italic font-medium text-primary">yeni nesil</span> kolaylık
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
              Arazi almak köyde komşuya sormak kadar güven ister. Biz o güveni
              internete taşıdık: her bilgi yerinde doğrulanır, her ilan şeffaftır.
            </p>
            <ul className="mt-7 space-y-3">
              {trust.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[16px] text-foreground/85">
                  <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Harita rotası gibi: kesikli güzergâh üzerinde üç durak */}
        <Reveal delay={80}>
          <ol className="relative space-y-12">
            <span
              aria-hidden="true"
              className="absolute bottom-10 left-7 top-10 w-0.5 bg-[repeating-linear-gradient(to_bottom,hsl(var(--primary)/0.3)_0_6px,transparent_6px_14px)]"
            />
            {steps.map((s) => (
              <li key={s.title} className="relative flex gap-6">
                <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border border-primary/25 bg-background shadow-soft-sm">
                  <s.icon className="h-6 w-6 text-primary" />
                </span>
                <div className="pt-1.5">
                  <h3 className="font-heading text-[1.45rem] font-semibold text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-md leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

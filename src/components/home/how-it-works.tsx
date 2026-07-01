import {
  BadgeCheck,
  Camera,
  Maximize,
  MessageCircle,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Arayın',
    text: 'İlçe ve türe göre size uygun arazileri saniyeler içinde listeleyin.',
  },
  {
    icon: Maximize,
    title: 'İnceleyin',
    text: 'Gerçek fotoğraflar, konum haritası ve net künye ile araziyi tanıyın.',
  },
  {
    icon: MessageCircle,
    title: 'İletişime geçin',
    text: 'Tek dokunuşla telefon veya WhatsApp ile sahibine/danışmana ulaşın.',
  },
];

const trust = [
  { icon: Camera, label: 'Gerçek fotoğraf & drone' },
  { icon: ShieldCheck, label: 'Net tapu & künye' },
  { icon: Users, label: 'Yerel ekip' },
  { icon: BadgeCheck, label: 'Ücretsiz danışmanlık' },
];

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="bg-secondary/40 py-16 sm:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Nasıl çalışır?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Üç basit adımda doğru araziye ulaşın.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-xl border border-border bg-card p-6 text-center"
            >
              <span className="absolute right-5 top-4 font-heading text-4xl font-bold text-primary/10">
                {i + 1}
              </span>
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
                <s.icon className="h-7 w-7" />
              </span>
              <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {trust.map((t) => (
            <span
              key={t.label}
              className="flex items-center gap-2 text-[15px] font-medium text-foreground/80"
            >
              <t.icon className="h-5 w-5 text-primary" />
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

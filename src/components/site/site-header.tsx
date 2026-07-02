'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Menu, MessageCircle, Phone, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { useStore, telLink, waLink } from '@/store';

const navLinks = [
  { href: '#ilanlar', label: 'İlanlar' },
  { href: '#bolgeler', label: 'Bölgeler' },
  { href: '#nasil-calisir', label: 'Nasıl Çalışır' },
  { href: '#iletisim', label: 'İletişim' },
];

export function SiteHeader() {
  const { content, requestSearch } = useStore();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [q, setQ] = useState('');
  const phone = content.contact.phone;

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 340);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    requestSearch(v);
    setQ('');
  }

  return (
    <>
      <header id="top">
        {/* Katman 1 — koyu utility bar */}
        <div className="hidden bg-ink text-[13px] text-white/75 lg:block">
          <div className="container flex h-9 items-stretch justify-between">
            <span className="flex items-center">
              Kütahya’nın yerel arazi platformu
            </span>
            <div className="flex items-stretch">
              <a
                href={telLink(phone)}
                className="flex items-center gap-2 px-4 font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Phone className="h-3.5 w-3.5" />
                {phone}
              </a>
              <a
                href={waLink(content.contact.whatsapp, 'Merhaba, bilgi almak istiyorum.')}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 transition-colors hover:bg-white/10 hover:text-white"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </a>
              <a
                href="#ilan-ver"
                className="flex items-center bg-primary px-5 font-semibold text-primary-foreground transition-colors hover:bg-[hsl(45_100%_47%)]"
              >
                İlan Ver
              </a>
            </div>
          </div>
        </div>

        {/* Katman 2 — sarı marka bandı */}
        <div className="bg-primary">
          <div className="container flex h-[72px] items-center justify-between gap-4 lg:h-[92px]">
            <a href="#top" aria-label={content.brand}>
              <Logo brand={content.brand} />
            </a>

            <form
              onSubmit={submitSearch}
              className="hidden w-72 items-center gap-2 border-b-2 border-ink/60 pb-1.5 transition-colors focus-within:border-ink lg:flex"
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="İlan ara"
                aria-label="İlanlarda arayın"
                className="w-full bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-ink/80"
              />
              <button
                type="submit"
                aria-label="İlanlarda arayın"
                className="grid h-8 w-8 place-items-center text-ink transition-colors hover:bg-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>

            {/* Mobil: menü */}
            <div className="lg:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button
                    aria-label="Menüyü açın"
                    className="grid h-11 w-11 place-items-center border-2 border-ink/70 text-ink transition-colors hover:bg-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[86%] max-w-sm p-0">
                  <SheetTitle className="sr-only">Menü</SheetTitle>
                  <div className="bg-primary px-6 py-5">
                    <Logo brand={content.brand} />
                  </div>
                  <div className="flex flex-col px-6 py-4">
                    {navLinks.map((l) => (
                      <SheetClose asChild key={l.href}>
                        <a
                          href={l.href}
                          className="border-b border-border py-4 text-lg font-medium text-foreground transition-colors hover:text-ink"
                        >
                          {l.label}
                        </a>
                      </SheetClose>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 px-6 pt-2">
                    <SheetClose asChild>
                      <Button asChild size="lg" className="h-12 text-base">
                        <a href="#ilan-ver">İlan Ver</a>
                      </Button>
                    </SheetClose>
                    <Button asChild variant="outline" size="lg" className="h-12 text-base">
                      <a href={telLink(phone)}>
                        <Phone className="size-5" />
                        {phone}
                      </a>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Katman 3 — sarı banda bindirilmiş beyaz nav şeridi */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-x-0 top-0 h-6 bg-primary" aria-hidden="true" />
          <div className="container relative">
            <nav className="inline-flex border border-border bg-background shadow-soft-sm">
              {navLinks.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={cn(
                    'relative px-6 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:bg-muted',
                    i > 0 &&
                      'before:absolute before:left-0 before:top-1/2 before:h-5 before:w-px before:-translate-y-1/2 before:bg-border',
                  )}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Sticky kompakt bar (masaüstü) */}
      <div
        className={cn(
          'fixed inset-x-0 top-0 z-50 hidden -translate-y-full bg-primary transition-transform duration-300 ease-out-quart lg:block',
          stuck && 'translate-y-0 shadow-soft',
        )}
      >
        <div className="container flex h-14 items-center justify-between gap-6">
          <a href="#top" aria-label={content.brand}>
            <Logo brand={content.brand} />
          </a>
          <nav className="flex items-center">
            {navLinks.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  'relative px-4 py-2 text-[15px] font-medium text-ink transition-colors hover:bg-ink/10',
                  i > 0 &&
                    'before:absolute before:left-0 before:top-1/2 before:h-4 before:w-px before:-translate-y-1/2 before:bg-ink/25',
                )}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href={telLink(phone)}
            className="flex items-center gap-2 text-[15px] font-bold text-ink transition-colors hover:opacity-80"
          >
            <Phone className="h-4 w-4" />
            {phone}
          </a>
        </div>
      </div>
    </>
  );
}

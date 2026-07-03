'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
import { LAND_TYPES } from '@/content';
import { useStore, telLink, waLink } from '@/store';

/** Kategori-öncelikli gezinme: tıkla ve doğrudan ilanlara gir. */
const navLinks = [
  { href: '/ilanlar', label: 'Tüm İlanlar' },
  ...LAND_TYPES.map((t) => ({
    href: `/ilanlar?tur=${encodeURIComponent(t)}`,
    label: t,
  })),
];

export function SiteHeader() {
  const { content } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [q, setQ] = useState('');
  const phone = content.contact.phone;

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    router.push(`/ilanlar?q=${encodeURIComponent(v)}`);
    setQ('');
  }

  return (
    <header id="top">
      {/* Katman 1 — ince yeşil utility şeridi */}
      <div className="hidden bg-primary text-[13px] text-primary-foreground/70 lg:block">
        <div className="container flex h-9 items-stretch justify-between">
          <span className="flex items-center tracking-wide">
            Kütahya ve ilçelerinde yerel arazi platformu
          </span>
          <div className="flex items-stretch">
            <a
              href={telLink(phone)}
              className="flex items-center gap-2 px-4 font-semibold text-primary-foreground transition-colors hover:bg-white/10"
            >
              <Phone className="h-3.5 w-3.5" />
              {phone}
            </a>
            <a
              href={waLink(content.contact.whatsapp, 'Merhaba, bilgi almak istiyorum.')}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 transition-colors hover:bg-white/10 hover:text-primary-foreground"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Katman 2 — sticky ana bar (fildişi, cam efekti) */}
      <div
        className={cn(
          'sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300 ease-out-quart',
          stuck
            ? 'border-border bg-background/85 shadow-soft backdrop-blur-md'
            : 'border-transparent bg-background',
        )}
      >
        <div className="container flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link href="/" aria-label={content.brand} className="shrink-0">
            <Logo brand={content.brand} />
          </Link>

          {/* Masaüstü nav — kategoriler, pirinç altı-çizgi animasyonu */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => {
              const active = l.href === '/ilanlar' && pathname === '/ilanlar';
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    'group relative px-3 py-2 text-[15px] font-medium transition-colors hover:text-foreground',
                    active ? 'text-foreground' : 'text-foreground/75',
                  )}
                >
                  {l.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-3 -bottom-0.5 h-[2px] origin-left bg-brass transition-transform duration-300 ease-out-quart',
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <form
              onSubmit={submitSearch}
              className="hidden h-10 w-52 items-center gap-2 rounded-sm border border-input bg-card px-3 transition-colors focus-within:border-primary xl:flex xl:w-60"
            >
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="İlan ara"
                aria-label="İlanlarda arayın"
                className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
              />
            </form>
            <Button asChild variant="brass" size="sm" className="h-10 px-5">
              <a href="/#ilan-ver">İlan Ver</a>
            </Button>
          </div>

          {/* Mobil menü */}
          <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="Menüyü açın"
                  className="grid h-11 w-11 place-items-center rounded-sm border border-border text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[86%] max-w-sm p-0">
                <SheetTitle className="sr-only">Menü</SheetTitle>
                <div className="bg-primary px-6 py-6">
                  <Logo brand={content.brand} tone="light" />
                </div>
                <div className="flex flex-col px-6 py-4">
                  {navLinks.map((l) => (
                    <SheetClose asChild key={l.href}>
                      <Link
                        href={l.href}
                        className="border-b border-border py-4 text-lg font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {l.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
                <div className="flex flex-col gap-3 px-6 pt-2">
                  <SheetClose asChild>
                    <Button asChild variant="brass" size="lg" className="h-12 text-base">
                      <a href="/#ilan-ver">İlan Ver</a>
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
    </header>
  );
}

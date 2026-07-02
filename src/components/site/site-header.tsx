'use client';

import { useEffect, useState } from 'react';
import { Menu, Phone } from 'lucide-react';
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
import { useStore, telLink } from '@/store';

const navLinks = [
  { href: '#ilanlar', label: 'İlanlar' },
  { href: '#bolgeler', label: 'Bölgeler' },
  { href: '#nasil-calisir', label: 'Nasıl Çalışır' },
  { href: '#iletisim', label: 'İletişim' },
];

export function SiteHeader() {
  const { content } = useStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const phone = content.contact.phone;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b transition-[background-color,box-shadow,border-color] duration-300',
        scrolled
          ? 'border-border bg-background/85 shadow-soft-sm backdrop-blur-md'
          : 'border-border/60 bg-background',
      )}
    >
      <div className="container flex h-[68px] items-center justify-between gap-4">
        <a href="#top" aria-label={content.brand} className="shrink-0">
          <Logo brand={content.brand} />
        </a>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3.5 py-2 text-[15px] font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={telLink(phone)}
            className="group flex items-center gap-2 text-[15px] font-semibold text-foreground transition-colors hover:text-primary"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
              <Phone className="h-4 w-4" />
            </span>
            {phone}
          </a>
          <Button asChild size="lg">
            <a href="#ilan-ver">İlan Ver</a>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild className="h-11 gap-1.5 px-4" aria-label="Telefonla arayın">
            <a href={telLink(phone)}>
              <Phone className="size-4" />
              Ara
            </a>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Menüyü açın">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86%] max-w-sm">
              <SheetTitle className="sr-only">Menü</SheetTitle>
              <div className="mt-8 flex flex-col gap-1">
                {navLinks.map((l) => (
                  <SheetClose asChild key={l.href}>
                    <a
                      href={l.href}
                      className="rounded-lg px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      {l.label}
                    </a>
                  </SheetClose>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6">
                <SheetClose asChild>
                  <Button asChild size="lg" className="h-12 text-base">
                    <a href="#ilan-ver">İlan Ver</a>
                  </Button>
                </SheetClose>
                <Button asChild size="lg" variant="outline" className="h-12 text-base">
                  <a href={telLink(phone)}>
                    <Phone className="mr-2 h-5 w-5" />
                    {phone}
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

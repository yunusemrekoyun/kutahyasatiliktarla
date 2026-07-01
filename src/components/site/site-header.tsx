'use client';

import { useState } from 'react';
import { Menu, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
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
  const phone = content.contact.phone;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        <a href="#top" aria-label={content.brand} className="shrink-0">
          <Logo brand={content.brand} />
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-[15px] font-medium text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={telLink(phone)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-[15px] font-semibold text-primary transition-colors hover:bg-primary/5"
          >
            <Phone className="h-4 w-4" />
            {phone}
          </a>
          <Button asChild size="lg">
            <a href="#ilan-ver">İlan Ver</a>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild size="icon" aria-label="Hemen ara">
            <a href={telLink(phone)}>
              <Phone className="h-5 w-5" />
            </a>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Menüyü aç">
                <Menu className="h-5 w-5" />
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

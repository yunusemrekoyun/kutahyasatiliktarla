'use client';

import { type FormEvent, useState } from 'react';
import { MapPin, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/motion/reveal';
import { LAND_TYPES } from '@/content';
import { scrollToId } from '@/lib/scroll';

export type HomeFilters = { district: string; type: string; q: string };

const fieldTrigger =
  'h-14 w-full rounded-sm border border-input bg-background px-4 text-left text-[16px] font-medium text-foreground shadow-none transition-colors hover:border-primary/30 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background data-[placeholder]:text-muted-foreground [&>span]:flex [&>span]:items-center [&>span]:gap-2.5';

export function SearchBand({
  districts,
  onApply,
}: {
  districts: string[];
  onApply: (f: HomeFilters) => void;
}) {
  const [district, setDistrict] = useState('all');
  const [type, setType] = useState('all');

  function submit(e: FormEvent) {
    e.preventDefault();
    onApply({
      district: district === 'all' ? '' : district,
      type: type === 'all' ? '' : type,
      q: '',
    });
    scrollToId('ilanlar');
  }

  return (
    <section aria-label="İlan arama" className="bg-background py-16 sm:py-20">
      <div className="container">
        <SectionHeading
          eyebrow="Aramaya başlayın"
          title="Size uygun araziyi bulalım"
          subtitle="İlçe ve arazi türünü seçin; aradığınız kriterlere uyan ilanları hemen listeleyelim."
        />

        <Reveal delay={120}>
          <form
            onSubmit={submit}
            className="mx-auto mt-9 flex max-w-3xl flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-stretch sm:p-5"
          >
            <div className="flex-1">
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className={fieldTrigger} aria-label="İlçe seçin">
                  <MapPin className="h-5 w-5 shrink-0 text-brass-strong" />
                  <SelectValue placeholder="Tüm ilçeler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm İlçeler</SelectItem>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className={fieldTrigger} aria-label="Arazi türü seçin">
                  <Sprout className="h-5 w-5 shrink-0 text-brass-strong" />
                  <SelectValue placeholder="Tüm türler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Türler</SelectItem>
                  {LAND_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" variant="brass" size="lg" className="h-14 px-10 text-[15px]">
              İlanları Göster
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

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
import { LAND_TYPES } from '@/content';
import { scrollToId } from '@/lib/scroll';
import { useStore } from '@/store';

export type HomeFilters = { district: string; type: string; q: string };

const fieldTrigger =
  'h-14 w-full rounded-sm border-0 bg-white px-4 text-left text-[16px] font-medium text-foreground shadow-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-primary data-[placeholder]:text-muted-foreground [&>span]:flex [&>span]:items-center [&>span]:gap-2.5';

export function SearchBand({
  districts,
  onApply,
}: {
  districts: string[];
  onApply: (f: HomeFilters) => void;
}) {
  const { content } = useStore();
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
    <section aria-label="İlan arama" className="bg-primary py-12 sm:py-16">
      <div className="container">
        <h2 className="text-center font-heading text-3xl font-light text-primary-foreground sm:text-4xl">
          Size nasıl yardımcı olabiliriz?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[17px] text-primary-foreground/80">
          {content.hero.subtitle}
        </p>

        <form
          onSubmit={submit}
          className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-stretch"
        >
          <div className="flex-1">
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className={fieldTrigger} aria-label="İlçe seçin">
                <MapPin className="h-5 w-5 shrink-0 text-ink-soft" />
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
                <Sprout className="h-5 w-5 shrink-0 text-ink-soft" />
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

          <Button
            type="submit"
            variant="ink"
            size="lg"
            className="h-14 px-10 text-[15px] uppercase tracking-wide"
          >
            İlanları Göster
          </Button>
        </form>
      </div>
    </section>
  );
}

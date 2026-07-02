'use client';

import { type FormEvent, useState } from 'react';
import { MapPin, Search, Sprout } from 'lucide-react';
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

export type HomeFilters = { district: string; type: string };

const triggerClass =
  'h-14 rounded-xl border-0 bg-muted/70 px-4 text-base font-medium shadow-none transition-colors hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[placeholder]:text-muted-foreground [&>span]:flex [&>span]:items-center [&>span]:gap-2.5';

export function SearchBar({
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
    });
    scrollToId('ilanlar');
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
      <div className="grid flex-1 gap-2 sm:grid-cols-2">
        <Select value={district} onValueChange={setDistrict}>
          <SelectTrigger className={triggerClass} aria-label="İlçe seçin">
            <MapPin className="h-5 w-5 shrink-0 text-primary" />
            <SelectValue placeholder="İlçe seçin" />
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

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className={triggerClass} aria-label="Arazi türü seçin">
            <Sprout className="h-5 w-5 shrink-0 text-primary" />
            <SelectValue placeholder="Arazi türü" />
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

      <Button type="submit" size="lg" className="h-14 gap-2 rounded-xl px-8 text-base">
        <Search className="size-5" />
        İlan Ara
      </Button>
    </form>
  );
}

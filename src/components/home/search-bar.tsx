'use client';

import { type FormEvent, useState } from 'react';
import { Search } from 'lucide-react';
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

const fieldTrigger =
  'h-auto w-full justify-between rounded-lg border-0 bg-transparent p-0 text-left text-[17px] font-semibold text-foreground shadow-none focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[placeholder]:text-muted-foreground';

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
    <form
      onSubmit={submit}
      className="flex max-w-2xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft-lg sm:flex-row sm:items-stretch sm:gap-0 sm:p-0"
    >
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:gap-0 sm:divide-x sm:divide-border">
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 rounded-xl bg-muted/60 px-4 py-3 sm:rounded-none sm:bg-transparent sm:px-6 sm:py-4">
          <span className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
            İlçe
          </span>
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger className={fieldTrigger} aria-label="İlçe seçin">
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

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 rounded-xl bg-muted/60 px-4 py-3 sm:rounded-none sm:bg-transparent sm:px-6 sm:py-4">
          <span className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
            Arazi türü
          </span>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className={fieldTrigger} aria-label="Arazi türü seçin">
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
      </div>

      <div className="flex sm:p-2">
        <Button
          type="submit"
          size="lg"
          className="h-14 w-full gap-2 rounded-xl px-8 text-base sm:h-full"
        >
          <Search className="size-5" />
          İlan Ara
        </Button>
      </div>
    </form>
  );
}

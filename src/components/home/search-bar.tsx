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

export type HomeFilters = { district: string; type: string };

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
    document.getElementById('ilanlar')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <Select value={district} onValueChange={setDistrict}>
        <SelectTrigger className="h-12 text-base" aria-label="İlçe seçin">
          <SelectValue placeholder="İlçe" />
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
        <SelectTrigger className="h-12 text-base" aria-label="Arazi türü seçin">
          <SelectValue placeholder="Tür" />
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

      <Button type="submit" size="lg" className="h-12 gap-2 px-8 text-base">
        <Search className="h-5 w-5" />
        Ara
      </Button>
    </form>
  );
}

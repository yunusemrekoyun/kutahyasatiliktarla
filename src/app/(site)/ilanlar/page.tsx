import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Browse } from '@/components/listings/browse';

export const metadata: Metadata = {
  title: 'Satılık Tarla, Arsa ve Arazi İlanları — Kütahya Satılık Tarla',
  description:
    'Kütahya merkez ve ilçelerindeki satılık tarla, arsa, bağ-bahçe ve köy içi arazi ilanlarını ilçeye ve türe göre filtreleyin.',
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Browse />
    </Suspense>
  );
}

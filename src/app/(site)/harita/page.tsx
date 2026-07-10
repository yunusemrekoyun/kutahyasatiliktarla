import type { Metadata } from 'next';
import { getMapPoints, getSiteChrome } from '@/lib/data';
import { HaritaMap } from '@/components/listings/harita-map';
import { SectionHeading } from '@/components/site/section-heading';

export const metadata: Metadata = {
  title: 'Haritada Arazi Arama',
  description:
    'Kütahya ve ilçelerindeki satılık arazileri harita üzerinde görün; ilgilendiğiniz bölgeyi çizerek daraltın.',
  alternates: { canonical: '/harita' },
};

export default async function Page() {
  const [points, chrome] = await Promise.all([getMapPoints(), getSiteChrome()]);

  return (
    <div className="container py-12 lg:py-16">
      <SectionHeading
        eyebrow="Harita"
        title={chrome.sections.mapTitle || 'Haritada Arazi Arama'}
        subtitle={
          chrome.sections.mapSubtitle ||
          'İlgilendiğiniz bölgeyi çizin; içindeki ilanları anında görün.'
        }
      />
      <div className="mt-8">
        <HaritaMap points={points} />
      </div>
    </div>
  );
}

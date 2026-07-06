import type { Metadata } from 'next';
import { SectionHeading } from '@/components/site/section-heading';
import { getServerSession } from '@/lib/get-session';
import { authErrorMessage } from '@/lib/auth-errors';

export const metadata: Metadata = {
  title: 'Hesabım — Kütahya Satılık Tarla',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const session = await getServerSession();

  return (
    <div className="container py-12 lg:py-16">
      <SectionHeading
        eyebrow="Hesabım"
        title={`Hoş geldiniz, ${session?.user.name ?? ''}`}
        subtitle={session?.user.email}
      />
      {error ? (
        <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {authErrorMessage(error)} Bağlantı zaten kullanılmış olabilir — giriş
          yapmayı deneyin.
        </p>
      ) : null}
      <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        İlanlarınız, favorileriniz ve mesajlarınız yakında bu sayfada olacak.
      </p>
    </div>
  );
}

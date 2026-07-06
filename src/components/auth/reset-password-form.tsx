'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { authErrorMessage } from '@/lib/auth-errors';
import { fieldLabelClass } from './auth-card';

export function ResetPasswordForm({
  token,
  tokenError,
}: {
  token?: string;
  tokenError?: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (tokenError || !token) {
    return (
      <p className="text-[15px] leading-relaxed text-foreground">
        <strong className="font-semibold">
          {authErrorMessage(tokenError ?? 'INVALID_TOKEN')}
        </strong>{' '}
        <Link href="/sifremi-unuttum" className="font-medium text-brass-strong hover:underline">
          Tekrar isteyin.
        </Link>
      </p>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await authClient.resetPassword(
      { newPassword: password, token },
      {
        onError: (ctx) => {
          setError(authErrorMessage(ctx.error.code));
          setLoading(false);
        },
        onSuccess: () => {
          router.push('/giris?reset=1');
        },
      },
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="password" className={fieldLabelClass()}>
          Yeni Şifre
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" variant="brass" size="lg" className="w-full" disabled={loading}>
        {loading ? 'Kaydediliyor…' : 'Şifreyi Değiştir'}
      </Button>
    </form>
  );
}

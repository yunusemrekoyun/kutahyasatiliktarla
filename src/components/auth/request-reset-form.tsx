'use client';

import { useState, type FormEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { fieldLabelClass } from './auth-card';

export function RequestResetForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Kullanıcı var/yok bilgisini sızdırmamak için sonuç ne olursa olsun
    // aynı mesaj gösterilir.
    await authClient.requestPasswordReset({
      email,
      redirectTo: '/sifremi-unuttum/yeni-sifre',
    });
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <p className="text-[15px] leading-relaxed text-foreground">
        <strong className="font-semibold">E-postanızı kontrol edin.</strong>{' '}
        <span className="text-muted-foreground">
          {email} adresiyle bir hesap varsa, şifre sıfırlama bağlantısı gönderildi.
        </span>
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email" className={fieldLabelClass()}>
          E-posta
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <Button type="submit" variant="brass" size="lg" className="w-full" disabled={loading}>
        {loading ? 'Gönderiliyor…' : 'Sıfırlama Bağlantısı Gönder'}
      </Button>
    </form>
  );
}

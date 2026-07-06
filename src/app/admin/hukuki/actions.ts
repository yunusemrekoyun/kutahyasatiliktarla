'use server';

import { updateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-guards';
import { TAGS } from '@/lib/cache-tags';
import { actionError, actionOk, type ActionResult } from '@/lib/action-result';

const KEYS = ['kvkk', 'gizlilik', 'cerez', 'kosullar', 'iys'] as const;
type LegalKey = (typeof KEYS)[number];

export async function updateLegalDoc(
  key: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  if (!KEYS.includes(key as LegalKey)) return actionError('Geçersiz belge.');

  const title = String(formData.get('title') ?? '').trim().slice(0, 160);
  const body = String(formData.get('body') ?? '').trim().slice(0, 100_000);

  const fieldErrors: Record<string, string[]> = {};
  if (title.length < 3) fieldErrors.title = ['Başlık en az 3 karakter.'];
  if (body.length < 20) fieldErrors.body = ['Metin en az 20 karakter.'];
  if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors };

  await prisma.legalDoc.upsert({
    where: { key: key as LegalKey },
    update: { title, body },
    create: { key: key as LegalKey, title, body },
  });
  updateTag(TAGS.siteContent);
  return actionOk;
}

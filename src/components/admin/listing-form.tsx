'use client';

import { useActionState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { LAND_TYPES } from '@/content';
import { deleteListing } from '@/app/admin/ilanlar/actions';
import type { ActionResult } from '@/lib/action-result';
import {
  AdminInput,
  AdminSelect,
  AdminTextarea,
  Field,
  SubmitButton,
  dangerBtn,
} from './ui';

const STATUS_OPTIONS = [
  ['taslak', 'Taslak'],
  ['incelemede', 'İncelemede'],
  ['cekimBekliyor', 'Çekim Bekleniyor'],
  ['aktif', 'Yayında'],
  ['kiralandi', 'Kiralandı'],
  ['satildi', 'Satıldı'],
  ['pasif', 'Pasif'],
  ['reddedildi', 'Reddedildi'],
] as const;

export type ListingFormDefaults = {
  title: string;
  imarDurumu: string;
  yolDurumu: string;
  tapuDurumu: string;
  suVar: boolean;
  elektrikVar: boolean;
  district: string;
  location: string;
  type: string;
  purpose: string;
  status: string;
  badge: string;
  areaM2: string;
  priceTRY: string;
  lat: string;
  lng: string;
  droneVideo: string;
  images: string;
  description: string;
  tags: string;
  highlights: string;
  specs: string;
  droneRequested: boolean;
};

export const EMPTY_LISTING_DEFAULTS: ListingFormDefaults = {
  title: '',
  imarDurumu: '',
  yolDurumu: '',
  tapuDurumu: '',
  suVar: false,
  elektrikVar: false,
  district: '',
  location: '',
  type: 'Tarla',
  purpose: 'satilik',
  status: 'taslak',
  badge: '',
  areaM2: '',
  priceTRY: '',
  lat: '',
  lng: '',
  droneVideo: '',
  images: '',
  description: '',
  tags: '',
  highlights: '',
  specs: '',
  droneRequested: false,
};

/** Admin ilan formu — eski panelin akordeon alan seti + moderasyon alanları
 * (durum, koordinat, yayın şartları). Kaydetme yönlendirmeyle biter. */
export function ListingForm({
  action,
  defaults,
  submitLabel = 'Kaydet',
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  defaults: ListingFormDefaults;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState<ActionResult, FormData>(action, {
    ok: false,
  });
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Başlık" error={fe.title}>
          <AdminInput name="title" defaultValue={defaults.title} required />
        </Field>
        <Field label="Konum" error={fe.location}>
          <AdminInput
            name="location"
            defaultValue={defaults.location}
            placeholder="Tavşanlı / Kütahya"
            required
          />
        </Field>
        <Field label="İlçe (filtre için)" error={fe.district}>
          <AdminInput name="district" defaultValue={defaults.district} required />
        </Field>
        <Field label="Arazi Tipi (filtre için)" error={fe.type}>
          <AdminSelect name="type" defaultValue={defaults.type}>
            {LAND_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </AdminSelect>
        </Field>
        <Field label="İlan Amacı" error={fe.purpose}>
          <AdminSelect name="purpose" defaultValue={defaults.purpose}>
            <option value="satilik">Satılık</option>
            <option value="kiralik">Kiralık</option>
          </AdminSelect>
        </Field>
        <Field label="Durum" error={fe.status}>
          <AdminSelect name="status" defaultValue={defaults.status}>
            {STATUS_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </AdminSelect>
        </Field>
        <Field label="Rozet" error={fe.badge}>
          <AdminInput name="badge" defaultValue={defaults.badge} placeholder="Yola Yakın" />
        </Field>
        <Field label="Alan (m²)" error={fe.areaM2}>
          <AdminInput
            name="areaM2"
            type="number"
            inputMode="numeric"
            min={1}
            defaultValue={defaults.areaM2}
            placeholder="12500"
            required
          />
        </Field>
        <Field label="Fiyat (₺) — birim fiyat otomatik hesaplanır" error={fe.priceTRY}>
          <AdminInput
            name="priceTRY"
            type="number"
            inputMode="numeric"
            min={1}
            defaultValue={defaults.priceTRY}
            placeholder="1850000"
            required
          />
        </Field>
        <Field label="Enlem (lat)" error={fe.lat}>
          <AdminInput name="lat" defaultValue={defaults.lat} placeholder="39.4242" />
        </Field>
        <Field label="Boylam (lng)" error={fe.lng}>
          <AdminInput name="lng" defaultValue={defaults.lng} placeholder="29.9833" />
        </Field>
        <Field label="İmar Durumu" error={fe.imarDurumu}>
          <AdminSelect name="imarDurumu" defaultValue={defaults.imarDurumu}>
            <option value="">Seçilmedi</option>
            <option value="imarsiz">Tarla (imarsız)</option>
            <option value="koyYerlesik">Köy yerleşik alanı</option>
            <option value="konutImarli">Konut imarlı</option>
            <option value="sanayiTicari">Sanayi / Ticari</option>
            <option value="diger">Diğer</option>
          </AdminSelect>
        </Field>
        <Field label="Tapu Durumu" error={fe.tapuDurumu}>
          <AdminSelect name="tapuDurumu" defaultValue={defaults.tapuDurumu}>
            <option value="">Seçilmedi</option>
            <option value="mustakil">Müstakil</option>
            <option value="hisseli">Hisseli</option>
            <option value="tahsisli">Tahsisli</option>
          </AdminSelect>
        </Field>
        <Field label="Yol Durumu" error={fe.yolDurumu}>
          <AdminSelect name="yolDurumu" defaultValue={defaults.yolDurumu}>
            <option value="">Seçilmedi</option>
            <option value="cepheli">Yola cepheli</option>
            <option value="yakin">Yola yakın</option>
            <option value="yok">Yolu yok</option>
          </AdminSelect>
        </Field>
        <div className="flex items-end gap-5 pb-2">
          <label className="flex items-center gap-2 text-sm text-[#1f2a1d]">
            <input type="checkbox" name="suVar" defaultChecked={defaults.suVar} className="h-4 w-4 accent-[#3d5638]" />
            Su var
          </label>
          <label className="flex items-center gap-2 text-sm text-[#1f2a1d]">
            <input type="checkbox" name="elektrikVar" defaultChecked={defaults.elektrikVar} className="h-4 w-4 accent-[#3d5638]" />
            Elektrik var
          </label>
        </div>
        <Field
          label="Drone video URL (video dosyası yüklediyseniz boş bırakın)"
          error={fe.droneVideo}
        >
          <AdminInput
            name="droneVideo"
            defaultValue={defaults.droneVideo}
            placeholder="/videos/ilan.mp4"
          />
        </Field>
      </div>

      <Field
        label="Harici görsel URL'leri (isteğe bağlı — yüklenen görsellerin arkasına sıralanır)"
        error={fe.images}
      >
        <AdminTextarea
          name="images"
          rows={4}
          defaultValue={defaults.images}
          placeholder="/images/tarla-1.jpg"
        />
      </Field>

      <Field label="Açıklama" error={fe.description}>
        <AdminTextarea name="description" rows={5} defaultValue={defaults.description} required />
      </Field>

      <Field label="Etiketler (virgülle ayırın)" error={fe.tags}>
        <AdminInput name="tags" defaultValue={defaults.tags} placeholder="Yatırımlık, Sulu Tarım" />
      </Field>

      <Field label="Öne çıkanlar (her satır bir madde)" error={fe.highlights}>
        <AdminTextarea name="highlights" rows={4} defaultValue={defaults.highlights} />
      </Field>

      <Field label="Ek arazi bilgileri (her satır: Etiket | Değer — imar/tapu/yol/su/elektrik yukarıdaki alanlardan gelir)" error={fe.specs}>
        <AdminTextarea
          name="specs"
          rows={6}
          defaultValue={defaults.specs}
          placeholder={'Ada / Parsel | 142 / 7\nİmar Durumu | Tarla'}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-[#1f2a1d]">
        <input
          type="checkbox"
          name="droneRequested"
          defaultChecked={defaults.droneRequested}
          className="h-4 w-4 accent-[#3d5638]"
        />
        Drone çekimi talep edildi
      </label>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <SubmitButton>{submitLabel}</SubmitButton>
        {!state.ok && state.error ? (
          <span className="text-sm text-red-600">{state.error}</span>
        ) : null}
      </div>
    </form>
  );
}

export function DeleteListingButton({ listingId }: { listingId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm('Bu ilanı ve tüm medyasını silmek istediğinize emin misiniz?')) return;
        startTransition(async () => {
          await deleteListing(listingId);
        });
      }}
      className={dangerBtn}
    >
      <Trash2 size={15} />
      {pending ? 'Siliniyor…' : 'İlanı Sil'}
    </button>
  );
}

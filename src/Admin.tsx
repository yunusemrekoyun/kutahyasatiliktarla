'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  Leaf,
  LogIn,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  ChevronDown,
  Inbox,
} from 'lucide-react';
import { useStore } from './store';
import { defaultContent, LAND_TYPES, type SiteContent, type LandType } from './content';

// NOTE: Bu basit bir giriş kapısıdır — gerçek güvenlik değildir (şifre tarayıcı
// paketinde görünür). Yayına alırken gerçek kullanıcı doğrulaması (backend) eklenmeli.
const ADMIN_PASSWORD = 'changeme';
const SESSION_KEY = 'kst_admin_auth';

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

const tagsToStr = (a: string[]) => a.join(', ');
const strToTags = (s: string) =>
  s.split(',').map((t) => t.trim()).filter(Boolean);
const linesToStr = (a: string[]) => a.join('\n');
const strToLines = (s: string) =>
  s.split('\n').map((t) => t.trim()).filter(Boolean);
const specsToStr = (specs: { label: string; value: string }[]) =>
  specs.map((s) => `${s.label} | ${s.value}`).join('\n');
const strToSpecs = (s: string) =>
  s
    .split('\n')
    .map((line) => line.split('|'))
    .filter((p) => p[0] && p[0].trim())
    .map((p) => ({ label: (p[0] || '').trim(), value: (p[1] || '').trim() }));

function Input({
  label,
  value,
  onChange,
  textarea,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-[#4b5b47] mb-1">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-[#D9E3D5] bg-white px-3 py-2 text-sm text-[#1f2a1d] outline-none focus:border-[#3d5638]"
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-[#D9E3D5] bg-white px-3 py-2 text-sm text-[#1f2a1d] outline-none focus:border-[#3d5638]"
        />
      )}
    </label>
  );
}

const TABS = [
  { key: 'genel', label: 'Genel' },
  { key: 'bolumler', label: 'Bölüm Başlıkları' },
  { key: 'ilanlar', label: 'İlanlar' },
  { key: 'bolgeler', label: 'Bölgeler' },
  { key: 'ozellikler', label: 'Özellikler' },
  { key: 'rehber', label: 'Rehber Yazıları' },
  { key: 'talepler', label: 'Talepler' },
  { key: 'yedek', label: 'Yedek' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function Admin() {
  const { content, hydrated, saveContent, resetContent, leads, clearLeads } =
    useStore();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState(false);

  const [draft, setDraft] = useState<SiteContent>(() =>
    structuredClone(content)
  );

  // sessionStorage is unavailable during SSR — read the auth flag after mount.
  useEffect(() => {
    setAuthed(sessionStorage.getItem(SESSION_KEY) === '1');
  }, []);

  // Re-sync the editable draft once persisted content hydrates from storage.
  useEffect(() => {
    setDraft(structuredClone(content));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);
  const [tab, setTab] = useState<TabKey>('genel');
  const [saved, setSaved] = useState(false);
  const [openListing, setOpenListing] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function login(e: FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setAuthed(true);
    } else {
      setPwErr(true);
    }
  }

  function goSite() {
    router.push('/');
  }

  function save() {
    saveContent(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  // ---- generic draft updaters ----
  function patch(fn: (d: SiteContent) => void) {
    setDraft((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kutahya-icerik.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        setDraft({ ...structuredClone(defaultContent), ...parsed });
        alert('İçerik yüklendi. Yayınlamak için "Kaydet"e basın.');
      } catch {
        alert('Geçersiz dosya.');
      }
    };
    reader.readAsText(file);
  }

  if (!authed) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#1f2a1d] px-4">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-[2rem] bg-[#FAF7EF] p-8 shadow-2xl"
        >
          <div className="flex items-center gap-2 text-[#1f2a1d]">
            <span className="grid place-items-center w-10 h-10 rounded-full bg-[#3d5638] text-[#FAF7EF]">
              <Leaf size={20} />
            </span>
            <span className="font-semibold text-lg">Yönetim Girişi</span>
          </div>
          <p className="mt-3 text-sm text-[#4b5b47]">
            İçeriği düzenlemek için şifrenizi girin.
          </p>
          <input
            type="password"
            value={pw}
            autoFocus
            onChange={(e) => {
              setPw(e.target.value);
              setPwErr(false);
            }}
            placeholder="Şifre"
            className="mt-5 w-full rounded-xl border border-[#D9E3D5] bg-white px-4 py-3 text-[#1f2a1d] outline-none focus:border-[#3d5638]"
          />
          {pwErr && (
            <p className="mt-2 text-sm text-red-600">Şifre hatalı, tekrar deneyin.</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#3d5638] hover:bg-[#2d4228] text-[#FAF7EF] px-4 py-3 transition-colors"
          >
            <LogIn size={18} />
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={goSite}
            className="mt-3 w-full text-center text-sm text-[#4b5b47] hover:text-[#1f2a1d]"
          >
            ← Siteye dön
          </button>
          <p className="mt-5 text-[11px] leading-relaxed text-[#8A6A43]">
            Demo şifre: <b>changeme</b> · Yayına alırken bunu değiştirip gerçek giriş
            sistemi ekleyeceğiz.
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE6]">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#1f2a1d] text-[#FAF7EF] px-4 sm:px-6 py-3">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center w-8 h-8 rounded-full bg-[#3d5638]">
              <Leaf size={16} />
            </span>
            <span className="font-medium">Yönetim Paneli</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goSite}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#FAF7EF]/30 px-3 py-1.5 text-sm hover:bg-[#FAF7EF]/10 transition-colors"
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">Siteye Dön</span>
            </button>
            <button
              onClick={save}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#85AB8B] text-[#1f2a1d] px-4 py-1.5 text-sm font-medium hover:bg-[#9bbfa0] transition-colors"
            >
              <Save size={15} />
              {saved ? 'Kaydedildi ✓' : 'Kaydet'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#FAF7EF] border-b border-[#D9E3D5] px-4 sm:px-6">
        <div className="mx-auto max-w-5xl flex gap-1 overflow-x-auto py-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                tab === t.key
                  ? 'bg-[#3d5638] text-[#FAF7EF]'
                  : 'text-[#2d3a2a] hover:bg-[#1f2a1d]/5'
              }`}
            >
              {t.label}
              {t.key === 'talepler' && leads.length > 0 && (
                <span className="ml-1.5 inline-grid place-items-center min-w-5 h-5 px-1 rounded-full bg-[#8A6A43] text-[#FAF7EF] text-[11px]">
                  {leads.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {tab === 'genel' && (
          <div className="space-y-6">
            <Card title="Marka & Hero">
              <div className="grid gap-4">
                <Input
                  label="Marka adı"
                  value={draft.brand}
                  onChange={(v) => patch((d) => (d.brand = v))}
                />
                <Input
                  label="Hero üst rozet"
                  value={draft.hero.badge}
                  onChange={(v) => patch((d) => (d.hero.badge = v))}
                />
                <Input
                  label="Ana başlık"
                  textarea
                  rows={2}
                  value={draft.hero.titleLine1}
                  onChange={(v) => patch((d) => (d.hero.titleLine1 = v))}
                />
                <Input
                  label="Vurgu satırı (yeşil)"
                  value={draft.hero.titleAccent}
                  onChange={(v) => patch((d) => (d.hero.titleAccent = v))}
                />
                <Input
                  label="Alt açıklama"
                  textarea
                  value={draft.hero.subtitle}
                  onChange={(v) => patch((d) => (d.hero.subtitle = v))}
                />
              </div>
            </Card>

            <Card title="İstatistik Şeridi">
              <div className="grid sm:grid-cols-2 gap-3">
                {draft.stats.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={s.value}
                      onChange={(e) =>
                        patch((d) => (d.stats[i].value = e.target.value))
                      }
                      className="w-24 rounded-xl border border-[#D9E3D5] bg-white px-3 py-2 text-sm"
                    />
                    <input
                      value={s.label}
                      onChange={(e) =>
                        patch((d) => (d.stats[i].label = e.target.value))
                      }
                      className="flex-1 rounded-xl border border-[#D9E3D5] bg-white px-3 py-2 text-sm"
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card title="İletişim Bilgileri">
              <div className="grid sm:grid-cols-3 gap-4">
                <Input
                  label="Telefon"
                  value={draft.contact.phone}
                  onChange={(v) => patch((d) => (d.contact.phone = v))}
                />
                <Input
                  label="WhatsApp"
                  value={draft.contact.whatsapp}
                  onChange={(v) => patch((d) => (d.contact.whatsapp = v))}
                />
                <Input
                  label="E-posta"
                  value={draft.contact.email}
                  onChange={(v) => patch((d) => (d.contact.email = v))}
                />
              </div>
              <p className="mt-3 text-xs text-[#8A6A43]">
                Telefon/WhatsApp tüm butonlarda otomatik kullanılır (ör. +90 555 123 45
                67).
              </p>
            </Card>
          </div>
        )}

        {tab === 'bolumler' && (
          <Card title="Bölüm Başlıkları ve Açıklamaları">
            <div className="grid gap-4">
              {(
                [
                  ['listingsTitle', 'İlanlar — başlık'],
                  ['listingsSubtitle', 'İlanlar — açıklama'],
                  ['mapTitle', 'Harita — başlık'],
                  ['mapSubtitle', 'Harita — açıklama'],
                  ['districtsTitle', 'Bölgeler — başlık'],
                  ['districtsSubtitle', 'Bölgeler — açıklama'],
                  ['aboutTitle', 'Neden Biz — başlık'],
                  ['aboutSubtitle', 'Neden Biz — açıklama'],
                  ['guideTitle', 'Rehber — başlık'],
                  ['guideSubtitle', 'Rehber — açıklama'],
                  ['matchTitle', 'Talep Formu — başlık'],
                  ['matchSubtitle', 'Talep Formu — açıklama'],
                  ['contactTitle', 'İletişim — başlık'],
                  ['contactSubtitle', 'İletişim — açıklama'],
                ] as [keyof SiteContent['sections'], string][]
              ).map(([key, label]) => (
                <Input
                  key={key}
                  label={label}
                  textarea={key.includes('Subtitle')}
                  value={draft.sections[key]}
                  onChange={(v) => patch((d) => (d.sections[key] = v))}
                />
              ))}
            </div>
          </Card>
        )}

        {tab === 'ilanlar' && (
          <div className="space-y-4">
            <button
              onClick={() =>
                patch((d) =>
                  d.listings.unshift({
                    ...structuredClone(defaultContent.listings[0]),
                    id: uid('listing'),
                    title: 'Yeni İlan',
                  })
                )
              }
              className="inline-flex items-center gap-2 rounded-full bg-[#3d5638] text-[#FAF7EF] px-4 py-2 text-sm hover:bg-[#2d4228] transition-colors"
            >
              <Plus size={16} />
              Yeni İlan Ekle
            </button>

            {draft.listings.map((l, i) => (
              <div
                key={l.id}
                className="rounded-2xl border border-[#D9E3D5] bg-[#FAF7EF] overflow-hidden"
              >
                <button
                  onClick={() => setOpenListing(openListing === l.id ? null : l.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-medium text-[#1f2a1d]">
                    {l.title || 'İsimsiz ilan'}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[#3d5638] transition-transform ${
                      openListing === l.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openListing === l.id && (
                  <div className="px-5 pb-5 grid gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Başlık"
                        value={l.title}
                        onChange={(v) => patch((d) => (d.listings[i].title = v))}
                      />
                      <Input
                        label="Konum"
                        value={l.location}
                        onChange={(v) => patch((d) => (d.listings[i].location = v))}
                      />
                      <Input
                        label="İlçe (filtre için)"
                        value={l.district}
                        onChange={(v) => patch((d) => (d.listings[i].district = v))}
                      />
                      <label className="block">
                        <span className="block text-xs font-medium text-[#4b5b47] mb-1">
                          Arazi Tipi (filtre için)
                        </span>
                        <select
                          value={l.type}
                          onChange={(e) =>
                            patch((d) => (d.listings[i].type = e.target.value as LandType))
                          }
                          className="w-full rounded-xl border border-[#D9E3D5] bg-white px-3 py-2 text-sm text-[#1f2a1d] outline-none focus:border-[#3d5638]"
                        >
                          {LAND_TYPES.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </label>
                      <Input
                        label="Rozet"
                        value={l.badge}
                        onChange={(v) => patch((d) => (d.listings[i].badge = v))}
                      />
                      <Input
                        label="Alan (m²)"
                        value={l.area}
                        onChange={(v) => patch((d) => (d.listings[i].area = v))}
                      />
                      <Input
                        label="Fiyat"
                        value={l.price}
                        onChange={(v) => patch((d) => (d.listings[i].price = v))}
                      />
                      <Input
                        label="Birim fiyat (₺/m²)"
                        value={l.pricePerM2}
                        onChange={(v) => patch((d) => (d.listings[i].pricePerM2 = v))}
                      />
                      <Input
                        label="Enlem (lat)"
                        value={String(l.lat)}
                        onChange={(v) =>
                          patch((d) => (d.listings[i].lat = Number(v) || 0))
                        }
                      />
                      <Input
                        label="Boylam (lng)"
                        value={String(l.lng)}
                        onChange={(v) =>
                          patch((d) => (d.listings[i].lng = Number(v) || 0))
                        }
                      />
                    </div>
                    <Input
                      label="Drone video URL"
                      value={l.droneVideo}
                      onChange={(v) => patch((d) => (d.listings[i].droneVideo = v))}
                      placeholder="/videos/ilan.mp4"
                    />
                    <Input
                      label="Görsel URL'leri (her satır bir görsel — boşsa otomatik manzara kullanılır)"
                      textarea
                      rows={3}
                      value={linesToStr(l.images)}
                      onChange={(v) => patch((d) => (d.listings[i].images = strToLines(v)))}
                      placeholder="/images/tarla-1.jpg"
                    />
                    <Input
                      label="Açıklama"
                      textarea
                      value={l.description}
                      onChange={(v) => patch((d) => (d.listings[i].description = v))}
                    />
                    <Input
                      label="Etiketler (virgülle ayırın)"
                      value={tagsToStr(l.tags)}
                      onChange={(v) =>
                        patch((d) => (d.listings[i].tags = strToTags(v)))
                      }
                    />
                    <Input
                      label="Öne çıkanlar (her satır bir madde)"
                      textarea
                      rows={4}
                      value={linesToStr(l.highlights)}
                      onChange={(v) =>
                        patch((d) => (d.listings[i].highlights = strToLines(v)))
                      }
                    />
                    <Input
                      label="Künye (her satır: Etiket | Değer)"
                      textarea
                      rows={6}
                      value={specsToStr(l.specs)}
                      onChange={(v) =>
                        patch((d) => (d.listings[i].specs = strToSpecs(v)))
                      }
                    />
                    <button
                      onClick={() => {
                        if (confirm('Bu ilanı silmek istediğinize emin misiniz?')) {
                          patch((d) => d.listings.splice(i, 1));
                          setOpenListing(null);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 self-start rounded-full border border-red-300 text-red-600 px-4 py-2 text-sm hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={15} />
                      İlanı Sil
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'bolgeler' && (
          <Card title="Bölgeler">
            <div className="grid gap-3">
              {draft.districts.map((d0, i) => (
                <div key={i} className="grid sm:grid-cols-3 gap-2">
                  <input
                    value={d0.name}
                    onChange={(e) =>
                      patch((d) => (d.districts[i].name = e.target.value))
                    }
                    className="rounded-xl border border-[#D9E3D5] bg-white px-3 py-2 text-sm"
                    placeholder="İlçe"
                  />
                  <input
                    value={d0.count}
                    onChange={(e) =>
                      patch((d) => (d.districts[i].count = e.target.value))
                    }
                    className="rounded-xl border border-[#D9E3D5] bg-white px-3 py-2 text-sm"
                    placeholder="24 ilan"
                  />
                  <div className="flex gap-2">
                    <input
                      value={d0.text}
                      onChange={(e) =>
                        patch((d) => (d.districts[i].text = e.target.value))
                      }
                      className="flex-1 rounded-xl border border-[#D9E3D5] bg-white px-3 py-2 text-sm"
                      placeholder="Açıklama"
                    />
                    <button
                      onClick={() => patch((d) => d.districts.splice(i, 1))}
                      className="grid place-items-center w-9 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  patch((d) =>
                    d.districts.push({ name: '', count: '', text: '' })
                  )
                }
                className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#3d5638] text-[#FAF7EF] px-4 py-2 text-sm hover:bg-[#2d4228]"
              >
                <Plus size={15} />
                Bölge Ekle
              </button>
            </div>
          </Card>
        )}

        {tab === 'ozellikler' && (
          <Card title="Özellikler (Neden Biz)">
            <div className="grid gap-4">
              {draft.features.map((f, i) => (
                <div key={i} className="grid sm:grid-cols-2 gap-3">
                  <Input
                    label="Başlık"
                    value={f.title}
                    onChange={(v) => patch((d) => (d.features[i].title = v))}
                  />
                  <Input
                    label="Açıklama"
                    value={f.text}
                    onChange={(v) => patch((d) => (d.features[i].text = v))}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === 'rehber' && (
          <Card title="Rehber Yazıları">
            <div className="grid gap-5">
              {draft.articles.map((a, i) => (
                <div key={i} className="grid gap-3 border-b border-[#D9E3D5] pb-4 last:border-0">
                  <Input
                    label="Kategori"
                    value={a.category}
                    onChange={(v) => patch((d) => (d.articles[i].category = v))}
                  />
                  <Input
                    label="Başlık"
                    value={a.title}
                    onChange={(v) => patch((d) => (d.articles[i].title = v))}
                  />
                  <Input
                    label="Metin"
                    textarea
                    value={a.text}
                    onChange={(v) => patch((d) => (d.articles[i].text = v))}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === 'talepler' && (
          <Card title={`Gelen Talepler (${leads.length})`}>
            {leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-[#4b5b47]">
                <Inbox size={40} className="text-[#85AB8B]" />
                <p className="mt-3 text-sm">Henüz talep yok.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {leads.map((l) => (
                  <div
                    key={l.id}
                    className="rounded-2xl border border-[#D9E3D5] bg-white p-4 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#1f2a1d]">{l.name}</span>
                      <a
                        href={`tel:${l.phone.replace(/[^\d+]/g, '')}`}
                        className="text-[#3d5638] font-medium"
                      >
                        {l.phone}
                      </a>
                    </div>
                    <div className="mt-2 grid sm:grid-cols-3 gap-2 text-[#4b5b47]">
                      <span>Bütçe: {l.budget || '—'}</span>
                      <span>Bölge: {l.district || '—'}</span>
                      <span>Amaç: {l.purpose || '—'}</span>
                    </div>
                    {l.note && <p className="mt-2 text-[#4b5b47]">Not: {l.note}</p>}
                  </div>
                ))}
                <button
                  onClick={() => {
                    if (confirm('Tüm talepleri silmek istediğinize emin misiniz?'))
                      clearLeads();
                  }}
                  className="inline-flex items-center gap-1.5 self-start rounded-full border border-red-300 text-red-600 px-4 py-2 text-sm hover:bg-red-50"
                >
                  <Trash2 size={15} />
                  Talepleri Temizle
                </button>
              </div>
            )}
          </Card>
        )}

        {tab === 'yedek' && (
          <Card title="Yedekleme ve Sıfırlama">
            <p className="text-sm text-[#4b5b47]">
              İçeriği bilgisayarınıza yedekleyin, başka cihaza taşıyın veya varsayılana
              dönün.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={exportJSON}
                className="inline-flex items-center gap-2 rounded-full bg-[#3d5638] text-[#FAF7EF] px-4 py-2 text-sm hover:bg-[#2d4228]"
              >
                <Download size={16} />
                JSON İndir
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-[#D9E3D5] text-[#1f2a1d] px-4 py-2 text-sm hover:bg-[#F4EFE6]"
              >
                <Upload size={16} />
                JSON Yükle
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) importJSON(f);
                  e.target.value = '';
                }}
              />
              <button
                onClick={() => {
                  if (
                    confirm(
                      'Tüm içerik varsayılana dönecek. Emin misiniz? (Kaydet demeden uygulanmaz)'
                    )
                  ) {
                    setDraft(structuredClone(defaultContent));
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full border border-[#8A6A43]/40 text-[#8A6A43] px-4 py-2 text-sm hover:bg-[#8A6A43]/10"
              >
                <RotateCcw size={16} />
                Varsayılana Dön
              </button>
              <button
                onClick={() => {
                  if (
                    confirm(
                      'Kayıtlı içeriği tamamen silmek istediğinize emin misiniz?'
                    )
                  ) {
                    resetContent();
                    setDraft(structuredClone(defaultContent));
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full border border-red-300 text-red-600 px-4 py-2 text-sm hover:bg-red-50"
              >
                <Trash2 size={16} />
                Kayıtlıyı Sil
              </button>
            </div>
            <p className="mt-4 text-xs text-[#8A6A43] leading-relaxed">
              Not: Değişiklikler şu an bu tarayıcıya kaydedilir. Sitedeki herkesin görmesi
              için, “JSON İndir” ile yedeği alıp yayınladığımız sürüme gömeriz ya da ileride
              bir sunucu/veritabanı bağlarız.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#D9E3D5] bg-[#FAF7EF] p-5 sm:p-6">
      <h2 className="text-[#1f2a1d] font-medium mb-4">{title}</h2>
      {children}
    </section>
  );
}

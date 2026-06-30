import {
  useEffect,
  useState,
  type ReactNode,
  type FormEvent,
  type MouseEvent,
} from 'react';
import {
  Play,
  Menu,
  X,
  Search,
  MapPin,
  Ruler,
  Wallet,
  Phone,
  MessageCircle,
  Leaf,
  ShieldCheck,
  TrendingUp,
  Map,
  ArrowRight,
  FileText,
  Landmark,
  MapPinned,
  ScrollText,
  Layers,
  Route,
  Zap,
  Droplets,
  Mountain,
  PieChart,
  Banknote,
  Compass,
  CheckCircle2,
  ExternalLink,
  Share2,
  Calculator,
  Send,
  Home,
  type LucideIcon,
} from 'lucide-react';
import BoomerangVideoBg from './BoomerangVideoBg';
import FieldScene from './FieldScene';
import LeafletMap, { type MapMarker } from './LeafletMap';
import Admin from './Admin';
import { useStore, parsePrice, formatTRY, waLink, telLink } from './store';
import { LAND_TYPES, type Listing } from './content';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4';

const HEADING_FONT =
  '"Plus Jakarta Sans", "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif';

const navLinks = [
  { href: '#listings', label: 'İlanlar' },
  { href: '#map', label: 'Harita' },
  { href: '#districts', label: 'Bölgeler' },
  { href: '#guide', label: 'Yatırım Rehberi' },
  { href: '#contact', label: 'İletişim' },
];

const FEATURE_ICONS: Record<string, LucideIcon> = {
  local: MapPinned,
  drone: Play,
  verified: ShieldCheck,
  invest: TrendingUp,
};

const SPEC_ICONS: Record<string, LucideIcon> = {
  'Tapu Durumu': ScrollText,
  'İmar Durumu': Map,
  'Ada / Parsel': Layers,
  'Yol Durumu': Route,
  Elektrik: Zap,
  Su: Droplets,
  'Arazi Eğimi': Mountain,
  'Hisse Durumu': PieChart,
  'Krediye Uygunluk': Banknote,
  Koordinat: Compass,
};

function specIcon(label: string): LucideIcon {
  return SPEC_ICONS[label] ?? FileText;
}

const SIZE_RANGES = [
  { label: 'm² Aralığı', min: 0, max: Infinity },
  { label: '0 - 2.000 m²', min: 0, max: 2000 },
  { label: '2.000 - 5.000 m²', min: 2000, max: 5000 },
  { label: '5.000 - 10.000 m²', min: 5000, max: 10000 },
  { label: '10.000 m² ve üzeri', min: 10000, max: Infinity },
];

const PRICE_RANGES = [
  { label: 'Fiyat Aralığı', min: 0, max: Infinity },
  { label: '0 - 750.000 ₺', min: 0, max: 750000 },
  { label: '750.000 - 1.500.000 ₺', min: 750000, max: 1500000 },
  { label: '1.500.000 - 3.000.000 ₺', min: 1500000, max: 3000000 },
  { label: '3.000.000 ₺ ve üzeri', min: 3000000, max: Infinity },
];

export type Filters = { district: string; type: string; sizeIdx: number; priceIdx: number };
const emptyFilters: Filters = { district: '', type: '', sizeIdx: 0, priceIdx: 0 };

function hasActiveFilters(f: Filters) {
  return !!f.district || !!f.type || f.sizeIdx > 0 || f.priceIdx > 0;
}

function areaToNumber(area: string) {
  return parseInt(area.replace(/[^\d]/g, ''), 10) || 0;
}

function matchListing(l: Listing, f: Filters) {
  if (f.district && l.district !== f.district) return false;
  if (f.type && l.type !== f.type) return false;
  const area = areaToNumber(l.area);
  const sr = SIZE_RANGES[f.sizeIdx];
  if (area < sr.min || area > sr.max) return false;
  const price = parsePrice(l.price);
  const pr = PRICE_RANGES[f.priceIdx];
  if (price < pr.min || price > pr.max) return false;
  return true;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function useIsAdminRoute() {
  const check = () =>
    window.location.pathname.replace(/\/+$/, '').toLowerCase() === '/admin' ||
    window.location.hash === '#admin';
  const [isAdmin, setIsAdmin] = useState(check);
  useEffect(() => {
    const on = () => setIsAdmin(check());
    window.addEventListener('hashchange', on);
    window.addEventListener('popstate', on);
    return () => {
      window.removeEventListener('hashchange', on);
      window.removeEventListener('popstate', on);
    };
  }, []);
  return isAdmin;
}

function Eyebrow({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] ${
        dark ? 'text-[#85AB8B]' : 'text-[#8A6A43]'
      }`}
    >
      <span className={`w-6 h-px ${dark ? 'bg-[#85AB8B]/50' : 'bg-[#8A6A43]/50'}`} />
      {children}
    </span>
  );
}

function ShareButton({
  listing,
  whatsapp,
  className,
}: {
  listing: Listing;
  whatsapp: string;
  className?: string;
}) {
  function share(e: MouseEvent) {
    e.stopPropagation();
    const url = `${window.location.origin}/#listings`;
    const text = `${listing.title} — ${listing.price}\n${listing.location} · ${listing.area}`;
    const nav = navigator as Navigator & {
      share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
    };
    if (nav.share) {
      nav.share({ title: listing.title, text, url }).catch(() => {});
    } else {
      window.open(waLink(whatsapp, `${text}\n${url}`), '_blank');
    }
  }
  return (
    <button
      type="button"
      aria-label="İlanı paylaş"
      onClick={share}
      className={`grid place-items-center rounded-full transition-colors ${className ?? ''}`}
    >
      <Share2 size={17} className="text-[#1f2a1d]" />
    </button>
  );
}

function Navbar() {
  const { content } = useStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-4 sm:px-6 md:px-10 py-4 sm:py-6">
      <div className="flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 text-[#1f2a1d] font-semibold tracking-tight">
          <span className="grid place-items-center w-9 h-9 rounded-full bg-[#3d5638] text-[#FAF7EF]">
            <Leaf size={18} />
          </span>
          <span className="text-base sm:text-lg" style={{ fontFamily: HEADING_FONT }}>
            {content.brand}
          </span>
        </a>

        <nav className="hidden lg:flex items-center bg-white/70 backdrop-blur-md rounded-full pl-6 pr-1 py-1 shadow-sm border border-white/60">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="px-4 py-2 rounded-full text-sm text-[#2d3a2a] hover:bg-[#1f2a1d]/5 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-[#1f2a1d] hover:bg-[#2a3827] text-[#FAF7EF] text-sm px-4 py-2 transition-colors"
          >
            <Phone size={15} />
            Bize Ulaşın
          </a>
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <a
            href="#listings"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#D9E3D5] bg-white/60 text-sm text-[#1f2a1d] px-4 py-2 hover:bg-white transition-colors"
          >
            Tüm İlanlar
          </a>
          <a
            href={waLink(content.contact.whatsapp, 'Merhaba, Kütahya’da arazi arıyorum.')}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] hover:bg-[#1faf54] text-white text-sm px-4 py-2 transition-colors"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden relative grid place-items-center w-11 h-11 rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-sm text-[#1f2a1d]"
        >
          <Menu
            size={22}
            className={`absolute transition-all duration-300 ${
              open ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
            }`}
          />
          <X
            size={22}
            className={`absolute transition-all duration-300 ${
              open ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
            }`}
          />
        </button>
      </div>

      <div
        className={`lg:hidden fixed inset-0 z-20 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-[#1f2a1d]/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <div
          className={`fixed top-0 right-0 bottom-0 z-20 w-[85%] max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full px-7 pt-24 pb-8">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block py-3 text-2xl text-[#1f2a1d] transition-all duration-500 ${
                      open ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                    }`}
                    style={{
                      fontFamily: HEADING_FONT,
                      transitionDelay: open ? `${150 + i * 70}ms` : '0ms',
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div
              className={`mt-auto flex flex-col gap-3 transition-all duration-500 ${
                open ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
              }`}
              style={{ transitionDelay: open ? '400ms' : '0ms' }}
            >
              <a
                href={waLink(content.contact.whatsapp, 'Merhaba, Kütahya’da arazi arıyorum.')}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1faf54] text-white px-5 py-3 transition-colors"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3d5638] hover:bg-[#2d4228] text-[#FAF7EF] px-5 py-3 transition-colors"
              >
                <Phone size={18} />
                Bize Ulaşın
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function StickyHeader() {
  const { content } = useStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`hidden lg:block fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${
        show ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="bg-[#FAF7EF]/95 backdrop-blur-xl border-b border-[#D9E3D5] shadow-sm">
        <div className="mx-auto max-w-6xl px-6 md:px-10 flex items-center justify-between h-16">
          <a href="#top" className="flex items-center gap-2 text-[#1f2a1d] font-semibold">
            <span className="grid place-items-center w-8 h-8 rounded-full bg-[#3d5638] text-[#FAF7EF]">
              <Leaf size={16} />
            </span>
            <span style={{ fontFamily: HEADING_FONT }}>{content.brand}</span>
          </a>
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 rounded-full text-sm text-[#2d3a2a] hover:bg-[#1f2a1d]/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#listings"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D9E3D5] text-sm text-[#1f2a1d] px-4 py-2 hover:bg-white transition-colors"
            >
              Tüm İlanlar
            </a>
            <a
              href={waLink(content.contact.whatsapp, 'Merhaba, Kütahya’da arazi arıyorum.')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] hover:bg-[#1faf54] text-white text-sm px-4 py-2 transition-colors"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const { content } = useStore();
  return (
    <section id="top" className="relative w-full min-h-screen sm:h-screen overflow-hidden">
      <BoomerangVideoBg src={BG_VIDEO} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#F4EFE6]/70 via-transparent to-[#1f2a1d]/55" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 35%, rgba(244,239,230,0.15) 0%, rgba(31,42,29,0.0) 40%, rgba(31,42,29,0.35) 100%)',
        }}
      />
      <Navbar />

      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-24 sm:pt-28 md:pt-32">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/65 backdrop-blur-md border border-white/60 text-[#3d5638] text-xs sm:text-sm px-4 py-1.5 mb-6">
          <Play size={14} />
          {content.hero.badge}
        </span>
        <h1
          className="font-semibold leading-[0.95] text-[#336443] text-[2rem] sm:text-4xl md:text-5xl lg:text-[4.75rem] xl:text-[5.25rem] max-w-6xl"
          style={{ fontFamily: HEADING_FONT, letterSpacing: '-0.035em' }}
        >
          {content.hero.titleLine1}
          <span className="block text-[#85AB8B]">{content.hero.titleAccent}</span>
        </h1>
        <p className="mt-6 sm:mt-8 text-[#4b5b47] text-sm sm:text-base md:text-lg leading-relaxed max-w-xl px-2">
          {content.hero.subtitle}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <a
            href="#listings"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f2a1d] hover:bg-[#2a3827] text-[#FAF7EF] px-6 py-3 text-sm sm:text-base transition-colors"
          >
            İlanları İncele
            <ArrowRight size={18} />
          </a>
          <a
            href="#map"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white/70 backdrop-blur-md border border-white/60 text-[#1f2a1d] px-6 py-3 text-sm sm:text-base hover:bg-white transition-colors"
          >
            <Map size={18} />
            Haritada Keşfet
          </a>
        </div>
      </div>

      <div className="hidden sm:block absolute left-6 md:left-10 bottom-8 md:bottom-10 z-10 max-w-sm">
        <div className="rounded-[1.75rem] bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-5">
          <h3 className="text-[#3d5638] text-lg font-medium" style={{ fontFamily: HEADING_FONT }}>
            Yerel Arazi Danışmanlığı
          </h3>
          <p className="mt-2 text-[#4b5b47] text-sm leading-relaxed">
            Kütahya merkez ve ilçelerinde yatırım değeri taşıyan tarla ve arazi
            fırsatlarını sizin için filtreliyoruz.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <a
              href={telLink(content.contact.phone)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#3d5638] hover:bg-[#2d4228] text-[#FAF7EF] text-sm px-4 py-2 transition-colors"
            >
              <Phone size={15} />
              Hemen Ara
            </a>
            <a
              href="#match"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D9E3D5] text-[#1f2a1d] text-sm px-4 py-2 hover:bg-[#F4EFE6] transition-colors"
            >
              Bana Uygun Arazi
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchPanel({ value, onApply }: { value: Filters; onApply: (f: Filters) => void }) {
  const { content } = useStore();
  const [draft, setDraft] = useState<Filters>(value);
  useEffect(() => {
    setDraft(value);
  }, [value]);
  const fieldClass =
    'flex items-center gap-2 rounded-2xl border border-[#D9E3D5] bg-[#FAF7EF]/80 px-4 py-3 text-[#4b5b47] text-sm';

  function apply(e: FormEvent) {
    e.preventDefault();
    onApply(draft);
    scrollToId('listings');
  }

  return (
    <section className="relative z-20 -mt-16 px-4 sm:px-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <form
          onSubmit={apply}
          className="rounded-[2rem] bg-white/85 backdrop-blur-xl border border-white/70 shadow-2xl p-4 sm:p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <label className={fieldClass}>
              <MapPin size={18} className="text-[#3d5638]" />
              <select
                className="w-full bg-transparent outline-none text-[#1f2a1d]"
                aria-label="İlçe Seç"
                value={draft.district}
                onChange={(e) => setDraft((d) => ({ ...d, district: e.target.value }))}
              >
                <option value="">Tüm İlçeler</option>
                {content.districts.map((d) => (
                  <option key={d.name}>{d.name}</option>
                ))}
              </select>
            </label>
            <label className={fieldClass}>
              <Map size={18} className="text-[#3d5638]" />
              <select
                className="w-full bg-transparent outline-none text-[#1f2a1d]"
                aria-label="Arazi Tipi"
                value={draft.type}
                onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}
              >
                <option value="">Tüm Tipler</option>
                {LAND_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className={fieldClass}>
              <Ruler size={18} className="text-[#3d5638]" />
              <select
                className="w-full bg-transparent outline-none text-[#1f2a1d]"
                aria-label="m² Aralığı"
                value={draft.sizeIdx}
                onChange={(e) => setDraft((d) => ({ ...d, sizeIdx: Number(e.target.value) }))}
              >
                {SIZE_RANGES.map((r, i) => (
                  <option key={r.label} value={i}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={fieldClass}>
              <Wallet size={18} className="text-[#3d5638]" />
              <select
                className="w-full bg-transparent outline-none text-[#1f2a1d]"
                aria-label="Fiyat Aralığı"
                value={draft.priceIdx}
                onChange={(e) => setDraft((d) => ({ ...d, priceIdx: Number(e.target.value) }))}
              >
                {PRICE_RANGES.map((r, i) => (
                  <option key={r.label} value={i}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1f2a1d] hover:bg-[#2a3827] text-[#FAF7EF] px-4 py-3 transition-colors"
            >
              <Search size={18} />
              Ara
            </button>
          </div>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[#D9E3D5] pt-5">
            {content.stats.map((s) => (
              <div key={s.label} className="text-center sm:text-left">
                <div className="text-[#336443] text-xl sm:text-2xl font-semibold" style={{ fontFamily: HEADING_FONT }}>
                  {s.value}
                </div>
                <div className="text-[#4b5b47] text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}

type Slide = { kind: 'img'; src: string } | { kind: 'scene'; variant: number };

function listingSlides(item: Listing, index: number): Slide[] {
  if (item.images.length > 0) {
    return item.images.map((src) => ({ kind: 'img', src }));
  }
  return [0, 1, 2].map((o) => ({ kind: 'scene', variant: index + o }));
}

function ListingMedia({
  item,
  index,
  onOpen,
}: {
  item: Listing;
  index: number;
  onOpen: () => void;
}) {
  const slides = listingSlides(item, index);
  const [active, setActive] = useState(0);

  return (
    <div className="relative h-56 w-full overflow-hidden">
      <button
        type="button"
        onClick={onOpen}
        className="absolute inset-0 w-full h-full"
        aria-label={`${item.title} drone görüntüsünü ve detaylarını aç`}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              i === active ? 'opacity-100 group-hover:scale-[1.06]' : 'opacity-0'
            }`}
          >
            {s.kind === 'img' ? (
              <img src={s.src} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
            ) : (
              <FieldScene variant={s.variant} className="w-full h-full object-cover" />
            )}
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f2a1d]/55 via-transparent to-[#1f2a1d]/10" />
      </button>

      <span className="pointer-events-none absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur text-[#3d5638] text-xs font-medium px-3 py-1 shadow">
        <Leaf size={13} />
        {item.badge}
      </span>
      <span className="pointer-events-none absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-[#1f2a1d]/80 backdrop-blur text-[#FAF7EF] text-xs px-3 py-1">
        <Play size={12} />
        Drone + {slides.length} görsel
      </span>

      <span className="pointer-events-none absolute inset-0 grid place-items-center">
        <span className="grid place-items-center w-14 h-14 rounded-full bg-white/90 text-[#1f2a1d] shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-white">
          <Play size={22} className="ml-0.5" />
        </span>
      </span>

      <span className="pointer-events-none absolute bottom-4 left-4 flex flex-col rounded-2xl bg-[#FAF7EF]/95 backdrop-blur px-3.5 py-2 shadow-lg">
        <span className="text-[#336443] text-lg font-semibold leading-none" style={{ fontFamily: HEADING_FONT }}>
          {item.price}
        </span>
        <span className="text-[#4b5b47] text-[11px] mt-1">{item.pricePerM2}</span>
      </span>
      <span className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-[#1f2a1d]/80 backdrop-blur text-[#FAF7EF] text-xs px-3 py-1.5">
        <Ruler size={13} />
        {item.area}
      </span>

      {slides.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActive(i);
              }}
              aria-label={`Görsel ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? 'w-6 bg-[#FAF7EF]' : 'w-2.5 bg-[#FAF7EF]/55 hover:bg-[#FAF7EF]/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ListingCard({
  item,
  index,
  onSelect,
}: {
  item: Listing;
  index: number;
  onSelect: (item: Listing) => void;
}) {
  const { content } = useStore();
  return (
    <article className="group flex flex-col rounded-[2rem] bg-[#FAF7EF] border border-[#D9E3D5] overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
      <ListingMedia item={item} index={index} onOpen={() => onSelect(item)} />

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[#8A6A43] text-xs">
            <MapPin size={14} />
            {item.location}
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href={waLink(
                content.contact.whatsapp,
                `Merhaba, "${item.title}" (${item.price}) ilanı hakkında bilgi almak istiyorum.`
              )}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="WhatsApp'tan yaz"
              className="grid place-items-center w-8 h-8 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#1f7a3d] transition-colors"
            >
              <MessageCircle size={16} />
            </a>
            <ShareButton
              listing={item}
              whatsapp={content.contact.whatsapp}
              className="w-8 h-8 bg-[#F4EFE6] hover:bg-[#e7e0d2]"
            />
          </div>
        </div>
        <h3 className="mt-2 text-[#1f2a1d] text-lg font-medium leading-snug" style={{ fontFamily: HEADING_FONT }}>
          {item.title}
        </h3>
        <p className="mt-3 text-[#4b5b47] text-sm leading-relaxed line-clamp-2">{item.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full bg-[#85AB8B]/15 text-[#3d5638] text-xs px-2.5 py-1">
              <CheckCircle2 size={12} />
              {t}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-[#D9E3D5] pt-5">
          <span className="inline-flex items-center gap-1.5 text-[#4b5b47] text-xs">
            <Compass size={14} className="text-[#3d5638]" />
            Haritada işaretli
          </span>
          <button
            type="button"
            onClick={() => onSelect(item)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#3d5638] hover:bg-[#2d4228] text-[#FAF7EF] text-sm px-4 py-2 transition-colors"
          >
            Detayları Gör
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  );
}

function Listings({
  onSelect,
  filters,
  onClear,
}: {
  onSelect: (listing: Listing) => void;
  filters: Filters;
  onClear: () => void;
}) {
  const { content } = useStore();
  const active = hasActiveFilters(filters);
  const visible = content.listings
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => matchListing(item, filters));

  return (
    <section id="listings" className="bg-[#F4EFE6] px-4 sm:px-6 md:px-10 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-2xl">
            <Eyebrow>Öne Çıkan Fırsatlar</Eyebrow>
            <h2 className="mt-4 text-[#336443] text-3xl sm:text-4xl md:text-5xl font-semibold" style={{ fontFamily: HEADING_FONT, letterSpacing: '-0.03em' }}>
              {content.sections.listingsTitle}
            </h2>
            <p className="mt-4 text-[#4b5b47] text-base leading-relaxed">{content.sections.listingsSubtitle}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[#4b5b47] text-sm">
              <b className="text-[#336443]">{visible.length}</b> ilan
            </span>
            {active && (
              <button
                onClick={onClear}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#D9E3D5] bg-white text-[#1f2a1d] text-sm px-3.5 py-2 hover:bg-[#FAF7EF] transition-colors"
              >
                <X size={15} />
                Filtreyi Temizle
              </button>
            )}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#D9E3D5] bg-[#FAF7EF] py-16 text-center">
            <span className="grid place-items-center w-14 h-14 rounded-full bg-[#85AB8B]/20 text-[#3d5638]">
              <Search size={26} />
            </span>
            <h3 className="mt-4 text-[#1f2a1d] text-lg font-medium" style={{ fontFamily: HEADING_FONT }}>
              Bu kriterlere uygun ilan bulunamadı
            </h3>
            <p className="mt-2 text-[#4b5b47] text-sm max-w-sm">
              Filtreleri değiştirip tekrar deneyin ya da bizimle iletişime geçin; size özel
              arazi bulalım.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onClear}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#3d5638] hover:bg-[#2d4228] text-[#FAF7EF] text-sm px-4 py-2.5 transition-colors"
              >
                <X size={15} />
                Filtreyi Temizle
              </button>
              <a
                href="#match"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#D9E3D5] bg-white text-[#1f2a1d] text-sm px-4 py-2.5 hover:bg-[#FAF7EF] transition-colors"
              >
                <Send size={15} />
                Bana Uygun Arazi Bul
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {visible.map(({ item, i }) => (
              <ListingCard key={item.id} item={item} index={i} onSelect={onSelect} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function MapSection({ onSelect }: { onSelect: (listing: Listing) => void }) {
  const { content } = useStore();
  const markers: MapMarker[] = content.listings.map((l) => ({
    lat: l.lat,
    lng: l.lng,
    title: l.title,
    price: l.price,
    onClick: () => onSelect(l),
  }));
  return (
    <section id="map" className="bg-[#1f2a1d] px-4 sm:px-6 md:px-10 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Eyebrow dark>Konum Bazlı Keşif</Eyebrow>
          <h2 className="mt-4 text-[#FAF7EF] text-3xl sm:text-4xl md:text-5xl font-semibold" style={{ fontFamily: HEADING_FONT, letterSpacing: '-0.03em' }}>
            {content.sections.mapTitle}
          </h2>
          <p className="mt-4 text-[#D9E3D5] text-base leading-relaxed">{content.sections.mapSubtitle}</p>
        </div>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-[2rem] overflow-hidden border border-[#FAF7EF]/15 shadow-2xl">
            <LeafletMap markers={markers} center={[39.32, 29.72]} zoom={8} className="w-full h-[360px] sm:h-[460px]" />
          </div>
          <div className="flex flex-col gap-3">
            {content.listings.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => onSelect(l)}
                className="group text-left rounded-2xl bg-[#FAF7EF]/5 hover:bg-[#FAF7EF]/10 border border-[#FAF7EF]/10 p-4 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-[#85AB8B] text-xs">
                  <MapPin size={13} />
                  {l.location}
                </div>
                <div className="mt-1 text-[#FAF7EF] text-sm font-medium leading-snug" style={{ fontFamily: HEADING_FONT }}>
                  {l.title}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[#FAF7EF]/80 text-sm">{l.price}</span>
                  <span className="inline-flex items-center gap-1 text-[#85AB8B] text-xs">
                    Görüntüle
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ROICalc({ price }: { price: string }) {
  const base = parsePrice(price);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(12);
  const projected = base * Math.pow(1 + rate / 100, years);
  const gain = projected - base;
  return (
    <div className="rounded-2xl border border-[#D9E3D5] bg-white/70 p-5">
      <div className="flex items-center gap-2 text-[#1f2a1d]">
        <Calculator size={18} className="text-[#3d5638]" />
        <h4 className="font-medium">Değer Artışı Hesaplayıcı</h4>
      </div>
      <p className="mt-1 text-xs text-[#8A6A43]">
        Tahmini senaryo — yatırım tavsiyesi değildir.
      </p>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="flex items-center justify-between text-sm text-[#4b5b47]">
            <span>Süre</span>
            <span className="font-medium text-[#1f2a1d]">{years} yıl</span>
          </span>
          <input
            type="range"
            min={1}
            max={10}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-2 w-full accent-[#3d5638]"
          />
        </label>
        <label className="block">
          <span className="flex items-center justify-between text-sm text-[#4b5b47]">
            <span>Yıllık değer artışı</span>
            <span className="font-medium text-[#1f2a1d]">%{rate}</span>
          </span>
          <input
            type="range"
            min={0}
            max={40}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="mt-2 w-full accent-[#3d5638]"
          />
        </label>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#F4EFE6] px-4 py-3">
          <div className="text-xs text-[#4b5b47]">{years} yıl sonra tahmini değer</div>
          <div className="text-[#336443] text-lg font-semibold" style={{ fontFamily: HEADING_FONT }}>
            {formatTRY(projected)}
          </div>
        </div>
        <div className="rounded-xl bg-[#F4EFE6] px-4 py-3">
          <div className="text-xs text-[#4b5b47]">Tahmini kazanç</div>
          <div className="text-[#3d5638] text-lg font-semibold" style={{ fontFamily: HEADING_FONT }}>
            +{formatTRY(gain)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingModal({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const { content } = useStore();
  const modalIndex = Math.max(0, content.listings.findIndex((l) => l.id === listing.id));
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setEntered(true);
    document.body.style.overflow = 'hidden';
    function close() {
      setEntered(false);
      window.setTimeout(onClose, 250);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  function handleClose() {
    setEntered(false);
    window.setTimeout(onClose, 250);
  }

  const mapMarker: MapMarker[] = [
    { lat: listing.lat, lng: listing.lng, title: listing.title, price: listing.price },
  ];
  const waText = `Merhaba, "${listing.title}" (${listing.price}) ilanı hakkında bilgi almak istiyorum.`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div
        className={`absolute inset-0 bg-[#1f2a1d]/55 backdrop-blur-sm transition-opacity duration-300 ${
          entered ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={listing.title}
        className={`relative z-10 w-full sm:max-w-4xl max-h-[92vh] overflow-y-auto bg-[#FAF7EF] rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          entered ? 'opacity-100 translate-y-0 sm:scale-100' : 'opacity-0 translate-y-8 sm:scale-95'
        }`}
      >
        <div className="relative">
          <div className="aspect-video w-full overflow-hidden rounded-t-[2rem] bg-[#1f2a1d]">
            <video src={listing.droneVideo} controls playsInline preload="metadata" className="w-full h-full object-cover" />
          </div>
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#1f2a1d]/85 backdrop-blur text-[#FAF7EF] text-xs px-3 py-1.5">
            <Play size={13} />
            Drone Görüntüsü
          </span>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <ShareButton
              listing={listing}
              whatsapp={content.contact.whatsapp}
              className="w-10 h-10 bg-white/90 hover:bg-white shadow-lg"
            />
            <button
              type="button"
              onClick={handleClose}
              aria-label="Kapat"
              className="grid place-items-center w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#1f2a1d] shadow-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#85AB8B]/25 text-[#3d5638] text-xs px-3 py-1">
                <Leaf size={13} />
                {listing.badge}
              </span>
              <h2 className="mt-3 text-[#1f2a1d] text-2xl sm:text-3xl font-medium leading-tight" style={{ fontFamily: HEADING_FONT, letterSpacing: '-0.02em' }}>
                {listing.title}
              </h2>
              <div className="mt-2 flex items-center gap-1.5 text-[#8A6A43] text-sm">
                <MapPin size={15} />
                {listing.location}
              </div>
            </div>
            <div className="shrink-0 sm:text-right">
              <div className="text-[#336443] text-2xl sm:text-3xl font-semibold" style={{ fontFamily: HEADING_FONT }}>
                {listing.price}
              </div>
              <div className="text-[#4b5b47] text-sm">{listing.pricePerM2}</div>
            </div>
          </div>

          <p className="mt-5 text-[#4b5b47] text-sm sm:text-base leading-relaxed">{listing.description}</p>

          {/* Görsel galerisi */}
          <div className="mt-7">
            <h3 className="text-[#1f2a1d] text-lg font-medium" style={{ fontFamily: HEADING_FONT }}>Arazi Görselleri</h3>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {listingSlides(listing, modalIndex).map((s, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#D9E3D5] bg-[#1f2a1d]"
                >
                  {s.kind === 'img' ? (
                    <img src={s.src} alt={`${listing.title} görsel ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <FieldScene variant={s.variant} className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-[#8A6A43]">
              Görseller temsilîdir; her arazinin gerçek drone çekimi yukarıdaki videoda yer alır.
            </p>
          </div>

          <div className="mt-7">
            <h3 className="text-[#1f2a1d] text-lg font-medium" style={{ fontFamily: HEADING_FONT }}>Öne Çıkanlar</h3>
            <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {listing.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-[#2d3a2a] text-sm">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#3d5638]" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7">
            <h3 className="text-[#1f2a1d] text-lg font-medium" style={{ fontFamily: HEADING_FONT }}>Arazi Künyesi</h3>
            <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between rounded-2xl border border-[#D9E3D5] bg-white/70 px-4 py-3">
                <dt className="flex items-center gap-2 text-[#4b5b47] text-sm">
                  <Ruler size={16} className="text-[#3d5638]" />
                  Alan (m²)
                </dt>
                <dd className="text-[#1f2a1d] text-sm font-medium">{listing.area}</dd>
              </div>
              {listing.specs.map((s) => {
                const Icon = specIcon(s.label);
                return (
                  <div key={s.label} className="flex items-center justify-between rounded-2xl border border-[#D9E3D5] bg-white/70 px-4 py-3">
                    <dt className="flex items-center gap-2 text-[#4b5b47] text-sm">
                      <Icon size={16} className="text-[#3d5638]" />
                      {s.label}
                    </dt>
                    <dd className="text-[#1f2a1d] text-sm font-medium text-right">{s.value}</dd>
                  </div>
                );
              })}
            </dl>
          </div>

          <div className="mt-7">
            <ROICalc price={listing.price} />
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between">
              <h3 className="text-[#1f2a1d] text-lg font-medium" style={{ fontFamily: HEADING_FONT }}>Konum</h3>
              <a
                href={`https://www.google.com/maps?q=${listing.lat},${listing.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#3d5638] text-sm font-medium hover:text-[#2d4228] transition-colors"
              >
                Google Maps’te Aç
                <ExternalLink size={15} />
              </a>
            </div>
            <div className="mt-3 rounded-2xl overflow-hidden border border-[#D9E3D5]">
              <LeafletMap markers={mapMarker} center={[listing.lat, listing.lng]} zoom={13} fitBounds={false} className="w-full h-64 sm:h-72" />
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={waLink(content.contact.whatsapp, waText)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3d5638] hover:bg-[#2d4228] text-[#FAF7EF] px-6 py-3.5 transition-colors"
            >
              <MessageCircle size={19} />
              WhatsApp’tan Bilgi Al
            </a>
            <a
              href={telLink(content.contact.phone)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9E3D5] text-[#1f2a1d] px-6 py-3.5 hover:bg-[#F4EFE6] transition-colors"
            >
              <Phone size={19} />
              Beni Ara
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchForm() {
  const { content, addLead } = useStore();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    budget: '',
    district: '',
    purpose: '',
    note: '',
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    addLead(form);
    setDone(true);
    setForm({ name: '', phone: '', budget: '', district: '', purpose: '', note: '' });
  }

  const inputCls =
    'w-full rounded-2xl border border-[#D9E3D5] bg-[#FAF7EF] px-4 py-3 text-sm text-[#1f2a1d] outline-none focus:border-[#3d5638]';

  return (
    <section id="match" className="bg-[#FAF7EF] px-4 sm:px-6 md:px-10 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <Eyebrow>Size Özel Eşleştirme</Eyebrow>
            <h2 className="mt-4 text-[#336443] text-3xl sm:text-4xl md:text-5xl font-semibold" style={{ fontFamily: HEADING_FONT, letterSpacing: '-0.03em' }}>
              {content.sections.matchTitle}
            </h2>
            <p className="mt-4 text-[#4b5b47] text-base leading-relaxed">{content.sections.matchSubtitle}</p>
            <ul className="mt-6 space-y-2.5">
              {['Bütçenize uygun seçenekler', 'Drone görüntüleriyle ön değerlendirme', 'Tek tek doğrulanmış tapu ve imar bilgisi'].map((t) => (
                <li key={t} className="flex items-center gap-2 text-[#2d3a2a] text-sm">
                  <CheckCircle2 size={18} className="text-[#3d5638]" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-[#D9E3D5] bg-white shadow-xl p-6 sm:p-8">
            {done ? (
              <div className="flex flex-col items-center text-center py-8">
                <span className="grid place-items-center w-14 h-14 rounded-full bg-[#85AB8B]/25 text-[#3d5638]">
                  <CheckCircle2 size={28} />
                </span>
                <h3 className="mt-4 text-[#1f2a1d] text-xl font-medium" style={{ fontFamily: HEADING_FONT }}>
                  Talebiniz alındı
                </h3>
                <p className="mt-2 text-[#4b5b47] text-sm">
                  En kısa sürede size uygun arazileri iletmek için ulaşacağız.
                </p>
                <button
                  onClick={() => setDone(false)}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[#D9E3D5] text-[#1f2a1d] px-4 py-2 text-sm hover:bg-[#F4EFE6]"
                >
                  Yeni talep gönder
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className={inputCls} placeholder="Adınız *" value={form.name} onChange={(e) => set('name', e.target.value)} />
                  <input className={inputCls} placeholder="Telefon *" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <select className={inputCls} value={form.district} onChange={(e) => set('district', e.target.value)}>
                    <option value="">Bölge (opsiyonel)</option>
                    {content.districts.map((d) => (
                      <option key={d.name}>{d.name}</option>
                    ))}
                  </select>
                  <select className={inputCls} value={form.budget} onChange={(e) => set('budget', e.target.value)}>
                    <option value="">Bütçe (opsiyonel)</option>
                    <option>0 - 750.000 ₺</option>
                    <option>750.000 - 1.500.000 ₺</option>
                    <option>1.500.000 - 3.000.000 ₺</option>
                    <option>3.000.000 ₺ ve üzeri</option>
                  </select>
                </div>
                <select className={inputCls} value={form.purpose} onChange={(e) => set('purpose', e.target.value)}>
                  <option value="">Amaç (opsiyonel)</option>
                  <option>Yatırım</option>
                  <option>Tarım</option>
                  <option>Konut / Bağ-bahçe</option>
                  <option>Diğer</option>
                </select>
                <textarea className={inputCls} rows={3} placeholder="Eklemek istedikleriniz (opsiyonel)" value={form.note} onChange={(e) => set('note', e.target.value)} />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3d5638] hover:bg-[#2d4228] text-[#FAF7EF] px-6 py-3.5 transition-colors"
                >
                  <Send size={18} />
                  Talebi Gönder
                </button>
                <p className="text-[11px] text-[#8A6A43] text-center">Bilgileriniz yalnızca size dönüş yapmak için kullanılır.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Districts({ onPick }: { onPick: (district: string) => void }) {
  const { content } = useStore();
  return (
    <section id="districts" className="bg-[#FAF7EF] px-4 sm:px-6 md:px-10 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Eyebrow>İlçe İlçe Kütahya</Eyebrow>
          <h2 className="mt-4 text-[#336443] text-3xl sm:text-4xl md:text-5xl font-semibold" style={{ fontFamily: HEADING_FONT, letterSpacing: '-0.03em' }}>
            {content.sections.districtsTitle}
          </h2>
          <p className="mt-4 text-[#4b5b47] text-base leading-relaxed">{content.sections.districtsSubtitle}</p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {content.districts.map((d) => (
            <button
              key={d.name}
              type="button"
              onClick={() => onPick(d.name)}
              className="group flex items-start gap-4 text-left rounded-[1.75rem] bg-[#F4EFE6] border border-[#D9E3D5] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl"
            >
              <span className="grid place-items-center w-12 h-12 rounded-2xl bg-[#3d5638] text-[#FAF7EF] shrink-0">
                <MapPin size={20} />
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-[#1f2a1d] text-lg font-medium" style={{ fontFamily: HEADING_FONT }}>{d.name}</h3>
                  <ArrowRight size={18} className="text-[#3d5638] transition-transform group-hover:translate-x-1" />
                </div>
                <span className="text-[#8A6A43] text-xs">{d.count}</span>
                <p className="mt-2 text-[#4b5b47] text-sm leading-relaxed">{d.text}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const { content } = useStore();
  return (
    <section id="about" className="bg-[#F4EFE6] px-4 sm:px-6 md:px-10 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Eyebrow>Neden Biz</Eyebrow>
          <h2 className="mt-4 text-[#336443] text-3xl sm:text-4xl md:text-5xl font-semibold" style={{ fontFamily: HEADING_FONT, letterSpacing: '-0.03em' }}>
            {content.sections.aboutTitle}
          </h2>
          <p className="mt-4 text-[#4b5b47] text-base leading-relaxed">{content.sections.aboutSubtitle}</p>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.features.map((f) => {
            const Icon = FEATURE_ICONS[f.iconKey] ?? ShieldCheck;
            return (
              <div key={f.title} className="rounded-[1.75rem] bg-[#FAF7EF] border border-[#D9E3D5] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <span className="grid place-items-center w-12 h-12 rounded-2xl bg-[#85AB8B]/25 text-[#3d5638]">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-[#1f2a1d] text-lg font-medium" style={{ fontFamily: HEADING_FONT }}>{f.title}</h3>
                <p className="mt-3 text-[#4b5b47] text-sm leading-relaxed">{f.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Guide() {
  const { content } = useStore();
  return (
    <section id="guide" className="bg-[#FAF7EF] px-4 sm:px-6 md:px-10 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Eyebrow>Yatırım Rehberi</Eyebrow>
          <h2 className="mt-4 text-[#336443] text-3xl sm:text-4xl md:text-5xl font-semibold" style={{ fontFamily: HEADING_FONT, letterSpacing: '-0.03em' }}>
            {content.sections.guideTitle}
          </h2>
          <p className="mt-4 text-[#4b5b47] text-base leading-relaxed">{content.sections.guideSubtitle}</p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.articles.map((a) => (
            <article key={a.title} className="group flex flex-col rounded-[2rem] bg-[#F4EFE6] border border-[#D9E3D5] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#8A6A43]/12 text-[#8A6A43] text-xs px-3 py-1">
                <FileText size={13} />
                {a.category}
              </span>
              <h3 className="mt-4 text-[#1f2a1d] text-xl font-medium leading-snug" style={{ fontFamily: HEADING_FONT }}>{a.title}</h3>
              <p className="mt-3 flex-1 text-[#4b5b47] text-sm leading-relaxed">{a.text}</p>
              <a href="#match" className="mt-5 inline-flex items-center gap-1.5 self-start text-[#3d5638] text-sm font-medium">
                Devamını Oku
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCTA() {
  const { content } = useStore();
  const waText = 'Merhaba, Kütahya’da arazi arıyorum, bilgi alabilir miyim?';
  return (
    <section id="contact" className="bg-[#F4EFE6] px-4 sm:px-6 md:px-10 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1f2a1d] px-6 sm:px-12 py-14 sm:py-20">
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background:
                'radial-gradient(90% 120% at 15% 0%, rgba(133,171,139,0.22) 0%, rgba(31,42,29,0) 45%), radial-gradient(80% 120% at 100% 100%, rgba(138,106,67,0.25) 0%, rgba(31,42,29,0) 50%)',
            }}
          />
          <Leaf size={220} className="pointer-events-none absolute -right-10 -bottom-12 text-[#85AB8B]/10" />
          <Landmark size={180} className="pointer-events-none absolute -left-8 -top-10 text-[#FAF7EF]/5" />
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-[#FAF7EF] text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight" style={{ fontFamily: HEADING_FONT, letterSpacing: '-0.03em' }}>
              {content.sections.contactTitle}
            </h2>
            <p className="mt-5 text-[#D9E3D5] text-base sm:text-lg leading-relaxed">{content.sections.contactSubtitle}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={waLink(content.contact.whatsapp, waText)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#85AB8B] hover:bg-[#9bbfa0] text-[#1f2a1d] font-medium px-6 py-3.5 transition-colors"
              >
                <MessageCircle size={19} />
                WhatsApp’tan Yaz
              </a>
              <a
                href={telLink(content.contact.phone)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#FAF7EF]/30 text-[#FAF7EF] px-6 py-3.5 hover:bg-[#FAF7EF]/10 transition-colors"
              >
                <Phone size={19} />
                Beni Ara
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { content } = useStore();
  return (
    <footer className="bg-[#1f2a1d] text-[#D9E3D5] px-4 sm:px-6 md:px-10 pt-16 pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 text-[#FAF7EF]">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-[#3d5638]">
                <Leaf size={18} />
              </span>
              <span className="font-semibold" style={{ fontFamily: HEADING_FONT }}>{content.brand}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#D9E3D5]/80">
              Kütahya’da tarla, arsa ve arazi arayanlar için yerel, güvenilir ve yatırım
              odaklı ilan platformu.
            </p>
          </div>
          <div>
            <h4 className="text-[#FAF7EF] font-medium mb-4">Hızlı Erişim</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '#listings', label: 'İlanlar' },
                { href: '#map', label: 'Harita' },
                { href: '#districts', label: 'Bölgeler' },
                { href: '#guide', label: 'Yatırım Rehberi' },
                { href: '#contact', label: 'İletişim' },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-[#85AB8B] transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[#FAF7EF] font-medium mb-4">Bölgeler</h4>
            <ul className="space-y-2.5 text-sm">
              {content.districts.map((d) => (
                <li key={d.name}>
                  <a href="#districts" className="hover:text-[#85AB8B] transition-colors">{d.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[#FAF7EF] font-medium mb-4">İletişim</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href={waLink(content.contact.whatsapp, 'Merhaba')} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#85AB8B] transition-colors">
                  <MessageCircle size={16} className="text-[#85AB8B]" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={telLink(content.contact.phone)} className="flex items-center gap-2 hover:text-[#85AB8B] transition-colors">
                  <Phone size={16} className="text-[#85AB8B]" />
                  {content.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${content.contact.email}`} className="flex items-center gap-2 hover:text-[#85AB8B] transition-colors">
                  <FileText size={16} className="text-[#85AB8B]" />
                  {content.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-[#FAF7EF]/10 pt-6 text-center text-sm text-[#D9E3D5]/70">
          © 2026 {content.brand}. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  const { content } = useStore();
  return (
    <a
      href={waLink(content.contact.whatsapp, 'Merhaba, Kütahya’da arazi arıyorum, bilgi alabilir miyim?')}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp'tan yazın"
      className="fixed right-4 lg:right-6 bottom-[84px] lg:bottom-6 z-40 grid place-items-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl shadow-[#1f7a3d]/40 transition-transform hover:scale-110 active:scale-95"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      <MessageCircle size={26} className="relative" />
    </a>
  );
}

function BottomNav() {
  const items = [
    { id: 'top', label: 'Ana Sayfa', icon: Home },
    { id: 'listings', label: 'İlanlar', icon: Leaf },
    { id: 'map', label: 'Harita', icon: Map },
    { id: 'match', label: 'Talep', icon: Send },
    { id: 'contact', label: 'İletişim', icon: Phone },
  ];
  const [active, setActive] = useState('top');

  useEffect(() => {
    const els = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.5, 1] }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7EF]/95 backdrop-blur-xl border-t border-[#D9E3D5] shadow-[0_-8px_24px_rgba(31,42,29,0.12)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="grid grid-cols-5">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.id;
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              onClick={() => setActive(it.id)}
              aria-current={isActive ? 'page' : undefined}
              className="relative flex flex-col items-center gap-1 pt-2 pb-1.5"
            >
              <span
                className={`grid place-items-center w-11 h-7 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-[#3d5638] text-[#FAF7EF]' : 'text-[#4b5b47]'
                }`}
              >
                <Icon size={19} />
              </span>
              <span
                className={`text-[10px] transition-colors duration-300 ${
                  isActive ? 'text-[#3d5638] font-medium' : 'text-[#4b5b47]'
                }`}
              >
                {it.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export default function App() {
  const isAdmin = useIsAdminRoute();
  const [selected, setSelected] = useState<Listing | null>(null);
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  if (isAdmin) {
    return <Admin />;
  }

  function pickDistrict(district: string) {
    setFilters({ ...emptyFilters, district });
    scrollToId('listings');
  }

  return (
    <div className="min-h-screen bg-[#F4EFE6] pb-[68px] lg:pb-0">
      <StickyHeader />
      <Hero />
      <SearchPanel value={filters} onApply={setFilters} />
      <Listings onSelect={setSelected} filters={filters} onClear={() => setFilters(emptyFilters)} />
      <MapSection onSelect={setSelected} />
      <MatchForm />
      <Districts onPick={pickDistrict} />
      <WhyUs />
      <Guide />
      <ContactCTA />
      <Footer />

      {selected && <ListingModal listing={selected} onClose={() => setSelected(null)} />}
      <FloatingWhatsApp />
      <BottomNav />
    </div>
  );
}

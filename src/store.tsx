import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { defaultContent, type SiteContent } from './content';

const CONTENT_KEY = 'kst_content_v1';
const LEADS_KEY = 'kst_leads_v1';

export type Lead = {
  id: string;
  name: string;
  phone: string;
  budget: string;
  district: string;
  purpose: string;
  note: string;
  createdAt: number;
};

type Store = {
  content: SiteContent;
  saveContent: (c: SiteContent) => void;
  resetContent: () => void;
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  clearLeads: () => void;
};

const StoreContext = createContext<Store | null>(null);

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Merge stored content over defaults so newly-added fields keep working.
function mergeContent(stored: Partial<SiteContent> | null): SiteContent {
  if (!stored) return defaultContent;
  return {
    ...defaultContent,
    ...stored,
    hero: { ...defaultContent.hero, ...(stored.hero ?? {}) },
    sections: { ...defaultContent.sections, ...(stored.sections ?? {}) },
    contact: { ...defaultContent.contact, ...(stored.contact ?? {}) },
    stats: stored.stats ?? defaultContent.stats,
    listings: (stored.listings ?? defaultContent.listings).map((l) => ({
      ...l,
      images: Array.isArray(l.images) ? l.images : [],
      tags: Array.isArray(l.tags) ? l.tags : [],
      highlights: Array.isArray(l.highlights) ? l.highlights : [],
      specs: Array.isArray(l.specs) ? l.specs : [],
      district: l.district ?? (l.location ? l.location.split('/')[0].trim() : ''),
      type: l.type ?? 'Tarla',
    })),
    districts: stored.districts ?? defaultContent.districts,
    features: stored.features ?? defaultContent.features,
    articles: stored.articles ?? defaultContent.articles,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() =>
    mergeContent(readJSON<Partial<SiteContent> | null>(CONTENT_KEY, null))
  );
  const [leads, setLeads] = useState<Lead[]>(() => readJSON<Lead[]>(LEADS_KEY, []));

  const saveContent = useCallback((c: SiteContent) => {
    setContent(c);
    localStorage.setItem(CONTENT_KEY, JSON.stringify(c));
  }, []);

  const resetContent = useCallback(() => {
    setContent(defaultContent);
    localStorage.removeItem(CONTENT_KEY);
  }, []);

  useEffect(() => {
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  }, [leads]);

  const addLead = useCallback((lead: Omit<Lead, 'id' | 'createdAt'>) => {
    const id = `lead_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    setLeads((prev) => [{ ...lead, id, createdAt: Date.now() }, ...prev]);
  }, []);

  const clearLeads = useCallback(() => setLeads([]), []);

  const value = useMemo<Store>(
    () => ({
      content,
      saveContent,
      resetContent,
      leads,
      addLead,
      clearLeads,
    }),
    [content, saveContent, resetContent, leads, addLead, clearLeads]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

// --- helpers ---
export function parsePrice(s: string): number {
  const n = Number(String(s).replace(/[^\d]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function formatTRY(n: number): string {
  return '₺' + Math.round(n).toLocaleString('tr-TR');
}

export function waLink(phone: string, text: string): string {
  const num = String(phone).replace(/[^\d]/g, '');
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}

export function telLink(phone: string): string {
  return 'tel:' + String(phone).replace(/[^\d+]/g, '');
}

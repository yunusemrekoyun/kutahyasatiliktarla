'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Görünürlükle tetiklenen yumuşak yükselme. İçerik varsayılan olarak görünür
 * kalır (SSR/JS-yok/headless güvenli); yalnızca ilk render'da ekranın altında
 * kalan bloklar gizlenip scroll ile animasyonlanır — üsttekiler anında görünür,
 * flash olmaz. Reduced-motion'da hiç dokunmaz.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.dataset.shown === 'true') return;
    // Erken çıkış yolları elemanı asla gizli bırakmamalı: effect yeniden
    // çalıştığında .reveal sınıfı önceki turdan kalmış olabilir.
    const show = () => {
      el.dataset.shown = 'true';
    };
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      show();
      return;
    }
    if (el.getBoundingClientRect().top < window.innerHeight * 0.88) {
      show();
      return;
    }

    el.classList.add('reveal');
    el.style.transitionDelay = `${delay}ms`;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.shown = 'true';
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

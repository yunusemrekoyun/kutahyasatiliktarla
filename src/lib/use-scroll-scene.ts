'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Kaydırmaya bağlı "sahne" primitifi (hero ile aynı mekanik). Uzun bir bölüm
 * (sectionRef) içinde yapışkan (sticky) bir görsel; bölümün fazladan
 * yüksekliğinde kaydırdıkça 0→1 ilerleme `--p` olarak rootRef'e yazılır.
 * CSS tüm dönüşümü --p'den sürer (transform/opacity, GPU). Kaydırma asla
 * ele geçirilmez; yalnızca konum okunur.
 *
 * `scenic` yalnızca masaüstünde ve reduced-motion kapalıyken true olur;
 * aksi halde çağıran bileşen sabit (statik) sürümü render etmelidir.
 */
export function useScrollScene<
  S extends HTMLElement = HTMLElement,
  R extends HTMLElement = HTMLElement,
>() {
  const sectionRef = useRef<S>(null);
  const rootRef = useRef<R>(null);
  const [scenic, setScenic] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!desktop.matches || reduce.matches) return;
    setScenic(true);

    const section = sectionRef.current;
    const root = rootRef.current;
    if (!section || !root) return;

    let ticking = false;
    let last = -1;
    const update = () => {
      ticking = false;
      const dist = section.offsetHeight - window.innerHeight;
      const top = section.getBoundingClientRect().top;
      const p = dist > 0 ? Math.min(1, Math.max(0, -top / dist)) : 0;
      if (Math.abs(p - last) < 0.001) return;
      last = p;
      root.style.setProperty('--p', p.toFixed(4));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return { sectionRef, rootRef, scenic };
}

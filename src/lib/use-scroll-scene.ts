'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Kaydırmaya bağlı "sahne" primitifi (hero ile aynı mekanik). Uzun bir bölüm
 * (sectionRef) içinde yapışkan (sticky) bir görsel; bölümün fazladan
 * yüksekliğinde kaydırdıkça 0→1 ilerleme `--p` olarak rootRef'e yazılır. Ayrıca
 * `data-phase` (hero | card, eşik 0.5) yazılır: kontrolleri etkinleştirmek ve
 * kart evresinde arka plan animasyonlarını durdurmak için. CSS tüm dönüşümü
 * --p'den sürer (transform/opacity, GPU). Kaydırma asla ele geçirilmez.
 *
 * `scenic` yalnızca masaüstünde ve reduced-motion kapalıyken true olur; ekran
 * boyutu / hareket tercihi değişince yeniden değerlendirilir. scenic false ise
 * çağıran bileşen sabit (statik) sürümü render etmelidir.
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
    let teardown = () => {};

    const setup = () => {
      teardown();
      teardown = () => {};
      const ok = desktop.matches && !reduce.matches;
      setScenic(ok);
      if (!ok) return;

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
        root.dataset.phase = p < 0.5 ? 'hero' : 'card';
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
      teardown = () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      };
    };

    setup();
    desktop.addEventListener('change', setup);
    reduce.addEventListener('change', setup);
    return () => {
      teardown();
      desktop.removeEventListener('change', setup);
      reduce.removeEventListener('change', setup);
    };
  }, []);

  return { sectionRef, rootRef, scenic };
}

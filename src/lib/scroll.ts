// prefers-reduced-motion'a saygılı yumuşak kaydırma — JS'te açık 'smooth'
// değeri CSS'teki scroll-behavior override'ını deldiği için burada kontrol edilir.
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

import { useEffect, useState } from 'react';

// Анимированный счёт от 0 до target — тот же easing (кубический ease-out),
// что и в исходном макете, чтобы цифры на первом экране не выглядели резче
// остальных анимаций на странице. trigger по умолчанию true (Hero считает
// сразу при монтировании); передав false/true извне (JarStats) — счёт
// стартует, когда блок попадает в область видимости. Без ref-гварда
// «уже стартовало»: useInView отдаёт trigger=true ровно один раз и больше
// не меняет его, так что эффект и так перезапускается не более одного раза
// по-настоящему — а ref-гвард, переживающий двойной вызов эффектов в
// StrictMode (dev), гасил самый первый реальный запуск для Hero, где
// trigger истинен уже на монтировании.
export function useCountUp(target, durationMs = 1200, trigger = true) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return undefined;
    let raf;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, trigger]);

  return value;
}

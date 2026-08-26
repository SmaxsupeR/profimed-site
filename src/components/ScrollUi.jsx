import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';

// Полоска прогресса скролла сверху страницы + кнопка «наверх» (появляется
// после 600px прокрутки) — одна общая подписка на scroll вместо двух.
export function ScrollUi() {
  const { t } = useLang();
  const [pct, setPct] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollY(window.scrollY);
      setPct(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const visible = scrollY > 600;

  return (
    <>
      <div className="fixed top-0 left-0 h-[3px] z-[70] bg-primary-600 transition-[width] duration-75 ease-linear" style={{ width: `${pct}%` }} />
      <a
        href="/#top"
        aria-label={t.hdr.toTop}
        className="pm-totop flex items-center justify-center w-11 h-11 rounded-full border border-slate-200 bg-white text-primary-600 shadow-card transition-opacity dark:bg-slate-800 dark:border-slate-700 dark:text-primary-400"
        style={{ left: 20, opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
      >
        <ChevronUp size={18} />
      </a>
    </>
  );
}

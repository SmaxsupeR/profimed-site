import { Fragment, useEffect, useState } from 'react';
import { Menu, X, Sun, Moon, ChevronDown, Check, Phone } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';
import { DICT } from '../i18n/dict.js';
import { Button } from './ui/Button.jsx';
import logoMark from '../assets/profimed-logo-mark.svg';

const LANG_ORDER = ['ru', 'uz', 'uzc', 'en'];
const NAV_HREFS = ['#directions', '#doctors', '#prices', '#reviews', '#contact'];

// «Сейчас открыто/закрыто» — часовой пояс Ташкента (UTC+5) захардкожен: сайт
// только для одной клиники в одном городе, тащить библиотеку часовых поясов
// ради этого не стоит. Пн–Пт 09:00–19:00, Сб — короткий день, 09:00–18:00.
function isOpenNow(now) {
  const utcMin = now.getUTCHours() * 60 + now.getUTCMinutes();
  const tashMin = (utcMin + 300) % 1440;
  const day = (now.getUTCDay() + (utcMin + 300 >= 1440 ? 1 : 0)) % 7;
  if (day === 0) return false; // воскресенье
  const closeMin = day === 6 ? 1080 : 1140; // суббота до 18:00, будни до 19:00
  return tashMin >= 540 && tashMin < closeMin;
}

export function Header() {
  const { lang, setLang, t } = useLang();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  // Шапка ужимается, когда страницу пролистали: верхняя синяя полоса с
  // адресом уезжает (её содержимое нужно один раз, в начале), а сама шапка
  // становится ниже и приподнимается тенью — так контента на экране больше,
  // а навигация остаётся под рукой.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  // Разные пороги на вход/выход (а не один и тот же scrollY > 40) —
  // намеренно, с запасом больше, чем перепад высоты шапки при сжатии
  // (108px → 60px, то есть 48px). Один порог давал бесконечное дрожание:
  // сжатие спейсера сдвигает контент вверх, scroll anchoring в браузере
  // компенсирует это уменьшением scrollY примерно на те же 48px, значение
  // ныряет обратно под порог, шапка разжимается — и так по кругу на любой
  // высоте скролла рядом с порогом. Зазор между порогами шире перепада —
  // качели физически не могут провалиться обратно за противоположный порог.
  useEffect(() => {
    const onScroll = () => {
      setScrolled((prev) => (prev ? window.scrollY > 24 : window.scrollY > 96));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const topBarHeight = scrolled ? 0 : 36;
  const headerHeight = scrolled ? 60 : 72;

  const open = isOpenNow(now);

  return (
    <Fragment>
    <div className="fixed inset-x-0 top-0 z-40">
      {/* Верхняя полоса — нейтральный графит, не тил: это адресная строка,
          а не действие, и не должна спорить с primary-кнопками ниже. */}
      <div
        className="hidden lg:block bg-slate-900 overflow-hidden transition-[height] duration-300 ease-out"
        style={{ height: topBarHeight }}
      >
        <div className="pm-container px-4 sm:px-6 h-9 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <span className="text-white/90 text-xs">{t.top.address}</span>
            <span className="text-white/35">·</span>
            <span className="text-white/90 text-xs">{t.top.hours}</span>
            <span className="text-white/35">·</span>
            <a href="mailto:info@profimed.uz" className="text-white/90 text-xs hover:underline">info@profimed.uz</a>
          </div>
          <div className="flex items-center gap-3.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90">
              <span className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green' : 'bg-amber-300'}`} />
              {open ? t.status.open : t.status.closed}
            </span>
            <a href="tel:+998951956119" className="text-white/90 text-xs font-semibold hover:underline">+998 95 195 61 19</a>
          </div>
        </div>
      </div>

      <header
        className={`border-b transition-[background-color,backdrop-filter] duration-300 ${
          scrolled
            ? 'backdrop-blur-md bg-white/85 border-slate-200 dark:bg-slate-950/85 dark:border-slate-800'
            : 'bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800'
        }`}
      >
        <div
          className="pm-container px-4 sm:px-6 flex items-center justify-between gap-4 transition-[height] duration-300 ease-out"
          style={{ height: headerHeight }}
        >
          <a href="#top" className="flex items-center shrink-0">
            <img src={logoMark} alt="ProfiMed" className="h-10 w-auto" style={{ filter: 'url(#pm-logo-tint)' }} />
          </a>

          <nav className="hidden lg:flex items-center gap-6">
            {NAV_HREFS.map((href, i) => (
              <a key={href} href={href} className="text-sm font-medium text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-400">
                {t.nav[i]}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3.5">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={langMenuOpen}
                className="flex items-center gap-1.5 h-[38px] px-3.5 rounded-full border border-slate-300 text-sm font-semibold text-slate-600 hover:border-primary-400 hover:text-primary-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-400"
              >
                {DICT[lang].label}
                <ChevronDown size={12} />
              </button>
              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
                  <div className="pm-menu-anim absolute right-0 top-[46px] z-50 min-w-[172px] grid gap-0.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-card dark:border-slate-700 dark:bg-slate-800">
                    {LANG_ORDER.map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => { setLang(code); setLangMenuOpen(false); }}
                        aria-current={code === lang}
                        className="flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        <span>{DICT[code].full}</span>
                        {code === lang && <Check size={15} className="text-primary-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t.hdr.theme}
              title={t.hdr.theme}
              className="flex items-center justify-center w-[38px] h-[38px] rounded-full border border-slate-300 text-slate-600 hover:border-primary-400 hover:text-primary-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-400"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <a href="tel:+998951956119" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-400">
              <Phone size={15} />
              +998 95 195 61 19
            </a>

            <Button href="#booking" size="sm">{t.hdr.cta}</Button>
          </div>

          <button
            type="button"
            className="lg:hidden -mr-2 p-2 text-slate-700 dark:text-slate-200"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={t.hdr.menu}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden pm-menu-anim border-t border-slate-200 bg-white px-4 pt-3.5 pb-[18px] grid gap-0.5 dark:border-slate-800 dark:bg-slate-950">
            {NAV_HREFS.map((href, i) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="pm-menu-item-anim py-2.5 text-[15px] font-medium text-slate-600 dark:text-slate-300"
              >
                {t.nav[i]}
              </a>
            ))}
            <div className="flex items-center justify-between gap-3 mt-2.5 pt-3.5 border-t border-slate-200 dark:border-slate-800">
              <div className="flex gap-1">
                {LANG_ORDER.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    aria-current={code === lang}
                    aria-label={DICT[code].full}
                    className={`rounded-full border px-2.5 py-1.5 text-xs font-semibold ${
                      code === lang
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {DICT[code].label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={t.hdr.theme}
                className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                {t.hdr.themeShort}
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
    {/* Шапка зафиксирована (position: fixed) — эта пара распорок в обычном
        потоке отдаёт контенту страницы место под неё. Высоты те же, что у
        самой шапки, и меняются вместе с ней, иначе при сжатии контент
        дёрнулся бы вверх скачком. */}
    <div className="hidden lg:block transition-[height] duration-300 ease-out" style={{ height: topBarHeight }} />
    <div className="transition-[height] duration-300 ease-out" style={{ height: headerHeight }} />
    </Fragment>
  );
}

export { isOpenNow };

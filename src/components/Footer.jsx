import { Sun, Moon } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';
import { DICT } from '../i18n/dict.js';
import { LEGAL, isFilled } from '../data/legal.js';
import logoMark from '../assets/profimed-logo-mark.svg';

const LANG_ORDER = ['ru', 'uz', 'uzc', 'en'];

// Навигация и контакты клиники уже есть в PreFooter прямо над этим блоком —
// здесь их не дублируем. Единственное, чего действительно не хватает внизу
// страницы — переключатели языка/темы: они живут только в закреплённой
// шапке, а до неё после долгого скролла возвращаться неудобно. Тот же
// компактный вид пилюль, что и в мобильном меню Header.jsx.
export function Footer() {
  const { lang, setLang, t } = useLang();
  const { isDark, toggleTheme } = useTheme();
  // Строка юридических сведений: наименование юрлица и номер лицензии.
  // Для медицинской клиники это не украшение подвала — по ним пациент
  // проверяет, что перед ним зарегистрированная организация, а не вывеска.
  const legalBits = [
    isFilled(LEGAL.entityNameShort) && LEGAL.entityNameShort,
    isFilled(LEGAL.licenseNumber) && `${t.licenseShort} № ${LEGAL.licenseNumber}`,
  ].filter(Boolean);

  return (
    <footer className="border-t border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800">
      <div className="pm-container px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          <span
            role="img"
            aria-label="ProfiMed"
            className="pm-logo-mask h-8"
            style={{ WebkitMaskImage: `url(${logoMark})`, maskImage: `url(${logoMark})` }}
          />
          <div className="text-sm text-slate-400 dark:text-slate-500">
            <p>© {new Date().getFullYear()} {t.foot}</p>
            {legalBits.length > 0 && <p className="mt-1">{legalBits.join(' · ')}</p>}
            <p className="mt-1">
              <a href="/privacy/" className="underline hover:text-slate-600 dark:hover:text-slate-300">
                {t.privacyLink}
              </a>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
            className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>
    </footer>
  );
}

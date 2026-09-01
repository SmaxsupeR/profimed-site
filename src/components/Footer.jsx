import { Sun, Moon } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';
import { DICT } from '../i18n/dict.js';
import { LEGAL, isFilled } from '../data/legal.js';
import logoMark from '../assets/profimed-logo-mark.svg';

// Компактная строка касания для tel: в подвале — тот же приём, что и в
// ContactInfo.jsx (h-11 = 44px реальной зоны клика, -my компенсирует
// разницу с естественной высотой строки, соседние строки визуально не
// раздвигаются).
const TOUCH_LINK_XS = 'inline-flex h-11 items-center -my-3.5';

const LANG_ORDER = ['ru', 'uz', 'uzc', 'en'];

// Контакты клиники уже есть в ContactInfo.jsx прямо над этим блоком (этап
// 3.17 — раньше между ними стоял ещё и PreFooter с той же самой сеткой
// «адрес/телефон/почта», сейчас убран из потока как чистое дублирование,
// см. комментарий в App.jsx) — здесь их не повторяем. Единственное, чего
// действительно не хватает внизу страницы — переключатели языка/темы: они
// живут только в закреплённой шапке, а до неё после долгого скролла
// возвращаться неудобно. Тот же компактный вид пилюль, что и в мобильном
// меню Header.jsx.
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
  // «Жалобы и предложения» — переехало сюда из ContactInfo.jsx (правка
  // после ревью): в контактах клиники эта строка конкурировала за
  // внимание с адресом/телефонами, хотя по смыслу это скорее сервисная/
  // юридическая информация (отдельный человек и отдельный телефон именно
  // для жалоб, не общий номер регистратуры) — её обычное место в подвале
  // сайта, между юридической строкой и ссылкой на политику
  // конфиденциальности. ФИО ответственного — по языкам (см. комментарий у
  // самого поля в data/legal.js): на узбекской латинской и английской
  // версиях страницы оно не должно оставаться кириллицей.
  const complaintsOfficerName = LEGAL.complaintsOfficer[lang] ?? LEGAL.complaintsOfficer.ru;
  const complaintsTel = `tel:${LEGAL.complaintsPhone.replace(/[^+\d]/g, '')}`;

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
          <div className="text-sm text-slate-400 dark:text-slate-400">
            <p>© {new Date().getFullYear()} {t.foot}</p>
            {legalBits.length > 0 && <p className="mt-1">{legalBits.join(' · ')}</p>}
            {isFilled(complaintsOfficerName) && (
              <p className="mt-1 [overflow-wrap:anywhere]">
                {t.con.complaintsTitle} · {t.con.complaintsOfficer}: {complaintsOfficerName} ·{' '}
                <a href={complaintsTel} className={`${TOUCH_LINK_XS} underline hover:text-slate-600 dark:hover:text-slate-300`}>
                  {LEGAL.complaintsPhone}
                </a>
              </p>
            )}
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
                // Видимый текст на кнопке — DICT[code].label («RU»); имя
                // должно содержать его дословно (WCAG 2.5.3 Label in Name,
                // тот же баг, что нашёл Lighthouse у языковой кнопки в
                // Header.jsx — см. комментарий там).
                aria-label={`${DICT[code].label} — ${DICT[code].full}`}
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

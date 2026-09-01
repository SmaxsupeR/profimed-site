import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';

// Увеличенная зона нажатия для tel:/mailto: без увеличения видимого текста.
// h-11 = 44px реальной зоны клика; -my — отрицательный вертикальный отступ,
// компенсирующий разницу между 44px и естественной высотой строки текста,
// так что соседние строки визуально не раздвигаются.
const TOUCH_LINK = 'inline-flex h-11 items-center -my-3';

function ContactLabel({ children }) {
  return (
    <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-300">{children}</p>
  );
}

// Третий заход после ревью. Первая версия делала карточку из 4 равных
// колонок («таблично»). Вторая — адрес и телефоны «главными» (иконка
// адреса в 44px-круге), часы/почту — тихой парой снизу — круг делал
// адрес «в три раза важнее всего остального». Теперь все четыре иконки
// одного размера (18px) и одного приглушённого цвета, без бейджей и
// кружков — иерархию читает типографика (подпись мельче/тише, значение
// крупнее/темнее), не отдельный акцент у одного пункта.
//
// Порядок и группировка — по смыслу, не по важности: «когда доехать»
// (адрес + режим работы) и «как связаться» (телефоны + почта) — два
// равных блока, разделены одной чертой.
//
// Была также опробована desktop-версия 2×2 (адрес/часы в одном ряду,
// телефоны/почта в другом, colgrid-cols-2) — инструментально не подошла:
// у внутренних полуколонок при заданной ширине левой колонки всей секции
// (minmax(360px,...), см. ContactSection.jsx) получается ~120–148px на
// полуколонку, а «+998 XX XXX XX XX» тем же шрифтом требует
// ~150–180px — номера переносились посреди цифр («+998 95 195» / «61
// 19») даже на 1280px (проверено измерением реальной ширины рендера, не
// на глаз). Одна колонка на всех ширинах — гарантированно без переноса.
// Если понадобится настоящая 2×2-сетка, её нужно делать вместе с
// расширением всей левой колонки секции, не только внутри этого
// компонента.
//
// «Жалобы и предложения» здесь по-прежнему нет — переехало в Footer.jsx
// (между юридической строкой и ссылкой на политику конфиденциальности).
export function ContactInfo() {
  const { t } = useLang();
  // Тот же приём, что уже применяется для этой же строки в мобильном меню
  // Header.jsx (hoursLines): часы работы хранятся одной строкой через
  // запятую («Пн–Пт …, Сб …»), но читаются увереннее двумя короткими
  // строками, а не одной длинной через запятую.
  const hoursLines = t.con.hours.split(', ');

  return (
    <div className="flex flex-col gap-7 p-8 lg:p-10">
      {/* Адрес. */}
      <div className="flex items-start gap-3">
        <MapPin size={18} className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
        <div className="min-w-0">
          <ContactLabel>{t.con.addrLabel}</ContactLabel>
          <p className="text-[15px] font-semibold leading-snug text-slate-900 [overflow-wrap:anywhere] dark:text-slate-50">
            {t.con.addr}
          </p>
        </div>
      </div>

      {/* Режим работы — та же смысловая группа «когда доехать», что и
          адрес выше, без своей черты над ней. */}
      <div className="flex items-start gap-3">
        <Clock size={18} className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
        <div className="min-w-0">
          <ContactLabel>{t.con.hoursLabel}</ContactLabel>
          {hoursLines.map((line, i) => (
            <p key={i} className="text-[15px] font-medium text-slate-700 [overflow-wrap:anywhere] dark:text-slate-200">{line}</p>
          ))}
        </div>
      </div>

      {/* Телефоны — начало смысловой группы «как связаться», граница
          между двумя группами отмечена одной чертой. */}
      <div className="flex items-start gap-3 border-t border-slate-100 pt-7 dark:border-slate-700/60">
        <Phone size={18} className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
        <div className="min-w-0">
          <ContactLabel>{t.con.phonesLabel}</ContactLabel>
          <div className="flex flex-col">
            <a href="tel:+998951956119" className={`${TOUCH_LINK} text-[15px] font-semibold tabular-nums text-slate-900 hover:text-primary-700 dark:text-slate-50 dark:hover:text-primary-300`}>+998 95 195 61 19</a>
            <a href="tel:+998712156119" className={`${TOUCH_LINK} text-[15px] font-semibold tabular-nums text-slate-900 hover:text-primary-700 dark:text-slate-50 dark:hover:text-primary-300`}>+998 71 215 61 19</a>
            <a href="tel:+998990776119" className={`${TOUCH_LINK} text-[15px] font-semibold tabular-nums text-slate-900 hover:text-primary-700 dark:text-slate-50 dark:hover:text-primary-300`}>+998 99 077 61 19</a>
          </div>
        </div>
      </div>

      {/* Почта. */}
      <div className="flex items-start gap-3">
        <Mail size={18} className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
        <div className="min-w-0">
          <ContactLabel>{t.con.emailLabel}</ContactLabel>
          <a href="mailto:info@profimed.uz" className={`${TOUCH_LINK} text-[15px] font-semibold text-slate-900 [overflow-wrap:anywhere] hover:text-primary-700 dark:text-slate-50 dark:hover:text-primary-300`}>info@profimed.uz</a>
        </div>
      </div>
    </div>
  );
}

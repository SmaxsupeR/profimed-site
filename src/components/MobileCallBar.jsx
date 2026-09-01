import { MessageCircle } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { Button } from './ui/Button.jsx';

// Липкая панель снизу — только на мобильном (lg:hidden), где шапка с кнопкой
// «Записаться» уже не на виду.
//
// hidden — единая формула из App.jsx (mobileCallBarHidden, этап полировки
// 2.1/2.5): активна панель выбранных услуг Prices.jsx (та же логика «не
// больше одного конкурирующего нижнего action-layer», что и раньше), видны
// CTA Hero, открыта форма записи, видна нижняя часть контактов+карты, или
// открыто мобильное меню — под любым из этих условий эта панель уступает
// место. Спейсер под панель (h-[76px] ниже) остаётся ЗАНЯТ независимо от
// hidden — панель прайса того же порядка высоты и встаёт в тот же зазор,
// лишний прыжок контента при переключении между ними так не возникает.
//
// onOpenChat (этап полировки 2) — третья кнопка ниже: ниже 1024px у
// ChatWidget.jsx нет собственного видимого FAB (см. комментарий там), эта
// иконка — единственная точка входа в чат на этих ширинах, открывает ту
// же лифтованную в App.jsx панель (chatOpen), что и desktop-FAB.
export function MobileCallBar({ hidden = false, onOpenChat }) {
  const { t } = useLang();
  return (
    <>
      <div className="lg:hidden h-[76px]" />
      {/* z-30. Раньше здесь стоял класс со значением 45, которого в шкале
          Tailwind (0/10/20/30/40/50) нет, а в конфиге она не расширена —
          класс молча не компилировался, и панель жила с z-auto. Поднимать
          её до значения между 40 и 50 нельзя: шапка вместе с открытым
          мобильным меню сидит на z-40 (Header.jsx), и панель всплыла бы
          поверх меню, а меню должно перекрывать её целиком — у него внизу
          своя липкая кнопка записи. Поэтому 30: выше обычного контента
          страницы, ниже шапки и меню. Плавающие кнопки (z-index: 55 в
          index.css) и так выше и разведены с панелью по вертикали
          (bottom: 92px против высоты панели 76px).

          Значение писать словами, а не классом-примером: сканер Tailwind
          разбирает исходники регуляркой и подхватывает такие токены прямо
          из комментариев, добавляя в бандл неиспользуемое правило. */}
      <div
        className={`${hidden ? 'hidden' : 'flex'} lg:hidden fixed inset-x-0 bottom-0 z-30 items-center gap-2 px-4 py-3 bg-white border-t border-slate-200 dark:bg-slate-950 dark:border-slate-800`}
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        {/* min-w-0 — раньше на двух кнопках flex-1 работал без него
            (текст не мог стать длиннее контейнера); с третьей, фиксированной
            иконкой рядом бюджет ширины у этих двух сократился, min-w-0
            позволяет им честно ужаться до min-content вместо продавливания
            строки за пределы бара. Первое, что трогать при нехватке места
            на 320px (проверить отдельно, все 4 языка) — горизонтальный
            padding именно этих кнопок через className (`!px-4`), не текст:
            t.hdr.callShort/ctaShort уже укороченные варианты под этот бар. */}
        <Button href="tel:+998951956119" variant="secondary" className="flex-1 min-w-0">{t.hdr.callShort}</Button>
        <Button href="/#booking" className="flex-1 min-w-0">{t.hdr.ctaShort}</Button>
        {/* Иконка чата — фиксированная 44×44, без текстовой подписи (только
            aria-label): в отличие от двух соседних действий, у неё нет
            переменной по языку длины, поэтому она не участвует в сжатии. */}
        <button
          type="button"
          onClick={onOpenChat}
          aria-label={t.chat.fabLabel}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
        >
          <MessageCircle size={18} />
        </button>
      </div>
    </>
  );
}

import { useLang } from '../i18n/LangContext.jsx';
import { Button } from './ui/Button.jsx';

// Липкая панель снизу — только на мобильном (lg:hidden), где шапка с кнопкой
// «Записаться» уже не на виду.
export function MobileCallBar() {
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
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 flex gap-2.5 px-4 py-3 bg-white border-t border-slate-200 dark:bg-slate-950 dark:border-slate-800">
        <Button href="tel:+998951956119" variant="secondary" className="flex-1">{t.hdr.callShort}</Button>
        <Button href="/#booking" className="flex-1">{t.hdr.ctaShort}</Button>
      </div>
    </>
  );
}

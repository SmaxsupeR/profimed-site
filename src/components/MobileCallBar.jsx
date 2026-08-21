import { useLang } from '../i18n/LangContext.jsx';
import { Button } from './ui/Button.jsx';

// Липкая панель снизу — только на мобильном (lg:hidden), где шапка с кнопкой
// «Записаться» уже не на виду.
export function MobileCallBar() {
  const { t } = useLang();
  return (
    <>
      <div className="lg:hidden h-[76px]" />
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-45 flex gap-2.5 px-4 py-3 bg-white border-t border-slate-200 dark:bg-slate-950 dark:border-slate-800">
        <Button href="tel:+998951956119" variant="secondary" className="flex-1">{t.hdr.callShort}</Button>
        <Button href="#booking" className="flex-1">{t.hdr.ctaShort}</Button>
      </div>
    </>
  );
}

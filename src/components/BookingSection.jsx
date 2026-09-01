import { useEffect } from 'react';
import { BookingForm } from './BookingForm.jsx';
import { Section } from './ui/Section.jsx';
import { useLang } from '../i18n/LangContext.jsx';

// Этап 3.17 — реорганизация нижней части страницы. Форма записи раньше
// была правой половиной двухколоночной сетки Contact.jsx (контакты слева,
// форма справа, карта колонкой под контактами) — из-за карты левая
// колонка была заметно выше правой, а после формы оставалось большое
// пустое поле. Бриф прямо требует развести три разных пользовательских
// задачи (записаться / найти контакты / доехать) по трём
// последовательным самостоятельным секциям на всех ширинах — это первая
// из трёх, сразу после FAQ и CtaBand («если не знаете, к кому идти»),
// затем ContactInfo.jsx, затем MapSection.jsx.
//
// max-w-[820px] mx-auto — единственное, что здесь на самом деле новое:
// спокойный центрированный контейнер (720–900px по брифу) вместо
// растянутой на всю ширину grid-колонки. Сама BookingForm.jsx не
// менялась ни в разметке, ни в логике корзины/согласия/отправки — только
// то, во что она вложена. Заголовок и пояснение секции — тот же самый
// <h2>/<p>, что BookingForm рисует сама в начале (t.form.bookingTitle*/
// bookingSubtitle*) — отдельного заголовка поверх не добавлено, чтобы не
// дублировать один и тот же смысл дважды.
//
// onBookingInView — то же наблюдение, что раньше делал Contact.jsx (см.
// историю компонента): пока форма записи в кадре, Prices.jsx прячет свою
// закреплённую панель «Ваш визит» (App.jsx передаёт это дальше через
// cartBarSuppressed) — иначе панель легла бы поверх кнопки «Отправить».
// id="booking" — тот же якорь, на который ведут все ссылки «Перейти к
// записи»/«К записи» по сайту (Header, Prices, CtaBand, панель прайса) —
// переехал вместе с формой, сами ссылки трогать не пришлось.
export function BookingSection({
  presetDirection,
  selectedIds = [],
  onRemoveService = () => {},
  onSubmitted = () => {},
  onBookingInView = () => {},
}) {
  const { t } = useLang();

  useEffect(() => {
    const el = document.getElementById('booking');
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => onBookingInView(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Section id="booking" tone="raised" className="lg:py-24">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(560px,1.28fr)] lg:gap-14">
        <div className="max-w-[430px] lg:pt-8">
          <p className="mb-3 text-sm font-medium tracking-[0.08em] text-primary-700 dark:text-primary-300">
            {t.band.kicker}
          </p>
          <h2 className="font-display text-[32px] leading-[1.08] text-slate-900 text-balance sm:text-[40px] lg:text-[44px] dark:text-slate-50">
            {t.band.title}
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-slate-600 dark:text-slate-300">
            {t.band.text}
          </p>
          <div className="mt-7 border-t border-slate-200 pt-5 dark:border-slate-700">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
              {t.con.phonesLabel}
            </p>
            <a
              href="tel:+998951956119"
              className="mt-2 inline-flex text-[17px] font-semibold text-primary-700 transition-colors hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-200"
            >
              +998 95 195 61 19
            </a>
          </div>
        </div>

        <div className="min-w-0">
          <BookingForm
            presetDirection={presetDirection}
            selectedIds={selectedIds}
            onRemoveService={onRemoveService}
            onSubmitted={onSubmitted}
          />
        </div>
      </div>
    </Section>
  );
}

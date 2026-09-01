import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/useReveal.js';

// Этап 3.9 — компактная перестройка после Stage 3.6. Прежняя композиция
// (узкий intro слева + 4 шага, поставленных друг под другом справа)
// корректно решала задачу «не таймлайн-виджет», но у нас получалась секция
// заметно выше одного экрана ноутбука (1280×720/1366×768/1440×900 при 100%
// зуме) — четыре текстовых блока, поставленных ВЕРТИКАЛЬНО, неизбежно дают
// большую суммарную высоту, сколько отступы ни ужимай. Проблема
// структурная, не про паддинги: шаги теперь стоят в один ряд
// (lg:grid-cols-4), а не друг под другом — это единственное, что реально
// уменьшает высоту секции, а не просто визуально ужимает её.
//
// Шапка тоже была прежде отдельной левой колонкой на треть ширины секции
// (lg:grid-cols-[1fr_1.5fr]) — сама по себе безобидная ширина, но задавала
// высокую «стартовую» полосу перед сеткой шагов. Теперь eyebrow+заголовок
// и intro стоят в один компактный ряд (lg:grid-cols-[auto_1fr] — auto
// считает по контенту, не берёт условную долю ширины секции просто так),
// высота шапки — это высота её самого высокого столбца, не сумма.
//
// Секция остаётся СВЕТЛОЙ — не переносить сюда приём JarStats с
// фиксированным графитовым фоном (см. комментарий про ритм страницы в
// истории этого файла). Section/SectionHeader по-прежнему не используются —
// нужен свой компактный header-ряд, а не центрированный h2 из
// SectionHeader, и фон — bg-slate-50 (тёплый айвори), не белый TONES.raised,
// поэтому фон живёт на отдельном внешнем div, как и раньше.
export function Timeline() {
  const { t } = useLang();
  const { ref: sectionRef, className: revealClass } = useReveal();
  const steps = [1, 2, 3, 4].map((n) => ({ n, t: t.timeline[`s${n}t`], d: t.timeline[`s${n}d`] }));

  return (
    // border-b, не border-y — см. комментарий у прежней версии: Directions
    // сверху уже даёт свою нижнюю границу, а перед всегда-тёмным Laser
    // нужна явная черта, чтобы графит секций не сливался в один блок.
    <div className="bg-slate-50 border-b border-slate-200 dark:bg-slate-950 dark:border-slate-800">
      <section
        id="timeline"
        ref={sectionRef}
        className={`${revealClass} pm-container px-4 sm:px-6 py-12 sm:py-14 lg:py-16`}
      >
        {/* Общий SplitSectionHeader (этап полировки 1.1/3.2) — та же
            вёрстка/масштаб заголовка, что теперь у Doctors/About, вместо
            собственного lg:grid-cols-[auto_1fr]. mb-16(64px), не
            mb-8/lg:mb-10(32/40px) — «шапка → этапы» из требуемых брифом
            56–80px. title теперь просто строка (не массив построчных span)
            — заголовок короткий и сам естественно ложится в 1–2 строки на
            любом языке без принудительных разрывов. */}
        <header className="mb-10 max-w-[760px] sm:mb-12">
          <p className="mb-3 text-sm font-medium tracking-[0.08em] text-slate-600 dark:text-slate-400">
            {t.timeline.eyebrow}
          </p>
          <h2 className="font-display text-[32px] leading-[1.06] text-slate-900 text-balance sm:text-[42px] lg:text-[50px] dark:text-slate-50">
            {t.timeline.title}
          </h2>
          <p className="mt-4 max-w-[680px] text-[16px] leading-relaxed text-slate-600 dark:text-slate-300">
            {t.timeline.intro}
          </p>
        </header>

        {/* Четыре шага в один ряд на десктопе — не друг под другом. Никаких
            кружков/линии-коннектора: у каждого шага своя короткая
            декоративная риска под номером (w-8, не через всю колонку и
            точно не через всю секцию), просто акцент, не соединение между
            шагами. Разделитель между шагами (divide-y) — только на
            мобильном, где сетка складывается в один столбец; на md/lg он
            снят (divide-y-0), там колонки и так разделены gap'ом. */}
        <div className="reveal-stagger grid gap-8 divide-y divide-slate-200/70 dark:divide-slate-700/60 sm:gap-9 md:grid-cols-2 md:gap-x-8 md:gap-y-9 md:divide-y-0 lg:grid-cols-4 lg:gap-10">
          {steps.map((step) => (
            <div key={step.n}>
              <p className="font-display text-primary-500 text-[34px] lg:text-[38px] leading-none mb-2 dark:text-primary-300">
                {String(step.n).padStart(2, '0')}
              </p>
              <div className="h-px w-8 bg-primary-200 mb-3 dark:bg-primary-800" />
              <h3 className="text-[17px] lg:text-[18px] font-semibold text-slate-900 mb-1.5 dark:text-slate-50">{step.t}</h3>
              <p className="text-[14px] lg:text-[15px] leading-snug text-slate-600 dark:text-slate-300">{step.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

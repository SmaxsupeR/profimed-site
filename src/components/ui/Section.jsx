import { useReveal } from '../../hooks/useReveal.js';

// Секция страницы и её заголовок. Держат единый вертикальный ритм и одну
// ширину контента — если это оставить на усмотрение каждой секции, отступы
// начинают гулять на 4–8 пикселей, и страница выглядит собранной наспех.
//
// tone — фоновая полоса во всю ширину экрана под секцией. Страница длинная
// (около 9000px), и без чередования полос середина превращается в один
// сплошной серый фон на три тысячи пикселей подряд. Полоса рисуется внешним
// div-ом, потому что сама секция ограничена по ширине (max-w-6xl), а фон
// должен доходить до краёв экрана.
//
// Появление при скролле встроено сюда, а не подключается в каждой секции
// вручную: так его невозможно забыть добавить в новом блоке.

const TONES = {
  base: '',
  raised: 'bg-white border-y border-slate-200 dark:bg-slate-950 dark:border-slate-800',
};

export function Section({ id, className = '', tone = 'base', children }) {
  const { ref, className: revealClass } = useReveal();

  const inner = (
    <section
      id={id}
      ref={ref}
      className={`${revealClass} pm-container px-4 sm:px-6 py-16 sm:py-20 ${className}`}
    >
      {children}
    </section>
  );

  if (tone === 'base') return inner;
  return <div className={TONES[tone]}>{inner}</div>;
}

export function SectionHeader({ eyebrow, title, description, className = '' }) {
  return (
    <div className={`max-w-xl mb-10 ${className}`}>
      {eyebrow && (
        <p className="text-sm font-medium text-slate-600 tracking-[0.08em] mb-3 dark:text-slate-400">{eyebrow}</p>
      )}
      <h2 className="font-display text-[32px] sm:text-[42px] lg:text-[50px] leading-[1.05] text-slate-900 text-balance dark:text-slate-50">{title}</h2>
      {description && <p className="text-slate-500 mt-3 dark:text-slate-400">{description}</p>}
    </div>
  );
}

// SplitSectionHeader — общий «заголовок слева / описание(+действия)
// справа» header для секций с редакторской композицией (Doctors, About,
// Timeline — до этого каждая собирала почти одинаковый grid вручную, с
// разным gap/масштабом заголовка). eyebrow+title — левая колонка (9fr),
// description(+actions) — правая (11fr), lg:gap-16 (64px, нижняя граница
// требуемых 64–96px) — теперь один и тот же набор значений у всех трёх, а
// не три независимо подобранных.
//
// actions — опционален (не у всех трёх секций есть стрелки/кнопки рядом с
// описанием). description и actions вместе в одном flex-wrap ряду: на
// широком десктопе — в одну строку (описание слева от actions), а если
// ширины правой колонки не хватает (граничные ~1024–1120px при длинном
// описании) — actions сами переносятся под текст отдельной строкой, не
// сжимая его до нечитаемой ширины (у description свой min-w и потолок
// lg:max-w-[580px], середина требуемых 520–620px).
export function SplitSectionHeader({ eyebrow, title, description, actions, className = '' }) {
  const hasSideContent = Boolean(description || actions);

  return (
    <div className={`${hasSideContent ? 'grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-end lg:gap-14' : 'max-w-[760px]'} ${className}`}>
      <div>
        {eyebrow && (
          <p className="mb-3 text-sm font-medium tracking-[0.08em] text-slate-600 dark:text-slate-400">{eyebrow}</p>
        )}
        <h2 className="font-display text-[32px] leading-[1.06] text-slate-900 text-balance sm:text-[42px] lg:text-[50px] dark:text-slate-50">
          {title}
        </h2>
      </div>
      {hasSideContent && (
        <div className="flex flex-wrap items-end justify-between gap-x-5 gap-y-4 lg:pb-1">
          {description && (
            <p className="min-w-[220px] flex-1 text-[16px] leading-relaxed text-slate-600 lg:max-w-[560px] dark:text-slate-300">{description}</p>
          )}
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
    </div>
  );
}

import { useReveal } from '../../hooks/useReveal.js';

// Секция страницы и её заголовок. Держат единый вертикальный ритм и одну
// ширину контента — если это оставить на усмотрение каждой секции, отступы
// начинают гулять на 4–8 пикселей, и страница выглядит собранной наспех.
//
// Надпись сверху (eyebrow) — оливковая, это единственное регулярное место,
// где второй фирменный цвет работает рядом с синим, а не спорит с ним.
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
      className={`${revealClass} max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 ${className}`}
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
        <p className="text-sm font-medium text-primary-600 tracking-[0.08em] mb-3 dark:text-primary-400">{eyebrow}</p>
      )}
      <h2 className="font-display text-[32px] sm:text-[42px] lg:text-[50px] leading-[1.05] text-slate-900 text-balance dark:text-slate-50">{title}</h2>
      {description && <p className="text-slate-500 mt-3 dark:text-slate-400">{description}</p>}
    </div>
  );
}

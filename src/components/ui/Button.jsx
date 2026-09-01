// Кнопка — единственный источник правды для всех действий на сайте.
// Раньше те же классы были продублированы в шапке, первом экране и форме
// заявки, и «сделать все кнопки чуть крупнее» означало правку в трёх местах.
//
// Рендерится как <a>, если передан href (в шапке и на первом экране кнопки —
// это якорные ссылки и tel:), иначе как <button>. Снаружи разницы нет.

const VARIANTS = {
  // Основное действие страницы — «Записаться». На экране должно быть одно.
  // border border-transparent (правка после ревью) — secondary ниже несёт
  // реальный 1px border, и при auto-высоте (нет явного height, только
  // padding) border добавляется К высоте, а не поглощается ею: primary без
  // этого класса рендерился на 2px ниже secondary при прочих одинаковых
  // padding/тексте — заметно, когда они стоят рядом (MapActions.jsx,
  // MobileCallBar.jsx). Прозрачная рамка той же ширины — тот же box-model,
  // визуально ничего не меняет (цвет не виден на заливке), но высота
  // теперь совпадает с secondary день в день.
  primary: 'border border-transparent bg-primary-600 hover:bg-primary-700 text-white shadow-card',
  // Рядом с основным: «Позвонить» — тёплая светлая поверхность с графитовым
  // контуром и текстом, тот же вес, что и у primary, но не спорит за
  // внимание (бриф, п.12 — без заливки, без лайма/зелёного).
  secondary:
    'border border-slate-300 hover:border-primary-400 text-slate-700 bg-white ' +
    'dark:border-slate-600 dark:hover:border-primary-500 dark:text-slate-200 dark:bg-slate-800',
  // Третьестепенное, внутри карточек и состояний («Отправить ещё одну заявку»).
  ghost: 'text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-950/40',
};

const SIZES = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-3.5 text-sm',
};

// Форма — раньше жила прямо в BASE (rounded-full, безальтернативно). Вынесена
// отдельным параметром ради мобильного Hero CTA (этап 3.7): там по брифу
// нужен не пилюльный, а сдержанный скруглённый прямоугольник (14–16px), а
// добавлять класс типа `rounded-2xl` поверх через className не сработало бы
// надёжно — rounded-full и rounded-2xl обе задают border-radius, и какая из
// двух победит, решает порядок в сгенерированном Tailwind CSS, а не порядок
// в строке className. shape по умолчанию 'pill' — все существующие вызовы
// Button (шапка, MobileCallBar, Footer и т.д.) его не передают и получают
// ровно тот же rounded-full, что и раньше.
const SHAPES = {
  pill: 'rounded-full',
  rounded: 'rounded-2xl',
};

const BASE =
  'inline-flex items-center justify-center gap-2 font-semibold transition-colors ' +
  'disabled:opacity-60 disabled:cursor-not-allowed ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2';

export function Button({
  variant = 'primary',
  size = 'md',
  shape = 'pill',
  href,
  className = '',
  children,
  ...rest
}) {
  const classes = `${BASE} ${SHAPES[shape]} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

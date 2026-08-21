// Кнопка — единственный источник правды для всех действий на сайте.
// Раньше те же классы были продублированы в шапке, первом экране и форме
// заявки, и «сделать все кнопки чуть крупнее» означало правку в трёх местах.
//
// Рендерится как <a>, если передан href (в шапке и на первом экране кнопки —
// это якорные ссылки и tel:), иначе как <button>. Снаружи разницы нет.

const VARIANTS = {
  // Основное действие страницы — «Записаться». На экране должно быть одно.
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-card',
  // Рядом с основным: «Позвонить» — тёплая светлая поверхность с графитовым
  // контуром и текстом, тот же вес, что и у primary, но не спорит за
  // внимание (бриф, п.12 — без заливки, без лайма/зелёного).
  secondary:
    'border border-slate-300 hover:border-primary-400 text-slate-700 bg-white ' +
    'dark:border-slate-600 dark:hover:border-primary-500 dark:text-slate-200 dark:bg-slate-800',
  // Третьестепенное, внутри карточек и состояний («Отправить ещё одну заявку»).
  ghost: 'text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950/40',
};

const SIZES = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-3.5 text-sm',
};

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors ' +
  'disabled:opacity-60 disabled:cursor-not-allowed ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2';

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  children,
  ...rest
}) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

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

// Карточка — общая «полка» для всего, что лежит на фоне страницы:
// направления, врачи, прайс, форма заявки.
//
// interactive — для карточек, по которым кликают (плитки направлений). У них
// появляется отклик на наведение, и рендерятся они как <button>, а не <div>:
// иначе с клавиатуры до них не добраться, а кликабельность живёт только в
// onClick, о котором скринридер не знает.
//
// dashed — честное пустое состояние (блок отзывов, пока их не собрали).
// Пунктир читается как «здесь пока пусто», а не как сломавшаяся карточка.
//
// href — та же логика, что у Button.jsx: задан — рендерится как <a>, для
// внешней ссылки целиком кликабельной карточкой (этап 3.19, рейтинги
// Яндекс/2ГИС в Reviews.jsx — «карточка целиком ведёт на площадку», не
// кнопка-огрызок внутри неё). Не отдельный variant, а модификатор поверх
// любого — variant задаёт визуальный стиль (solid/interactive/dashed), href
// только меняет тег.

const VARIANTS = {
  solid: 'bg-white border border-slate-200 shadow-card dark:bg-slate-800 dark:border-slate-700',
  interactive:
    'bg-white border border-slate-200 shadow-card text-left ' +
    'hover:shadow-card-hover hover:border-primary-300 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ' +
    'dark:bg-slate-800 dark:border-slate-700 dark:hover:border-primary-500',
  dashed: 'bg-white/60 border border-dashed border-slate-300 dark:bg-slate-800/40 dark:border-slate-600',
};

// hoverable — отклик на наведение для карточек, по которым не кликают
// (врачи, «о клинике»): без него половина плиток на странице никак не
// реагирует на мышь и страница ощущается картинкой, а не интерфейсом.
const HOVERABLE = 'hover:shadow-card-hover hover:border-primary-300 hover:-translate-y-0.5 dark:hover:border-primary-500';

export function Card({ variant = 'solid', hoverable = false, href, className = '', children, ...rest }) {
  const classes = `rounded-2xl transition-all ${VARIANTS[variant]} ${hoverable ? HOVERABLE : ''} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  if (variant === 'interactive') {
    return (
      <button type="button" className={classes} {...rest}>
        {children}
      </button>
    );
  }

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

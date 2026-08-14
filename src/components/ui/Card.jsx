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

const VARIANTS = {
  solid: 'bg-white border border-slate-200 shadow-card',
  interactive:
    'bg-white border border-slate-200 shadow-card text-left ' +
    'hover:shadow-card-hover hover:border-primary-300 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  dashed: 'bg-white/60 border border-dashed border-slate-300',
};

export function Card({ variant = 'solid', className = '', children, ...rest }) {
  const classes = `rounded-2xl transition-all ${VARIANTS[variant]} ${className}`;

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

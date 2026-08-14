// Секция страницы и её заголовок. Держат единый вертикальный ритм и одну
// ширину контента — если это оставить на усмотрение каждой секции, отступы
// начинают гулять на 4–8 пикселей, и страница выглядит собранной наспех.
//
// Надпись сверху (eyebrow) — оливковая, это единственное регулярное место,
// где второй фирменный цвет работает рядом с синим, а не спорит с ним.

export function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeader({ eyebrow, title, description, className = '' }) {
  return (
    <div className={`max-w-xl mb-10 ${className}`}>
      {eyebrow && (
        <p className="text-sm font-semibold text-leaf-700 uppercase tracking-wide mb-3">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl text-slate-900 text-balance">{title}</h2>
      {description && <p className="text-slate-500 mt-3">{description}</p>}
    </div>
  );
}

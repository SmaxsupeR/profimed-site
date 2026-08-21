// Красит монохромный логотип (чёрные пути в profimed-logo-mark.svg) в
// акцентный синий сайта — тот же приём, что в исходном холсте Claude Design:
// feFlood заливает весь прямоугольник цветом из CSS-переменной, а
// feComposite "in" оставляет эту заливку только там, где у логотипа есть
// альфа-канал (сама форма букв), то есть перекрашивает картинку без второго
// файла-ассета. Используется через style={{ filter: 'url(#pm-logo-tint)' }}
// на <img>, см. Header.jsx/Footer.jsx. Цвет — переменная --pm-logo-tint
// (index.css), у нее разные значения для светлой и тёмной темы.
export function LogoTintFilter() {
  return (
    <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
      <filter id="pm-logo-tint" x="-20%" y="-20%" width="140%" height="140%">
        <feFlood floodColor="var(--pm-logo-tint)" result="tintcolor" />
        <feComposite in="tintcolor" in2="SourceAlpha" operator="in" />
      </filter>
    </svg>
  );
}

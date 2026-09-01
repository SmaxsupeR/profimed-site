import { useEffect, useState } from 'react';

// Живое значение CSS media query в JS — тот же приём двух отдельных мест
// проекта (Header.jsx: min-width 1024px для десктопной высоты шапки;
// ThemeContext.jsx: prefers-color-scheme), теперь один общий хук вместо
// нескольких копий одного и того же эффекта. matchMedia + addEventListener
// ('change'), не window.resize: срабатывает только при пересечении
// конкретного порога (а не на каждый пиксель изменения окна) и одинаково
// работает для любых media-фич, не только ширины.
//
// Ленивая инициализация useState — значение уже верное на первом рендере
// (не «false, потом эффект поправит через кадр»), эффект дальше только
// подписывается на живые изменения. query в deps эффекта — если строка
// запроса когда-нибудь станет динамической (сейчас нигде не меняется),
// подписка переставится на новый MediaQueryList, а не останется висеть на
// старом.
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

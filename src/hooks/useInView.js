import { useEffect, useRef, useState } from 'react';

// Страховка от «пустой страницы». От появления при скролле зависит почти
// весь контент (13 секций), а прячет их CSS — до срабатывания наблюдателя
// они с opacity: 0. Если IntersectionObserver по любой причине не отдаст ни
// одного колбэка, страница осталась бы визуально пустой. Поэтому: первый же
// колбэк (неважно, видимый элемент или нет — наблюдатель всегда сообщает о
// начальном состоянии) помечает наблюдатель живым, а если за 4 секунды не
// пришло ни одного, на <html> вешается класс, который отключает пряталку
// целиком. Анимация в норме от этого не страдает.
let observerAlive = false;
let failsafeArmed = false;

function armFailsafe() {
  if (failsafeArmed) return;
  failsafeArmed = true;
  setTimeout(() => {
    if (!observerAlive) document.documentElement.classList.add('pm-no-io');
  }, 4000);
}

// Единожды становится true, когда элемент попадает в область видимости
// (или уже был виден при монтировании) — и больше не меняется. Общая основа
// для useReveal (анимация появления) и для триггера банки со стёклышками
// (JarStats.jsx), которым обоим нужно «сработать один раз при скролле».
export function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) { setInView(true); return; }
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    armFailsafe();
    const io = new IntersectionObserver(([entry]) => {
      observerAlive = true;
      if (entry.isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

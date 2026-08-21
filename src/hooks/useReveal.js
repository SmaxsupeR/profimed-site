import { useInView } from './useInView.js';

// Плавное появление секции при попадании в область видимости — обёртка над
// useInView под конкретный CSS-класс (.reveal/.is-in, см. index.css).
export function useReveal() {
  const { ref, inView } = useInView();
  return { ref, className: inView ? 'reveal is-in' : 'reveal' };
}

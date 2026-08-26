import { useEffect, useRef } from 'react';
import { useTheme } from '../theme/ThemeContext.jsx';
import { createGlassesSim, GEO, DEFAULT_SPAWN_INTERVAL_MS } from './glassesPhysics.js';

// Фирменные цвета сайта (primary-* из tailwind.config.js — клинический
// синий), не значения из референса — светлый и тёмный набор, чтобы контур
// банки и очков не терялся на тёмном фоне.
const PALETTE = {
  light: { jar: '#16427D', jarFaint: '#16427D33', glass: '#1E56A0' },
  dark: { jar: '#83A7C9', jarFaint: '#83A7C933', glass: '#ABC5DB' },
};

// Канвас с падающими в банку очками (Matter.js). Библиотека грузится
// динамическим import() только когда `trigger` становится true (см.
// useInView в JarStats) — если загрузка не удалась (например, обрыв сети),
// сообщаем об этом через onError и ничего не рисуем, вызывающий компонент
// сам решает, чем заменить канвас.
// forcePalette (этап 3.5) — опционально переопределяет светлую/тёмную пару
// цветов независимо от глобальной темы сайта. Нужен для JarStats: секция
// теперь всегда графитовая (не переключается вместе с темой сайта, см.
// комментарий в JarStats.jsx), поэтому банке/очкам там всегда нужна именно
// светлая на графите палитра — сверка с isDark сайта тут была бы неверной.
// Splash.jsx использует компонент без этого пропа — там фон и правда следует
// теме сайта, поведение для него не поменялось.
export function PhysicsJar({
  trigger,
  onError,
  size = 240,
  spawnIntervalMs = DEFAULT_SPAWN_INTERVAL_MS,
  forcePalette,
  ariaLabel,
}) {
  const canvasRef = useRef(null);
  const simRef = useRef(null);
  const colorsRef = useRef({ ...PALETTE.light });
  const { isDark } = useTheme();
  const useDarkPalette = forcePalette ? forcePalette === 'dark' : isDark;

  // Мутируем тот же объект, который читает draw() — переключение темы на
  // лету подхватывается без пересоздания симуляции.
  useEffect(() => {
    Object.assign(colorsRef.current, useDarkPalette ? PALETTE.dark : PALETTE.light);
  }, [useDarkPalette]);

  useEffect(() => {
    if (!trigger || !canvasRef.current) return undefined;
    let cancelled = false;
    // Внутренний буфер канваса — с запасом под devicePixelRatio (этап 3.5,
    // потолок 2x — 3x на такой простой отрисовке визуально не отличить, а
    // память под битмап лишняя). Раньше буфер всегда был ровно GEO.W×GEO.H,
    // и на обычном 1x экране при прежнем небольшом размере (240px) это было
    // незаметно; когда банку по брифу увеличили почти вдвое, тот же буфер на
    // retina-экранах (2–3x, у большей части мобильной аудитории) стал бы
    // растягиваться заметно сильнее и мылить контур. ctx.scale компенсирует
    // масштаб один раз здесь — ни draw()/drawJar()/drawGlasses() в
    // glassesPhysics.js, ни калибровка физики под GEO (см. комментарий там)
    // не тронуты и продолжают рисовать в тех же логических 400×460.
    const canvas = canvasRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = GEO.W * dpr;
    canvas.height = GEO.H * dpr;
    canvas.getContext('2d').scale(dpr, dpr);
    import('matter-js')
      .then((mod) => {
        if (cancelled || !canvasRef.current) return;
        const Matter = mod.default ?? mod;
        simRef.current = createGlassesSim(Matter, canvas, colorsRef.current, spawnIntervalMs);
        simRef.current.start();
      })
      .catch(() => { if (!cancelled) onError?.(); });
    return () => {
      cancelled = true;
      simRef.current?.stop();
      simRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, spawnIntervalMs]);

  return (
    <div
      className="mx-auto"
      style={{ width: size, aspectRatio: `${GEO.W} / ${GEO.H}` }}
      {...(ariaLabel ? { role: 'img', 'aria-label': ariaLabel } : {})}
    >
      <canvas ref={canvasRef} aria-hidden="true" style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}

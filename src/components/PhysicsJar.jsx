import { useEffect, useRef } from 'react';
import { useTheme } from '../theme/ThemeContext.jsx';
import { createGlassesSim, GEO, DEFAULT_SPAWN_INTERVAL_MS } from './glassesPhysics.js';

// Фирменные цвета сайта (primary-* из tailwind.config.js), не значения из
// референса — светлый и тёмный набор, чтобы контур банки и очков не терялся
// на тёмном фоне.
const PALETTE = {
  light: { jar: '#195D56', jarFaint: '#195D5633', glass: '#247A70' },
  dark: { jar: '#4CA69B', jarFaint: '#4CA69B33', glass: '#83C9BB' },
};

// Канвас с падающими в банку очками (Matter.js). Библиотека грузится
// динамическим import() только когда `trigger` становится true (см.
// useInView в JarStats) — если загрузка не удалась (например, обрыв сети),
// сообщаем об этом через onError и ничего не рисуем, вызывающий компонент
// сам решает, чем заменить канвас.
export function PhysicsJar({ trigger, onError, size = 240, spawnIntervalMs = DEFAULT_SPAWN_INTERVAL_MS }) {
  const canvasRef = useRef(null);
  const simRef = useRef(null);
  const colorsRef = useRef({ ...PALETTE.light });
  const { isDark } = useTheme();

  // Мутируем тот же объект, который читает draw() — переключение темы на
  // лету подхватывается без пересоздания симуляции.
  useEffect(() => {
    Object.assign(colorsRef.current, isDark ? PALETTE.dark : PALETTE.light);
  }, [isDark]);

  useEffect(() => {
    if (!trigger || !canvasRef.current) return undefined;
    let cancelled = false;
    import('matter-js')
      .then((mod) => {
        if (cancelled || !canvasRef.current) return;
        const Matter = mod.default ?? mod;
        simRef.current = createGlassesSim(Matter, canvasRef.current, colorsRef.current, spawnIntervalMs);
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
    <div className="mx-auto" style={{ width: size, aspectRatio: `${GEO.W} / ${GEO.H}` }}>
      <canvas
        ref={canvasRef}
        width={GEO.W}
        height={GEO.H}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}

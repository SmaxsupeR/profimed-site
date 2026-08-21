import { useEffect, useRef, useState } from 'react';
import { Eye, Ear, Smile, ScanLine, Stethoscope, Syringe } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useCountUp } from '../hooks/useCountUp.js';
import { PhysicsJar } from './PhysicsJar.jsx';
import { PATIENTS_TOTAL } from './glassesPhysics.js';
import logoMark from '../assets/profimed-logo-mark.svg';

const STORAGE_KEY = 'pm_splash_seen';
const GREET_MS = 2000;
const FILL_MS = 4200;
const FADE_MS = 550;
const CROSSFADE_MS = 500;
// Чуть медленнее, чем в блоке статистики (там DEFAULT_SPAWN_INTERVAL_MS) —
// на приветствии банка не одна из многих секций, а весь фокус экрана, ей
// можно не спешить.
const SPLASH_SPAWN_INTERVAL_MS = 120;

function alreadySeen() {
  try { return sessionStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
}

// Медицинский антураж на фоне — просто разбросанные по краям экрана иконки,
// не завязанные построчно на 4 направления сайта (это не легенда, а декор,
// чтобы фон приветствия не выглядел пусто вокруг банки). Проценты — позиция
// внутри fixed inset-0 экрана, задержки/длительности разные, чтобы плавание
// не было синхронным.
const BG_ICONS = [
  { Icon: Eye, top: '13%', left: '9%', size: 60, delay: '0s', duration: '7s' },
  { Icon: Ear, top: '20%', left: '85%', size: 52, delay: '.9s', duration: '6.4s' },
  { Icon: Smile, top: '72%', left: '11%', size: 56, delay: '1.7s', duration: '7.8s' },
  { Icon: ScanLine, top: '78%', left: '87%', size: 54, delay: '.4s', duration: '7.2s' },
  { Icon: Stethoscope, top: '46%', left: '5%', size: 46, delay: '2.1s', duration: '6.6s' },
  { Icon: Syringe, top: '42%', left: '92%', size: 44, delay: '1.3s', duration: '7.4s' },
];

// Направления клиники — короткие «фишки» под приветствием: заполняют паузу
// перед тем, как польются очки, и заодно напоминают, чем клиника занимается.
const CHIP_ICONS = [Eye, Ear, Smile, ScanLine];

// Приветственный экран — один раз за сессию вкладки (sessionStorage, не
// localStorage: возвращаться к нему при каждом визите незачем, но при каждой
// новой вкладке — можно). Пока не открыт ни разу, сразу за приветствием
// показывает ту же физическую банку с очками, что и в секции статистики ниже
// (PhysicsJar) — тот же Matter.js-канвас, просто меньшего размера.
export function Splash() {
  const { t } = useLang();
  const [dismissed, setDismissed] = useState(alreadySeen);
  const [phase, setPhase] = useState('greet'); // greet | fill | out
  const [physicsFailed, setPhysicsFailed] = useState(false);
  const timers = useRef([]);
  const fillTrigger = phase === 'fill' || phase === 'out';
  const count = useCountUp(PATIENTS_TOTAL, FILL_MS, fillTrigger && !physicsFailed);

  useEffect(() => {
    if (dismissed) return undefined;
    timers.current = [
      setTimeout(() => setPhase('fill'), GREET_MS),
      setTimeout(() => dismiss(), GREET_MS + FILL_MS + 500),
    ];
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dismissed]);

  const dismiss = () => {
    if (dismissed || phase === 'out') return;
    timers.current.forEach(clearTimeout);
    setPhase('out');
    setTimeout(() => {
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch { /* приватный режим */ }
      setDismissed(true);
    }, FADE_MS);
  };

  if (dismissed) return null;

  const directionNames = [t.dir.d1t, t.dir.d2t, t.dir.d3t, t.dir.d4t];

  return (
    <div
      className="pm-splash-bg fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 overflow-hidden transition-opacity"
      style={{ opacity: phase === 'out' ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
    >
      {BG_ICONS.map(({ Icon, top, left, size, delay, duration }, i) => (
        <Icon
          key={i}
          aria-hidden="true"
          className="pm-splash-icon"
          style={{ top, left, width: size, height: size, animationDelay: delay, animationDuration: duration }}
        />
      ))}

      <button
        type="button"
        onClick={dismiss}
        className="absolute right-6 bottom-6 border-0 bg-none text-[13px] text-slate-500 underline cursor-pointer dark:text-slate-400"
      >
        {t.splash.skip}
      </button>
      <img src={logoMark} alt="ProfiMed" className="pm-logo-fill h-16 md:h-24 w-auto" style={{ filter: 'url(#pm-logo-tint)' }} />

      {/* Приветствие и банка живут в одном зарезервированном по высоте месте
          и всегда оба смонтированы — вместо жёсткого перещёлкивания по
          условию плавно кроссфейдятся через opacity, каждый в своём слое. */}
      <div className="relative w-full flex justify-center" style={{ minHeight: 440 }}>
        <div
          className="absolute inset-x-0 top-0 flex flex-col items-center gap-3 transition-opacity"
          style={{
            opacity: phase === 'greet' ? 1 : 0,
            pointerEvents: phase === 'greet' ? 'auto' : 'none',
            transitionDuration: `${CROSSFADE_MS}ms`,
          }}
        >
          <p className="text-slate-600 text-center max-w-[26em] m-0 dark:text-slate-300" style={{ fontSize: 17 }}>{t.splash.sub}</p>
          <div className="flex flex-wrap justify-center gap-2" style={{ maxWidth: '24em' }}>
            {directionNames.map((name, i) => {
              const Icon = CHIP_ICONS[i];
              return (
                <span
                  key={name}
                  className="pm-hero-anim inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-white/70 px-3 py-1 text-[13px] font-medium text-primary-700 dark:border-primary-800 dark:bg-slate-800/70 dark:text-primary-300"
                  style={{ animationDelay: `${140 + i * 90}ms` }}
                >
                  <Icon size={14} strokeWidth={2} />
                  {name}
                </span>
              );
            })}
          </div>
        </div>

        <div
          className="absolute inset-x-0 top-0 flex flex-col items-center transition-opacity"
          style={{
            opacity: fillTrigger ? 1 : 0,
            pointerEvents: fillTrigger ? 'auto' : 'none',
            transitionDuration: `${CROSSFADE_MS}ms`,
          }}
        >
          <div className="mt-2.5">
            {physicsFailed ? (
              <p className="font-display text-slate-900 m-0 dark:text-slate-50" style={{ fontSize: 30 }}>{PATIENTS_TOTAL}</p>
            ) : (
              <PhysicsJar
                trigger={fillTrigger}
                onError={() => setPhysicsFailed(true)}
                size={320}
                spawnIntervalMs={SPLASH_SPAWN_INTERVAL_MS}
              />
            )}
          </div>
          {!physicsFailed && (
            <p className="font-display text-slate-900 m-0 dark:text-slate-50" style={{ fontSize: 30, marginTop: 6 }}>{count}</p>
          )}
          <p className="text-sm text-slate-500 m-0 dark:text-slate-400">{t.jar.label}</p>
        </div>
      </div>
    </div>
  );
}

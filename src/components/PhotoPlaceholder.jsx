import { Camera } from 'lucide-react';

// Явный, аккуратно оформленный плейсхолдер вместо фото — пока нет реальной
// съёмки клиники и врачей (решение зафиксировано в брифе: не тянем сроки
// ради фото на первом макете).
//
// radius — отдельный проп, а не класс rounded-* внутри className: у обоих
// правил один и тот же CSS-свойство (border-radius), и при двух конфликтующих
// классах в одной строке className побеждает тот, что позже встретился в
// сгенерированном Tailwind-файле, а не тот, что ближе к концу строки classNames
// (та же ловушка разобрана в комментарии к shape в ui/Button.jsx). Хочешь
// другой радиус у конкретного плейсхолдера — передавай его как проп, не
// пытайся перебить извне.
export function PhotoPlaceholder({ label, className = '', radius = 'rounded-[28px]' }) {
  return (
    <div
      className={`relative overflow-hidden ${radius} bg-gradient-to-br from-slate-100 via-slate-50 to-primary-50 dark:from-slate-800 dark:via-slate-800 dark:to-primary-900 ${className}`}
    >
      <div className="relative h-full min-h-[160px] flex flex-col items-center justify-center gap-2 p-6 text-center text-primary-700/60 dark:text-primary-300/70">
        <Camera size={26} strokeWidth={1.5} />
        {label && <span className="text-xs font-medium uppercase tracking-wide">{label}</span>}
      </div>
    </div>
  );
}

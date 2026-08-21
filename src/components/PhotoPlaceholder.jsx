import { Camera } from 'lucide-react';

// Явный, аккуратно оформленный плейсхолдер вместо фото — пока нет реальной
// съёмки клиники и врачей (решение зафиксировано в брифе: не тянем сроки
// ради фото на первом макете).
export function PhotoPlaceholder({ label, className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-100 via-slate-50 to-primary-50 dark:from-slate-800 dark:via-slate-800 dark:to-primary-900 ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgb(35 108 101 / 0.08) 0px, rgb(35 108 101 / 0.08) 1px, transparent 1px, transparent 14px)',
        }}
      />
      <div className="relative h-full min-h-[160px] flex flex-col items-center justify-center gap-2 p-6 text-center text-primary-700/60 dark:text-primary-300/70">
        <Camera size={26} strokeWidth={1.5} />
        {label && <span className="text-xs font-medium uppercase tracking-wide">{label}</span>}
      </div>
    </div>
  );
}

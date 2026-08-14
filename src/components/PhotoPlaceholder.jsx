import { Camera } from 'lucide-react';

// Явный, аккуратно оформленный плейсхолдер вместо фото — пока нет реальной
// съёмки клиники и врачей (решение зафиксировано в брифе: не тянем сроки
// ради фото на первом макете).
export function PhotoPlaceholder({ label, className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 via-primary-50 to-leaf-100 ${className}`}
    >
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgb(12 93 140 / 0.10) 0px, rgb(12 93 140 / 0.10) 1px, transparent 1px, transparent 14px)',
        }}
      />
      <div className="relative h-full min-h-[160px] flex flex-col items-center justify-center gap-2 p-6 text-center text-primary-700/60">
        <Camera size={26} strokeWidth={1.5} />
        {label && <span className="text-xs font-medium uppercase tracking-wide">{label}</span>}
      </div>
    </div>
  );
}

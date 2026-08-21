import { useState } from 'react';
import { PhotoPlaceholder } from './PhotoPlaceholder.jsx';

// Перетаскиваемый разделитель «до/после» — прозрачный <input type="range">
// поверх картинки: клика мышью и свайпа с телефона это уже даёт бесплатно,
// без ручной обработки pointer-событий.
export function BeforeAfterSlider({ beforeLabel, afterLabel, ariaLabel }) {
  const [pos, setPos] = useState(50);

  return (
    <div className="relative overflow-hidden rounded-2xl aspect-[4/3] w-full">
      <PhotoPlaceholder label={beforeLabel} className="aspect-[4/3] w-full" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <PhotoPlaceholder label={afterLabel} className="aspect-[4/3] w-full" />
      </div>
      <div className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }} />
      <span className="absolute left-2.5 top-2.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700">{beforeLabel}</span>
      <span className="absolute right-2.5 top-2.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700">{afterLabel}</span>
      <div
        className="absolute top-1/2 flex items-center justify-center gap-0.5 w-10 h-10 rounded-full bg-white text-primary-600 pointer-events-none"
        style={{ left: `${pos}%`, transform: 'translate(-50%, -50%)', boxShadow: '0 4px 14px rgba(0,0,0,.28)' }}
      >
        <span className="text-xs leading-none">◂</span><span className="text-xs leading-none">▸</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={ariaLabel}
        className="absolute inset-0 w-full h-full m-0 opacity-0 cursor-ew-resize appearance-none"
      />
    </div>
  );
}

import { useLang } from '../i18n/LangContext.jsx';
import { useCountUp } from '../hooks/useCountUp.js';
import { Button } from './ui/Button.jsx';
import heroPhoto from '../assets/hero.jpg';

export function Hero() {
  const { t } = useLang();

  const count1 = useCountUp(parseInt(t.facts.f1v, 10) || 0);
  const count2 = useCountUp(parseInt(t.facts.f2v, 10) || 0);

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="relative">
        <section id="top" className="relative pt-8 pb-8 lg:py-0 lg:min-h-[520px] xl:min-h-[560px]">
          {/* Композиция — не grid-колонки, а два слоя: широкое фото сзади
              (справа, уходит под айвори дальше своей видимой границы) и
              айвори-поверхность поверх него из ДВУХ обычных прямоугольников
              разной ширины (не clip-path — раньше уже пробовали резать
              форму по фото/тексту, оба раза это либо резало реальный
              контент, либо просто рисовало ровную границу другого места).
              Смысловое деление важно: в верхнем (широком) блоке — только
              eyebrow+заголовок, в нижнем (уже) — текст+кнопки; так «ступень»
              проявляется сразу после заголовка, а не прячется внизу у кнопок. */}
          <div className="relative z-10 flex flex-col lg:h-full">
            <div className="bg-slate-50 dark:bg-slate-950 pm-hero-pad-l pr-4 sm:pr-6 lg:pr-10 lg:w-[52%] lg:pt-14">
              <p className="pm-hero-anim text-sm font-medium text-slate-600 tracking-[0.08em] mb-4 dark:text-slate-400">
                {t.hero.eyebrow}
              </p>
              <h1 className="pm-hero-anim font-display text-slate-900 text-balance mb-0 text-[38px] sm:text-[52px] lg:text-[64px] leading-[1.05] dark:text-slate-50" style={{ animationDelay: '90ms' }}>
                {t.hero.h1}
              </h1>
            </div>
            <div className="pm-hero-anim bg-slate-50 dark:bg-slate-950 lg:w-[44%] lg:flex-1 flex flex-col justify-center pm-hero-pad-l pr-4 sm:pr-6 lg:pr-10 pt-5 pb-8 lg:py-0" style={{ animationDelay: '180ms' }}>
              <p className="text-lg text-slate-600 mb-6 max-w-[32em] dark:text-slate-300">
                {t.hero.sub}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href="#booking" size="lg">{t.hero.cta1}</Button>
                <Button href="tel:+998951956119" variant="secondary" size="lg">{t.hero.cta2}</Button>
              </div>
            </div>
          </div>

          {/* Фото — за текстом (z-index по умолчанию ниже z-10 айвори-блока
              выше), шире своей видимой части: левый край уходит под айвори.
              overflow-hidden на самом слое — на случай, если понадобится
              object-position/scale для позиционирования вывески, картинка
              не должна вылезать за пределы поля даже в мелочах браузерных
              реализаций. Без lazy/анимации — вероятный LCP-элемент. */}
          <div className="relative mt-6 lg:mt-0 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[56%] lg:overflow-hidden">
            <img
              src={heroPhoto}
              alt={t.hero.photo}
              loading="eager"
              fetchpriority="high"
              className="w-full h-[280px] sm:h-[360px] object-cover object-[50%_35%] lg:h-full lg:w-full lg:object-[0%_35%]"
            />
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-slate-200 dark:border-slate-800">
            <FactStat value={count1} label={t.facts.f1l} className="pr-4 py-5 lg:py-6 lg:pl-0 lg:pr-6" />
            <FactStat value={count2} label={t.facts.f2l} className="pl-4 py-5 border-l border-slate-200 dark:border-slate-800 lg:py-6 lg:px-6" />
            <FactStat value={t.facts.f3v} label={t.facts.f3l} small className="pr-4 py-5 border-t border-slate-200 dark:border-slate-800 lg:py-6 lg:px-6 lg:border-t-0 lg:border-l" />
            <FactStat value={t.facts.f4v} label={t.facts.f4l} className="pl-4 py-5 border-t border-l border-slate-200 dark:border-slate-800 lg:py-6 lg:px-6 lg:border-t-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FactStat({ value, label, small, className = '' }) {
  return (
    <div className={className}>
      <p className={`font-display text-slate-900 leading-tight mb-1 dark:text-slate-50 ${small ? 'text-[19px]' : 'text-[26px]'}`}>{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

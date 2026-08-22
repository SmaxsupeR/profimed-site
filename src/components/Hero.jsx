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
        <section id="top" className="pt-10 pb-10 lg:pt-12 lg:pb-14">
          {/* Кадр фиксированной высоты (не выводится из естественной высоты
              текста) — иначе в более длинных локалях (RU/UZC) заголовок в 3
              строки вместо 2 менял бы crop фотографии и высоту всего Hero.
              Оба грид-айтема получают одинаковый min-h, текст центрируется
              внутри него флексом. Фото сдвинуто вверх относительно текстовой
              колонки (-top-7 при lg) и стоит на более широкой (58%, не 50%)
              колонке — вместе с этим смещением и одиночным скруглением это и
              есть попытка не превратиться в «два ровных прямоугольника без
              скруглений». */}
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <div className="flex flex-col justify-center pm-hero-pad-l pr-4 sm:pr-6 lg:pr-8 py-8 lg:py-0 lg:min-h-[560px] xl:min-h-[600px]">
              <p className="pm-hero-anim text-sm font-medium text-slate-600 tracking-[0.08em] mb-4 dark:text-slate-400">
                {t.hero.eyebrow}
              </p>
              <h1 className="pm-hero-anim font-display text-slate-900 text-balance mb-5 text-[38px] sm:text-[52px] lg:text-[56px] leading-[1.05] dark:text-slate-50" style={{ animationDelay: '90ms' }}>
                {t.hero.h1}
              </h1>
              <p className="pm-hero-anim text-lg text-slate-600 mb-8 max-w-[32em] dark:text-slate-300" style={{ animationDelay: '180ms' }}>
                {t.hero.sub}
              </p>
              <div className="pm-hero-anim flex flex-wrap gap-3" style={{ animationDelay: '270ms' }}>
                <Button href="#booking" size="lg">{t.hero.cta1}</Button>
                <Button href="tel:+998951956119" variant="secondary" size="lg">{t.hero.cta2}</Button>
              </div>
            </div>
            <div className="relative lg:min-h-[560px] xl:min-h-[600px]">
              {/* Без анимации появления и без lazy — это, скорее всего,
                  главный LCP-элемент страницы. */}
              <img
                src={heroPhoto}
                alt={t.hero.photo}
                loading="eager"
                fetchpriority="high"
                className="w-full h-[280px] sm:h-[360px] object-cover object-[55%_50%] lg:absolute lg:-top-7 lg:right-0 lg:bottom-0 lg:left-0 lg:h-auto lg:w-full lg:object-[58%_60%] lg:rounded-bl-[48px]"
              />
            </div>
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

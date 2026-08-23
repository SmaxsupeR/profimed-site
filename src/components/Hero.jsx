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
        <section id="top" className="relative overflow-hidden py-8 lg:py-0 lg:flex lg:items-center lg:min-h-[560px] xl:min-h-[600px]">
          {/* Ступенчатые айвори-панели (этап 3.1, коррект. 1) технически не
              были grid-колонками, но всё равно читались как «текст слева /
              фото справа с фигурной границей» — прямая жёсткая линия между
              слоями делала «слоистость» видимой лишь на бумаге, а не на
              экране. Здесь по-другому: фото — целиком фон на весь Hero, а
              текст защищён не панелью, а прозрачным айвори-градиентом поверх
              фото (слева непрозрачный, справа уходит в 0). Границы между
              «текстом» и «фото» просто нет — есть один непрерывный тон. */}
          {/* Текст — первый в DOM: на мобильном фото стоит в обычном потоке
              ПОСЛЕ текста (порядок eyebrow→заголовок→текст→кнопки→фото),
              а на десктопе и фото, и градиент — abs с явным z-index, так
              что порядок в разметке на их стэк уже не влияет. */}
          <div className="relative z-10 pm-hero-pad-l pr-4 sm:pr-6 lg:pr-10">
            {/* max-width — на внутреннем блоке, не на том же, что несёт
                padding: iначе border-box считает паддинг частью max-w, и
                реального места под текст остаётся заметно меньше, чем
                кажется по числу (наступил на эти же грабли в этом же файле
                на прошлом заходе). */}
            <div className="lg:max-w-[540px]">
              <p className="pm-hero-anim text-sm font-medium text-slate-600 tracking-[0.08em] mb-4 dark:text-slate-400">
                {t.hero.eyebrow}
              </p>
              <h1 className="pm-hero-anim font-display text-slate-900 text-balance mb-5 text-[38px] sm:text-[52px] lg:text-[64px] leading-[1.05] dark:text-slate-50" style={{ animationDelay: '90ms' }}>
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
          </div>

          <img
            src={heroPhoto}
            alt={t.hero.photo}
            loading="eager"
            fetchpriority="high"
            className="pm-hero-photo-shift mt-6 lg:mt-0 w-full h-[280px] sm:h-[360px] object-cover object-[50%_30%] lg:absolute lg:inset-0 lg:z-0 lg:h-full lg:w-full lg:object-[50%_26%]"
          />
          {/* Пустой слой-градиент — есть только у lg (мобильная версия выше
              просто ставит фото полосой под текстом, там защищать нечего).
              Первая версия растягивала градиент до 80% ширины — по
              скриншоту пользователя это дало сплошную дымку почти на весь
              кадр (дерево, вывеска на земле — всё побледнело), а не
              локальную защиту текста. Сузил: полная непрозрачность держится
              только до ~46% (заведомо дальше, чем доходит текст — max-w
              текстового блока + отступ слева, ~47.5% на 1440/1280), к 64%
              уже полностью прозрачно. Дереву и большей части фото ниже 64%
              градиент теперь не мешает. */}
          <div className="hidden lg:block lg:absolute lg:inset-0 lg:z-[5] bg-gradient-to-r from-slate-50 from-0% via-slate-50/85 via-45% to-transparent to-65% dark:from-slate-950 dark:via-slate-950/85 dark:to-transparent" />
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

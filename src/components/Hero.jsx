import { Phone } from 'lucide-react';
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
          {/* Этап 3.2 — блок сдвинут выше геометрического центра секции:
              items-center на section остаётся (высота контента слишком
              разная между 4 языками, чтобы жёстко считать top-отступ), а
              смещение вверх даёт невидимый lg:pb-14 ниже текста — центрируется
              уже более высокая «виртуальная» коробка, реальный текст в ней
              оказывается выше середины. */}
          <div className="relative z-10 pm-hero-pad-l pr-4 sm:pr-6 lg:pr-10 lg:pb-14">
            {/* max-width — на внутреннем блоке, не на том же, что несёт
                padding: iначе border-box считает паддинг частью max-w, и
                реального места под текст остаётся заметно меньше, чем
                кажется по числу (наступил на эти же грабли в этом же файле
                на прошлом заходе). */}
            <div className="lg:max-w-[620px]">
              {/* ml-[3px] — субъективная визуальная подгонка (не обязательная
                  по коду: box эйброу и так стоит вровень с заголовком/лого,
                  проверено и getBoundingClientRect, и живой направляющей
                  линией в скриншоте). По ощущению пользователя маленькая
                  тонкая надпись рядом с огромным жирным заголовком читалась
                  чуть левее — сдвигаем на глаз, не по формуле. */}
              <p className="pm-hero-anim ml-[3px] text-sm font-medium text-primary-600 tracking-[0.06em] mb-4 dark:text-primary-300">
                {t.hero.eyebrow}
              </p>
              {/* font-hero — этап 3.2, отдельный токен только для Hero h1
                  (см. fontFamily.hero в tailwind.config.js), Literata как
                  `display` не тронута нигде за пределами Hero. Из трёх живых
                  кандидатов на этой же фотографии: Prata читалась изящно, но
                  её растянутые засечки-«усики» (особенно у «т», «п») клонят
                  вид ближе к бьюти/fashion-леттерингу, чем к клинике; Noto
                  Serif Display на 600 — слишком контрастная (тонкие волоски
                  против жирных стволов), драматичнее, чем «спокойно», и «Точная
                  диагностика.» у неё не помещалась в строку даже на 58px.
                  Spectral 600 — сдержанный контраст, уверенный вес без
                  вычурности, ближе к «редакторский медицинский», чем к
                  «модный журнал» — и чисто ложится в две строки. Строки —
                  массив в словаре, а не текст с ручным переносом: у каждого
                  языка свой естественный слом на две фразы, не калька с
                  русского. 58–60px на десктопе (не выше): на границе lg
                  (1024px) левый паддинг секции ещё у своего минимума (24px,
                  см. .pm-hero-pad-l), и на бо́льшем кегле хвост «Точная
                  диагностика.» вылезал за пределы защиты левого градиента,
                  читаясь поверх вывески на фото. Пробовал расширить сам
                  градиент — испортил вывеску уже на широких экранах (градиент
                  — доля от ширины секции, растёт вместе с ней быстрее, чем
                  нужно). Правильный рычаг — не трогать градиент/фото, а не
                  давать заголовку упираться в его границу: размер, ширина
                  колонки (620px) и небольшой отрицательный tracking вместе
                  держат текст внутри защищённой зоны с запасом даже на 1024px.
                  Пробовал ещё и точечную оптическую поправку под конкретную
                  букву «М» (-ml на пару px) — по факту сделало только хуже:
                  box у h1 и так стоит вровень с эйброу и логотипом (это
                  проверяется точно, getBoundingClientRect), а подгонка под
                  один конкретный глиф одного конкретного языка — нестабильная
                  вещь, зависит от рендеринга шрифта на конкретной машине.
                  Оставил чистое выравнивание по боксу — это то, что реально
                  проверяемо и одинаково everywhere. */}
              <h1 className="pm-hero-anim font-hero text-slate-900 mb-7 text-[42px] sm:text-[46px] lg:text-[58px] xl:text-[60px] leading-[1.1] tracking-[-0.02em] dark:text-slate-50" style={{ animationDelay: '90ms' }}>
                {t.hero.h1.map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>
              <p className="pm-hero-anim text-lg leading-normal text-slate-600 mb-8 max-w-[480px] dark:text-slate-300" style={{ animationDelay: '180ms' }}>
                {t.hero.sub} {t.hero.sub2}
              </p>
              {/* CTA-иерархия (этап 3.2) — было два равновесных pill-button;
                  «Позвонить» понижен до текстовой ссылки с иконкой, чтобы с
                  первого взгляда читалось одно основное действие. */}
              <div className="pm-hero-anim flex flex-wrap items-center gap-x-7 gap-y-3" style={{ animationDelay: '270ms' }}>
                <Button href="#booking" size="lg">{t.hero.cta1}</Button>
                <a
                  href="tel:+998951956119"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-primary-600 dark:text-slate-200 dark:hover:text-primary-300"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {t.hero.cta2}
                </a>
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
              локальную защиту текста. Сузил, но via был не полностью
              непрозрачным (slate-50/85) и терял непрозрачность сразу от 0%,
              а не держал плоскую полку — на скриншоте пользователя это дало
              заметный шов ровно там, где под градиентом начинается фото
              (около 26–30% ширины). via теперь полностью непрозрачен и
              сдвинут на 32% — плоская полка сплошного цвета с запасом
              перекрывает этот стык, дальше (32–60%) чистый плавный спад.
              Этап 3.2 пробовал растянуть до 68% из-за нечитаемого хвоста
              заголовка на границе lg — не тот рычаг: доля от ширины секции,
              на широких экранах тот же процент съедал уже саму вывеску.
              Вернул 60% (это фото/градиент — approved, трогать без крайней
              необходимости нельзя), а хвост заголовка поправил размером
              шрифта в h1 (см. комментарий там). */}
          <div className="hidden lg:block lg:absolute lg:inset-0 lg:z-[5] bg-gradient-to-r from-slate-50 from-0% via-slate-50 via-32% to-transparent to-60% dark:from-slate-950 dark:via-slate-950 dark:to-transparent" />
          {/* Нижняя каёмка (этап 3.1, коррект. 4) — ниже кадра, за границей
              секции, стоит напольная вывеска ProfiMed; overflow-hidden режет
              её ровной линией прямо по нижнему краю Hero. Гасим эту линию
              тем же цветом фона, что и у градиента слева, — вывеска на полу
              растворяется в фоне, а не обрывается по линейке. Только низ:
              справа и сверху фото и так с запасом, обрезать там нечего. */}
          <div className="hidden lg:block lg:absolute lg:inset-x-0 lg:bottom-0 lg:z-[5] lg:h-[22%] bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-950" />
        </section>

        <div className="pm-container px-4 sm:px-6 pb-3">
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

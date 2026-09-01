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
                  первого взгляда читалось одно основное действие. Десктоп —
                  без изменений, только явно спрятан на мобильном (hidden
                  lg:flex), сама разметка/классы те же, что и были. */}
              <div className="pm-hero-anim hidden items-center gap-x-7 gap-y-3 lg:flex" style={{ animationDelay: '270ms' }}>
                <Button href="/#booking" size="lg">{t.hero.cta1}</Button>
                <a
                  href="tel:+998951956119"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-primary-600 dark:text-slate-200 dark:hover:text-primary-300"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {t.hero.cta2}
                </a>
              </div>

              {/* Мобильный CTA-блок (этап 3.7) — на узком экране пара
                  «крупная pill-кнопка + тонкая текстовая ссылка» читалась
                  как два разных, не связанных друг с другом действия
                  (бриф). Теперь это один вертикальный блок: обе кнопки
                  одной ширины/высоты, «Позвонить» — тот же Button, вариант
                  secondary (контур, не заливка) — визуально явно вторичный,
                  но той же природы, что и primary, а не самостоятельная
                  ссылка сама по себе. shape="rounded" — 16px (rounded-2xl),
                  осознанно не rounded-full: бриф просит сдержанное
                  скругление, а не ещё одну пилюлю. h-[50px] на обеих —
                  не полагаемся на padding+line-height дать одинаковую
                  высоту: у secondary есть 1px border с каждой стороны,
                  который в auto-высоте прибавил бы 2px сверх padding —
                  явная высота гарантирует, что кнопки визуально идентичны
                  по размеру, а не «почти». max-w-[300px] — чтобы блок не
                  растягивался на всю ширину колонки (та же логика, что и у
                  max-w-[620px] на самой колонке чуть выше, только у же). */}
              {/* id — этап полировки 2, наблюдатель в App.jsx (heroCtaInView):
                  пока эти кнопки в кадре на мобильном, отдельная нижняя
                  панель MobileCallBar не нужна — она дублировала бы те же
                  по смыслу действия. */}
              <div id="hero-mobile-actions" className="pm-hero-anim flex max-w-[300px] flex-col gap-2.5 lg:hidden" style={{ animationDelay: '270ms' }}>
                <Button href="/#booking" size="lg" shape="rounded" className="h-[50px] w-full">
                  {t.hero.cta1}
                </Button>
                <Button href="tel:+998951956119" variant="secondary" size="lg" shape="rounded" className="h-[50px] w-full">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {t.hero.cta2}
                </Button>
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

        {/* Этап 3.4 — было 4 механически равных колонки со сплошными
            full-height бордерами (читалось как таблица/Excel). Ширины теперь
            content-aware (Morita — самое длинное значение — получает больше
            места, чем ровные 25%), flex вместо grid: с border-box (Tailwind
            preflight) flex-basis в процентах уже включает свой же
            padding — сумма всегда 100% и внутренний pr/pl каждой колонки сам
            формирует «зазор» между соседями, без отдельного gap и без риска
            вылезти за контейнер (та же логика, что и у .pm-container/
            .pm-hero-pad-l — здесь обошлось без отдельного custom CSS, чистые
            Tailwind-утилиты). Один тонкий синий акцент сверху (2px) заменяет
            прежний нейтральный border-t — одновременно и отделяет блок от
            Hero, и даёт единственный «брендовый» штрих, вместо бордера-
            разделителя + акцента по отдельности.

            Два набора пропорций (lg vs xl), не один — на голой ширине lg
            (1024–1279px, .pm-container ещё не достиг своего максимума 72rem,
            контента реально меньше) Morita и «направления в одном здании»
            не помещаются в 1 строку при пропорциях, посчитанных под
            широкий десктоп (1280+). Дал lg-версии более узкие паддинги
            (pl-6/pr-6 вместо pl-8/pr-8) и другое соотношение долей — именно
            под них, а на xl (1280+, где контейнер уже во всю ширину 1104px)
            паддинги и доли возвращаются к более просторным. Проверено
            наложением getBoundingClientRect на 1024/1280/1440: у «года
            основания» подпись на lg всё равно уходит на 2 строки (не
            хватает места без ущерба для Morita/расписания) — сознательный
            компромисс, единственная жёсткая просьба была про «направления
            в одном здании» и Morita, не про подпись у 2014. */}
        <div className="pm-container px-4 sm:px-6 pb-6 lg:pb-8">
          <div className="h-px bg-primary-600/50 lg:h-[2px] dark:bg-primary-400/35" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 pt-7 lg:flex lg:items-stretch lg:gap-x-0 lg:pt-9">
            <FactStat value={count1} label={t.facts.f1l} className="lg:basis-[16%] xl:basis-[19%] lg:grow-0 lg:shrink-0 lg:pr-6 xl:pr-8" />
            <FactStat value={count2} label={t.facts.f2l} divider className="lg:basis-[28%] xl:basis-[26%] lg:grow-0 lg:shrink-0 lg:pl-6 lg:pr-6 xl:pl-8 xl:pr-8" />
            <FactStat value={t.facts.f3v} label={t.facts.f3l} size="sm" divider className="lg:basis-[33%] xl:basis-[32%] lg:grow-0 lg:shrink-0 lg:pl-6 lg:pr-6 xl:pl-8 xl:pr-8" />
            <FactStat value={t.facts.f4v} label={t.facts.f4l} divider className="lg:basis-[23%] lg:grow-0 lg:shrink-0 lg:pl-6 xl:pl-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

// font-hero, не font-display — сознательно тот же токен, что у h1 Hero
// (см. комментарий там): факт-полоса стоит прямо под заголовком и должна
// визуально продолжать его, а не спорить отдельным шрифтом. size="sm"
// только у Morita — самое длинное значение, но той же гарнитуры и того же
// графитового тона, просто чуть мельче (не механически одинаковые кегли
// у всех четырёх, а сбалансированные на глаз под длину строки).
function FactStat({ value, label, size = 'lg', divider, className = '' }) {
  const valueSize = size === 'sm'
    ? 'text-[19px] sm:text-[21px] lg:text-[25px] xl:text-[27px] leading-[1.15]'
    : 'text-[28px] sm:text-[30px] lg:text-[32px] xl:text-[34px] leading-none';
  return (
    <div className={`relative ${className}`}>
      {/* Короткая вертикальная риска вместо full-height border-l — та же
          идея, что и с акцентом сверху: разделитель обозначает границу
          колонки, но не тянется на всю высоту строки, как в таблице.
          left-0 (не отрицательный отступ!) — border-box считает padding уже
          внутри ширины колонки, так что граница между соседями и есть центр
          зазора (сосед слева отдаёт свою правую половину, эта колонка —
          левую), а левый край box'а этой колонки (left:0 у absolute-ребёнка
          = левый край padding-box'а родителя) стоит точно посередине между
          ними — работает при любом соотношении pl/pr, лишь бы у пары
          соседей оно совпадало (см. lg:pl-6/pr-6 vs xl:pl-8/pr-8 ниже — само
          по себе не ломает центровку, поменялось симметрично у всех).
          Только lg — на мобильном 2×2 без разделителей, группировка там
          держится на gap. */}
      {divider && (
        <span
          aria-hidden="true"
          className="hidden lg:block absolute left-0 top-1/2 h-9 w-px -translate-y-1/2 bg-slate-300/70 dark:bg-slate-700/70"
        />
      )}
      <p className={`font-hero text-slate-900 tracking-[-0.01em] mb-2 dark:text-slate-50 ${valueSize}`}>{value}</p>
      <p className="text-[13px] leading-snug text-slate-500 max-w-[26ch] sm:text-sm dark:text-slate-400">{label}</p>
    </div>
  );
}

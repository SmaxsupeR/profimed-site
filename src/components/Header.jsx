import { Fragment, useEffect, useState } from 'react';
import { Menu, X, Sun, Moon, ChevronDown, ChevronRight, Check, Phone } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';
import { DICT } from '../i18n/dict.js';
import { Button } from './ui/Button.jsx';
import logoMark from '../assets/profimed-logo-mark.svg';

const LANG_ORDER = ['ru', 'uz', 'uzc', 'en'];
const NAV_HREFS = ['/#directions', '/#doctors', '/#prices', '/#reviews', '/#contact'];

// «Сейчас открыто/закрыто» — часовой пояс Ташкента (UTC+5) захардкожен: сайт
// только для одной клиники в одном городе, тащить библиотеку часовых поясов
// ради этого не стоит. Пн–Пт 09:00–19:00, Сб — короткий день, 09:00–18:00.
function isOpenNow(now) {
  const utcMin = now.getUTCHours() * 60 + now.getUTCMinutes();
  const tashMin = (utcMin + 300) % 1440;
  const day = (now.getUTCDay() + (utcMin + 300 >= 1440 ? 1 : 0)) % 7;
  if (day === 0) return false; // воскресенье
  const closeMin = day === 6 ? 1080 : 1140; // суббота до 18:00, будни до 19:00
  return tashMin >= 540 && tashMin < closeMin;
}

export function Header() {
  const { lang, setLang, t } = useLang();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  // Шапка ужимается, когда страницу пролистали: верхняя синяя полоса с
  // адресом уезжает (её содержимое нужно один раз, в начале), а сама шапка
  // становится ниже и приподнимается тенью — так контента на экране больше,
  // а навигация остаётся под рукой.
  const [scrolled, setScrolled] = useState(false);
  // Высота шапки на мобильном и десктопе теперь разная (этап 3.6, бриф
  // «Target Header height: approximately 64–68px» — именно для мобильной
  // шапки, десктопные 60/72 трогать не просили). matchMedia, а не просто
  // «meta-flag» из CSS: число используется в JS (высота спейсера ниже,
  // высота открытого меню — 100dvh минус эта же высота), так что breakpoint
  // должен быть виден и здесь, не только в Tailwind-классах. Порог — тот
  // же 1024px, что и у всех lg:-классов в этом файле.
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia('(min-width: 1024px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  // Разные пороги на вход/выход (а не один и тот же scrollY > 40) —
  // намеренно, с запасом больше, чем перепад высоты шапки при сжатии
  // (108px → 60px, то есть 48px). Один порог давал бесконечное дрожание:
  // сжатие спейсера сдвигает контент вверх, scroll anchoring в браузере
  // компенсирует это уменьшением scrollY примерно на те же 48px, значение
  // ныряет обратно под порог, шапка разжимается — и так по кругу на любой
  // высоте скролла рядом с порогом. Зазор между порогами шире перепада —
  // качели физически не могут провалиться обратно за противоположный порог.
  useEffect(() => {
    const onScroll = () => {
      setScrolled((prev) => (prev ? window.scrollY > 24 : window.scrollY > 96));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const topBarHeight = scrolled ? 0 : 36;
  const headerHeight = isDesktop ? (scrolled ? 60 : 72) : (scrolled ? 64 : 68);

  const open = isOpenNow(now);
  // Часы работы для мобильного меню (этап 3.6) — бриф просит показывать их
  // в две строки («Пн–Пт 09:00–19:00» / «Сб 09:00–18:00»), но без нового
  // датасета: t.top.hours уже хранит обе части одной строкой через запятую
  // («…19:00, Сб…»), формат одинаковый во всех 4 языках. split — это чисто
  // отображение уже существующих данных, не новая бизнес-логика про часы.
  const hoursLines = t.top.hours.split(', ');

  return (
    <Fragment>
    <div className="fixed inset-x-0 top-0 z-40">
      {/* Верхняя полоса — нейтральный графит, не тил: это адресная строка,
          а не действие, и не должна спорить с primary-кнопками ниже. */}
      <div
        className="hidden lg:block bg-slate-900 overflow-hidden transition-[height] duration-300 ease-out"
        style={{ height: topBarHeight }}
      >
        <div className="pm-container px-4 sm:px-6 h-9 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <span className="text-white/90 text-xs">{t.top.address}</span>
            <span className="text-white/35">·</span>
            <span className="text-white/90 text-xs">{t.top.hours}</span>
            <span className="text-white/35">·</span>
            <a href="mailto:info@profimed.uz" className="text-white/90 text-xs hover:underline">info@profimed.uz</a>
          </div>
          <div className="flex items-center gap-3.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90">
              <span className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green' : 'bg-amber-300'}`} />
              {open ? t.status.open : t.status.closed}
            </span>
            <a href="tel:+998951956119" className="text-white/90 text-xs font-semibold hover:underline">+998 95 195 61 19</a>
          </div>
        </div>
      </div>

      <header
        className={`border-b transition-[background-color,backdrop-filter] duration-300 ${
          scrolled
            ? 'backdrop-blur-md bg-white/85 border-slate-200 dark:bg-slate-950/85 dark:border-slate-800'
            : 'bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800'
        }`}
      >
        <div
          className="pm-container px-4 sm:px-6 flex items-center justify-between gap-4 transition-[height] duration-300 ease-out"
          style={{ height: headerHeight }}
        >
          <a href="/#top" className="flex items-center shrink-0">
            <span
              role="img"
              aria-label="ProfiMed"
              className="pm-logo-mask h-12"
              style={{ WebkitMaskImage: `url(${logoMark})`, maskImage: `url(${logoMark})` }}
            />
          </a>

          <nav className="hidden lg:flex items-center gap-6">
            {NAV_HREFS.map((href, i) => (
              <a key={href} href={href} className="text-sm font-medium text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-400">
                {t.nav[i]}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3.5">
            {/* Компактный статус «открыто/закрыто» в самой шапке (этап 3.5) —
                показываем только когда topBarHeight схлопнут (scrolled):
                в развёрнутом виде та же информация уже есть в топбаре
                сверху, дублировать её рядом с логотипом незачем. Часы —
                через title (hover-тултип), а не текстом рядом: это
                «быстрый доступ», а не копия всей строки топбара — адрес и
                почта здесь не нужны, только то, что реально пропадает при
                скролле (статус) и то, что за ним обычно ищут (часы). Тот
                же isOpenNow/t.status/t.top.hours, что и в топбаре. */}
            {scrolled && (
              <span
                className="pm-menu-item-anim inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400"
                title={t.top.hours}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green' : 'bg-amber-300'}`} />
                {open ? t.status.open : t.status.closed}
              </span>
            )}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={langMenuOpen}
                className="flex items-center gap-1.5 h-[38px] px-3.5 rounded-full border border-slate-300 text-sm font-semibold text-slate-600 hover:border-primary-400 hover:text-primary-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-400"
              >
                {DICT[lang].label}
                <ChevronDown size={12} />
              </button>
              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
                  <div className="pm-menu-anim absolute right-0 top-[46px] z-50 min-w-[212px] grid gap-0.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-card dark:border-slate-700 dark:bg-slate-800">
                    {LANG_ORDER.map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => { setLang(code); setLangMenuOpen(false); }}
                        aria-current={code === lang}
                        className="flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        <span className="flex items-center gap-2 whitespace-nowrap">
                          <span aria-hidden="true">{DICT[code].flag}</span>
                          {DICT[code].full}
                        </span>
                        {code === lang && <Check size={15} className="text-primary-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t.hdr.theme}
              title={t.hdr.theme}
              className="flex items-center justify-center w-[38px] h-[38px] rounded-full border border-slate-300 text-slate-600 hover:border-primary-400 hover:text-primary-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-400"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <a href="tel:+998951956119" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-400">
              <Phone size={15} />
              +998 95 195 61 19
            </a>

            <Button href="/#booking" size="sm">{t.hdr.cta}</Button>
          </div>

          {/* Мобильный утилити-кластер (этап 3.4) — раньше здесь до
              hamburger была пустая половина шапки: у desktop-блока выше
              весь язык/тема/телефон/CTA скрыты на мобильном разом (hidden
              lg:flex), а сам hamburger стоял в одиночку и justify-between
              на row разносил его с лого на разные края. Язык и тема — те
              же данные/обработчики (lang, langMenuOpen, toggleTheme), что
              и у desktop-версии выше, но со своей отдельной вёрсткой —
              компактной и без круглой pill-рамки, чтобы не читаться той
              же кнопкой, что тема. Один langMenuOpen на обе кнопки: видна
              всегда только одна ветка (у другой родитель на display:none
              по брейкпоинту) — тот же приём, что и с nav/мобильным меню
              ниже. Звонок и «Записаться» тут нарочно не дублируются — на
              мобильном их уже держит липкая MobileCallBar снизу. */}
          <div className="flex items-center gap-1 lg:hidden">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={langMenuOpen}
                className="flex h-9 items-center gap-1 rounded-md px-2 text-xs font-semibold text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-400"
              >
                {DICT[lang].label}
                <ChevronDown size={11} />
              </button>
              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
                  <div className="pm-menu-anim absolute right-0 top-[38px] z-50 min-w-[212px] grid gap-0.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-card dark:border-slate-700 dark:bg-slate-800">
                    {LANG_ORDER.map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => { setLang(code); setLangMenuOpen(false); }}
                        aria-current={code === lang}
                        className="flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-primary-50 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        <span className="flex items-center gap-2 whitespace-nowrap">
                          <span aria-hidden="true">{DICT[code].flag}</span>
                          {DICT[code].full}
                        </span>
                        {code === lang && <Check size={15} className="text-primary-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t.hdr.theme}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-400"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Плюс/крест — тот же контрол переключает открытие/закрытие,
                но брифу (п.2) нужен «простой тонкий X», а не гамбургер того
                же начертания: у крестика strokeWidth занижен, у гамбургера
                оставлен дефолтный вес lucide (2). */}
            <button
              type="button"
              className="-mr-1.5 flex h-9 w-9 items-center justify-center text-slate-700 dark:text-slate-200"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={t.hdr.menu}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Язык и тема больше не дублируются здесь (этап 3.4) — обе кнопки
            теперь постоянно на виду в самой шапке, рядом с hamburger, а не
            только внутри открытого меню.

            Этап 3.6 — меню растянуто на весь оставшийся вьюпорт (100dvh
            минус высота самой шапки, та же headerHeight, что и у спейсера
            ниже), а не просто «подрастает» под контент, как раньше. Три
            причины: (1) бриф прямо просит структуру «утилити-инфо → нав →
            гибкое пространство → CTA внизу», а без явной высоты у flex-1
            между ними нечего было бы делить; (2) собственная липкая
            MobileCallBar снизу (Позвонить/Записаться) при открытом меню
            всё равно не видна — раньше меню просто заканчивалось раньше,
            чем добиралось до неё, теперь явно перекрывает её целиком (сама
            шапка на z-40, у CallBar z-30 — раньше там стоял невалидный
            z-45, который не компилировался и давал z-auto; порядок держался
            случайно, теперь задан явно), поэтому кнопка записи внутри меню — это
            не украшение, а единственный путь к брони, пока меню открыто;
            (3) overflow-y-auto на этом же контейнере — если контента
            больше, чем короткий экран может показать целиком, меню
            скроллится само, а не обрезает CTA снизу. dvh, не vh — на
            мобильных браузерах с уезжающей адресной строкой vh даёт скачок
            высоты при скролле, dvh отслеживает реальный видимый вьюпорт. */}
        {menuOpen && (
          <div
            className="lg:hidden pm-menu-anim flex flex-col overflow-y-auto border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
            style={{ height: `calc(100dvh - ${headerHeight}px)` }}
          >
            {/* Статус/часы/телефон из топбара (этап 3.5, раскладка — 3.6) —
                топбар с этой информацией виден только на десктопе (hidden
                lg:block), на мобильном её не было нигде. Не вся строка
                топбара: адрес и почта опущены — они уже есть в Contact
                ниже по странице, а это меню про навигацию, не про футер.
                Статус/часы/телефон теперь друг под другом, а не в одну
                строку — бриф прямо просил вертикальную иерархию вместо
                прежней тесноты. Плоский блок без карточки, только тонкая
                граница ниже отделяет его от навигации — та же
                isOpenNow/t.top.hours/t.status/номер, что и в топбаре и
                десктопном блоке шапки, никакой новой логики. */}
            <div className="px-4 pt-5 pb-5">
              {/* Вес статуса понижен точечной правкой (этап 3.6, коррект.) —
                  на 17px/semibold/main-ink он спорил с 21px-навигацией ниже
                  за внимание, хотя по иерархии должен быть фоновой
                  информацией, а не заголовком. 15px/medium и вторичный
                  slate-тон (тот же, что у часов под ним) — статус читается,
                  но явно уступает навигации. Точка и сам текст-лейбл
                  (не только цвет) остаются — доступность не пострадала. */}
              <div className="pm-menu-item-anim flex items-center gap-2 text-[15px] font-medium text-slate-700 dark:text-slate-300">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${open ? 'bg-green' : 'bg-amber-300'}`} />
                {open ? t.status.open : t.status.closed}
              </div>
              <div className="pm-menu-item-anim mt-1 space-y-0.5 text-sm text-slate-500 dark:text-slate-400">
                {hoursLines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <a
                href="tel:+998951956119"
                className="pm-menu-item-anim mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-primary-700 dark:text-primary-400"
              >
                <Phone size={16} />
                +998 95 195 61 19
              </a>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800" />

            {/* Навигация крупнее и с ритмом через паддинг строки (бриф
                п.10–12). Точечная правка (этап 3.6, коррект.) добавила
                divide-y поверх этого же spacing — очень низкоконтрастная
                линия (slate-200/70 и slate-800/70, тот же токен, что и у
                остальных границ в этом меню, просто с прозрачностью) только
                МЕЖДУ строками (divide-y не рисует её ни до первой, ни после
                последней) — не полноценный border у каждой строки, чтобы
                список не стал похож на таблицу. Стрелка — тот же приём
                group-hover:translate-x, что и у CTA карточек направлений
                (Directions.jsx): едет сама стрелка на пару px, не вся
                строка целиком — никакого scale/lift. */}
            <nav className="flex flex-col divide-y divide-slate-200/70 px-4 py-2 dark:divide-slate-800/70">
              {NAV_HREFS.map((href, i) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="group pm-menu-item-anim flex items-center justify-between rounded-lg py-3.5 text-[21px] font-medium leading-tight text-slate-900 transition-colors hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 active:text-primary-700 dark:text-slate-50 dark:hover:text-primary-400 dark:active:text-primary-400"
                >
                  {t.nav[i]}
                  <ChevronRight
                    size={18}
                    className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-active:translate-x-0.5 dark:text-slate-600"
                  />
                </a>
              ))}
            </nav>

            <div className="flex-1" />

            {/* Единственный крупный CTA внизу меню (бриф п.13–15) — не
                вторая пара [Позвонить]/[Записаться]: телефон уже дан выше
                контактной строкой, дублировать его кнопкой значило бы
                вернуть ту же проблему конкурирующих действий, которую уже
                убирали из Hero. onClick закрывает меню — сам href="/#booking"
                и текст (t.hero.cta1) те же, что и у основной кнопки Hero,
                никакого нового флоу записи.

                sticky bottom-0 (точечная правка, этап 3.6, коррект.) — при
                обычной высоте это ничего не меняет: flex-1 выше и так
                прижимает блок к низу панели. Разница видна только когда
                контента больше, чем короткий вьюпорт может показать целиком
                и панель уходит в scroll (overflow-y-auto на ней же) — без
                sticky кнопка раньше была обычным последним элементом и
                уезжала за экран вместе с остальным контентом, требуя
                долистать до конца. Sticky держит её у нижнего края видимой
                области меню при любом скролле внутри панели. Свой фон
                (bg-slate-50/950, тот же, что у самой панели) обязателен —
                иначе во время скролла сквозь sticky-блок будет просвечивать
                проезжающая мимо навигация. */}
            <div className="sticky bottom-0 border-t border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
              <Button href="/#booking" size="lg" className="w-full" onClick={() => setMenuOpen(false)}>
                {t.hero.cta1}
              </Button>
            </div>
          </div>
        )}
      </header>
    </div>
    {/* Шапка зафиксирована (position: fixed) — эта пара распорок в обычном
        потоке отдаёт контенту страницы место под неё. Высоты те же, что у
        самой шапки, и меняются вместе с ней, иначе при сжатии контент
        дёрнулся бы вверх скачком. */}
    <div className="hidden lg:block transition-[height] duration-300 ease-out" style={{ height: topBarHeight }} />
    <div className="transition-[height] duration-300 ease-out" style={{ height: headerHeight }} />
    </Fragment>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { DIRECTIONS } from '../data/directions.js';
import { SERVICE_CATEGORIES } from '../data/services.js';
import { useSelectedServiceList } from '../hooks/useSelectedServiceList.js';
import { useServices } from '../hooks/useServices.js';
import { useLang } from '../i18n/LangContext.jsx';
import { formatCount } from '../i18n/plural.js';
import { Button } from './ui/Button.jsx';
import { Section } from './ui/Section.jsx';

// Строка поиска с иконкой слева — не переиспользует общий Input/CONTROL из
// ui/Field.jsx через className="pl-10" поверх его собственного px-3.5: обе
// утилиты задают padding-left, и какая победит — решает порядок в
// сгенерированном Tailwind CSS, а не порядок классов в строке (та же
// грабля, что уже была с Button.jsx/shape и PhotoPlaceholder.jsx/radius в
// этом проекте). Проще и надёжнее — свой набор паддингов без пересечения:
// pl-10 здесь единственный источник padding-left, px-3.5 в CONTROL для
// сравнения вообще не участвует.
const SEARCH_CONTROL =
  'w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-800 ' +
  'placeholder:text-slate-400 transition-colors ' +
  'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 ' +
  'dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500';

// Скрывает нативный скроллбар у горизонтальной ленты категорий (этап 3.15)
// — сама лента остаётся прокручиваемой пальцем/колесом, просто без
// визуальной полосы поперёк тонкой строки вкладок. Не Tailwind-класс
// (arbitrary-variant с потомком :: не по каждому свойству отдельно
// компонуется одинаково во всех сборках) — обычный CSS надёжнее здесь.
const NO_SCROLLBAR = { scrollbarWidth: 'none', msOverflowStyle: 'none' };

// Кнопка выбора услуги — единственное место, где рождается пара состояний
// «Добавить» ⇄ «✓ Добавлено» (строка каталога). min-w — чтобы кнопка не
// «прыгала» по ширине при смене текста/появлении галочки (бриф, редизайн
// прайса, раздел «Название действия»). aria-label — из трёх разных фраз
// брифа: у ЭТОЙ кнопки (переключатель прямо в каталоге) при выбранном
// состоянии это «Убрать услугу ... из выбранных» — отдельная формулировка
// от «Удалить услугу ...», которая живёт у крестиков в панелях сводки
// (там это однозначно «удалить строку из списка», а не «снять выбор»).
function ServiceToggleButton({ svc, selected, onToggle, addLabel, addAria, unselectAria }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(svc)}
      aria-pressed={selected}
      aria-label={(selected ? unselectAria : addAria).replace('{name}', svc.name)}
      className={`inline-flex h-11 min-w-[110px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors ${
        selected
          ? 'border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300 dark:hover:bg-primary-950/70'
          : 'border-slate-300 text-slate-700 hover:border-primary-400 hover:text-primary-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-primary-500 dark:hover:text-primary-200'
      }`}
    >
      {selected && <Check size={15} strokeWidth={2.5} aria-hidden="true" />}
      {selected ? addLabel.added : addLabel.add}
    </button>
  );
}

// Этап 3.13–3.15 — от сетки карточек-заглушек к обычному вертикальному
// каталогу услуг (3.13), затем к выбору с переключателем и панелью «Ваш
// визит» (3.14), затем к полноценному редизайну композиции: одна
// прокручиваемая строка категорий вместо переноса на три строки, строка
// услуги перестроена под мобильный (имя/описание сверху, цена+кнопка одной
// строкой снизу — не втроём в одну тесную строку), на десктопе — честная
// 3-колоночная сетка вместо текстовой ссылки у самого края экрана, и
// отдельная компактная закреплённая панель выбора (изначально была только
// на мобильном, заменяя собой общую MobileCallBar, пока пользователь у
// прайса — см. комментарий у onMobileBarStateChange ниже и у App.jsx/
// Page()). Этап 3.16 (коррект.) снял с этой панели ограничение lg:hidden —
// см. отдельный комментарий прямо над её JSX ниже, почему.
//
// selectedIds/onToggleService/onClearSelected — пропсы из App.jsx (Page()),
// единый источник состояния и для этой секции, и для BookingForm.jsx (см.
// комментарий там же и в hooks/useSelectedServices.js про то, почему это
// пропсы, а не React Context). Значения по умолчанию — чтобы секция
// оставалась самодостаточной в изолированном превью дизайн-системы.
export function Prices({
  selectedIds = [],
  onToggleService = () => {},
  onClearSelected = () => {},
  onMobileBarStateChange = () => {},
  // Этап 3.17: раньше был один bookingInView (форма записи в кадре). После
  // разъезда нижней части страницы на три отдельные секции (см. App.jsx)
  // причин спрятать панель стало две — форма записи (BookingSection.jsx)
  // И карта (MapSection.jsx, там кнопки «Построить маршрут»/«Вызвать
  // такси» — панель не должна их перекрывать). App.jsx уже объединяет оба
  // условия в один булев проп, здесь достаточно одного имени.
  cartBarSuppressed = false,
}) {
  const { t, lang } = useLang();
  const services = useServices();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [announcement, setAnnouncement] = useState('');
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  // Секция «сейчас в кадре» — используется для двух РАЗНЫХ вещей, и они не
  // должны были жить в одном булевом (это и была причина бага ниже):
  // 1) FAB чата закрывает нижний правый угол строк прайса, пока прайс в
  //    кадре, — независимо от того, выбрано что-то или нет (см. эффект
  //    ниже, onMobileBarStateChange({inSection})).
  // 2) Раньше на этом же значении держалась видимость закреплённой панели
  //    «Ваш визит» (mobileBarActive ниже) — из-за чего панель пропадала,
  //    как только прайс уходил из кадра, даже если выбор оставался. Живой
  //    баг-репорт: «если выйти за пределы с выбранными услугами, бар
  //    пропадает — человек может полистать вверх/вниз и захочет вернуться
  //    к записи, не листая обратно к прайсу». Теперь mobileBarActive
  //    зависит только от наличия выбора (см. ниже) — pricesInView здесь
  //    остаётся только ради (1). threshold: 0 — «хоть что-то от секции
  //    видно», не «секция целиком в кадре»: прайс обычно выше вьюпорта
  //    высотой, полного попадания и не бывает.
  const [pricesInView, setPricesInView] = useState(false);
  const { list: selectedList } = useSelectedServiceList(selectedIds);
  // Левый fade ленты категорий (этап полировки 6.2) — виден только когда
  // реально есть что скроллить влево (scrollLeft > 0), иначе висел бы
  // бессмысленным затемнением поверх самой первой вкладки. Правый fade
  // (ниже) остаётся безусловным — он уже был и сам по себе корректно
  // сигналит «есть что прокрутить вправо» на любой ширине списка категорий.
  const [showLeftFade, setShowLeftFade] = useState(false);

  const sectionRef = useRef(null);
  const stripRef = useRef(null);
  const tabRefs = useRef({});

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => setPricesInView(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Видна, пока есть хоть одна выбранная услуга — вне зависимости от того,
  // какая секция сейчас в кадре (см. комментарий у pricesInView выше).
  // Исключение — cartBarSuppressed (проп из App.jsx/Page(), см. комментарий
  // там же, у BookingSection.jsx и MapSection.jsx): пока в кадре форма
  // записи, «Перейти к записи» указывал бы туда же, где пользователь уже
  // находится, а панель легла бы поверх кнопки «Отправить»; пока в кадре
  // карта — поверх кнопок «Построить маршрут»/«Вызвать такси».
  const mobileBarActive = selectedList.length > 0 && !cartBarSuppressed;
  useEffect(() => {
    // inSection — независимо от того, есть ли выбор: пока лента категорий
    // (или любая другая строка прайса у правого края экрана) проходит
    // через ту же зону экрана, где на мобильном постоянно сидит FAB чата
    // (position: fixed, bottom: 92px в index.css), кнопки под ним физически
    // не нажимаются — сам факт нашёлся на глаз при проверке брифа
    // («Проверить... чат не закрывает кнопки прайса»), а не только для
    // уже раскрытой панели выбора. active/expanded — то же, что и раньше,
    // управляют только нижней CTA-панелью (MobileCallBar ⇄ панель прайса).
    onMobileBarStateChange({ inSection: pricesInView, active: mobileBarActive, expanded: mobileBarActive && mobileCartOpen });
    // Закрываем раскрытую панель, как только она перестаёт быть активной
    // (выбор опустел или пользователь долистал до формы записи) — иначе
    // при следующем появлении панели пользователь увидел бы её уже
    // раскрытой без своего участия.
    if (!mobileBarActive && mobileCartOpen) setMobileCartOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pricesInView, mobileBarActive]);

  // Активная вкладка остаётся видимой в прокручиваемой ленте (бриф,
  // «после выбора категории активная вкладка должна автоматически
  // оставаться видимой») — центрируем её по горизонтали внутри ленты,
  // block: 'nearest' — чтобы сам scrollIntoView не попытался ещё и
  // проскроллить страницу по вертикали в поисках элемента.
  useEffect(() => {
    tabRefs.current[category]?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [category]);

  // showLeftFade — этап полировки 6.2. onScroll на самой ленте (не window):
  // прокрутка ленты — собственный scrollLeft этого div, а не документа.
  // Проверка сразу при монтировании тоже нужна — если лента изначально уже
  // не в начале (например, восстановленная позиция), fade должен появиться
  // без первого скролл-события.
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return undefined;
    const onScroll = () => setShowLeftFade(el.scrollLeft > 0);
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Подтверждение для скринридера считается по факту изменившейся длины
  // selectedIds ПОСЛЕ ререндера (эффект), а не сразу внутри обработчика
  // клика по «текущему» selectedIds — тот всё ещё указывает на массив ДО
  // this клика (React обновляет состояние асинхронно), и при двух кликах
  // подряд без ререндера между ними оба обработчика прочитали бы одну и ту
  // же устаревшую длину. pendingRef — чтобы не озвучивать сюда же чужое
  // изменение (например, удаление услуги прямо в BookingForm.jsx, который
  // получает тот же selectedIds и смонтирован на той же странице): эффект
  // реагирует только на те смены длины, которые сам же инициировал клик в
  // ЭТОМ компоненте.
  const prevCountRef = useRef(selectedIds.length);
  const pendingAnnounceRef = useRef(false);

  useEffect(() => {
    const prevCount = prevCountRef.current;
    const nextCount = selectedIds.length;
    if (pendingAnnounceRef.current && nextCount !== prevCount) {
      if (nextCount === 0) {
        setAnnouncement(t.price.liveClearedAll);
      } else if (nextCount > prevCount) {
        setAnnouncement(t.price.liveAdded.replace('{n}', nextCount).replace('{word}', formatCount(nextCount, t.price.unitWord, lang)));
      } else {
        setAnnouncement(t.price.liveRemoved.replace('{n}', nextCount).replace('{word}', formatCount(nextCount, t.price.unitWord, lang)));
      }
    }
    pendingAnnounceRef.current = false;
    prevCountRef.current = nextCount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds]);

  const handleToggle = (svc) => {
    pendingAnnounceRef.current = true;
    onToggleService(svc.id);
  };

  const handleClear = () => {
    pendingAnnounceRef.current = true;
    onClearSelected();
  };

  const categoryLabel = (id) => {
    if (id === 'all') return t.price.tabAll;
    const i = DIRECTIONS.findIndex((d) => d.id === id);
    return t.dir[`d${i + 1}t`];
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      if (category !== 'all' && s.categoryId !== category) return false;
      if (!q) return true;
      return s.name.toLowerCase().includes(q) || (s.desc?.toLowerCase().includes(q) ?? false);
    });
  }, [services, query, category]);

  // Группировка — всегда по DIRECTIONS (порядок направлений на сайте), а не
  // по порядку появления в filtered: так вкладка «Все» и поиск, задевающий
  // сразу несколько категорий, не меняют порядок секций местами.
  const groups = useMemo(() => (
    DIRECTIONS
      .map((dir, i) => ({
        id: dir.id,
        title: t.dir[`d${i + 1}t`],
        items: filtered.filter((s) => s.categoryId === dir.id).sort((a, b) => a.sortOrder - b.sortOrder),
      }))
      .filter((g) => g.items.length > 0)
  ), [filtered, t]);

  const resetSearch = () => { setQuery(''); setCategory('all'); };
  const addLabel = { add: t.price.addToVisit, added: t.price.added };

  return (
    <Section id="prices" tone="raised" className="overflow-x-hidden">
      <div ref={sectionRef}>
      {/* Подтверждение для скринридера — «ненавязчивое» в буквальном смысле:
          у зрячего пользователя обратная связь и так есть (кнопка меняет
          вид на «Добавлено», ниже появляется/обновляется панель выбора),
          отдельный всплывающий тост поверх этого был бы избыточен и не
          вписался бы в спокойную эстетику раздела. aria-live покрывает то,
          что зрячая обратная связь не покрывает — подтверждение для тех,
          кто визуальных изменений не видит. */}
      <div aria-live="polite" className="sr-only">{announcement}</div>

      {/* Якорь #prices не прячет заголовок под фиксированной шапкой без
          дополнительного кода: html{scroll-padding-top:84px} в index.css
          уже покрывает любой якорь на сайте, этот в том числе. */}
      <div className="max-w-2xl mb-8">
        <p className="text-sm font-medium text-slate-600 tracking-[0.08em] mb-3 dark:text-slate-400">{t.price.eyebrow}</p>
        <h2 className="font-display text-[32px] sm:text-[42px] lg:text-[50px] leading-[1.05] text-slate-900 text-balance dark:text-slate-50">{t.price.title}</h2>
        <p className="text-slate-500 mt-3 dark:text-slate-400">{t.price.desc}</p>
      </div>

      <div className="relative mb-8 max-w-md">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.price.searchPh}
          className={SEARCH_CONTROL}
        />
      </div>

      {/* Лента категорий — этап 3.15. Одна строка ВСЕГДА (никакого
          flex-wrap ни на одной ширине — раньше пять подписей переносились
          на 2–3 строки и читались как случайный список ссылок), при
          нехватке места лента просто скроллится по горизонтали пальцем —
          тот же приём работает и на десктопе (там обычно скроллить не
          приходится, ширины хватает, но реализация одна на все размеры,
          а не две параллельные). Лёгкий градиент справа — подсказка «здесь
          есть что прокрутить», не мешает восприятию активной вкладки.
          overflow-x-hidden на самой Section (см. проп className выше) —
          подстраховка: если по любой причине лента всё же станет шире
          своего контейнера, не потянет за собой горизонтальный скролл
          страницы целиком (тот же приём, что уже был у Doctors.jsx). */}
      <div className="relative mb-8">
        <div
          ref={stripRef}
          className="flex gap-6 overflow-x-auto border-b border-slate-200 dark:border-slate-800 [&::-webkit-scrollbar]:hidden"
          style={NO_SCROLLBAR}
        >
          {SERVICE_CATEGORIES.map((id) => {
            const isActive = category === id;
            const shortLabel = id !== 'all' ? t.price.tabShort[id] : null;
            const fullLabel = categoryLabel(id);
            return (
              <button
                key={id}
                ref={(el) => { tabRefs.current[id] = el; }}
                type="button"
                onClick={() => setCategory(id)}
                aria-current={isActive}
                aria-label={shortLabel ? fullLabel : undefined}
                className={`flex h-11 shrink-0 items-center border-b-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-primary-600 text-slate-900 dark:border-primary-400 dark:text-slate-50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                {shortLabel ? (
                  <>
                    <span className="sm:hidden" aria-hidden="true">{shortLabel}</span>
                    <span className="hidden sm:inline" aria-hidden="true">{fullLabel}</span>
                  </>
                ) : fullLabel}
              </button>
            );
          })}
        </div>
        {showLeftFade && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-slate-950" aria-hidden="true" />
        )}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-slate-950" aria-hidden="true" />
      </div>

      <div className="max-w-[1080px]">
        {groups.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-800 font-medium mb-1.5 dark:text-slate-100">{t.price.emptyTitle}</p>
            <p className="text-sm text-slate-500 mb-5 dark:text-slate-400">{t.price.emptyDesc}</p>
            {(query.trim() || category !== 'all') && (
              <button
                type="button"
                onClick={resetSearch}
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-primary-400 hover:text-primary-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-primary-500 dark:hover:text-primary-200"
              >
                {t.price.searchReset}
              </button>
            )}
          </div>
        ) : (
          <div className="reveal-stagger">
            {groups.map((group) => (
              // pt-8, не pt-10 (этап полировки 6.1, −20%) — восемь услуг на
              // desktop давали секции лишнюю высоту, брифом требуемое
              // сокращение вертикальных интервалов на 20–25%.
              <div key={group.id} className="pt-8 first:pt-0">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  {/* text-slate-600/300, не 500/400 — усиленный category
                      header (этап 6.1), тот же WCAG-повод, что и в Reviews/
                      ContactInfo: 500/400 на белой/тёмной поверхности не
                      дотягивает до 4.5:1 у обычного текста. */}
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">{group.title}</h3>
                  <span className="shrink-0 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {group.items.length} {formatCount(group.items.length, t.price.unitWord, lang)}
                  </span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/70">
                  {/* lg:grid — на мобильном/планшете обычный блок: имя+
                      описание одной строкой сверху, затем строка «цена +
                      кнопка» (см. lg:contents у обёртки ниже). На lg+ те же
                      три узла становятся тремя колонками сетки одной строки.
                      minmax(140px,auto)/minmax(120px,auto) — фиксированные
                      по смыслу колонки цены и действия не сжимаются
                      бесконечно и не разъезжаются на разных строках. */}
                  {group.items.map((svc) => (
                    // py-3, не py-4 (этап полировки 6.1, −25%) — та же
                    // цель плотности, что и у group→pt-8 выше.
                    <div
                      key={svc.id}
                      className="min-w-0 py-3 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(140px,auto)_minmax(120px,auto)] lg:items-center lg:gap-x-6"
                    >
                      <div className="min-w-0">
                        <p className="text-[15px] font-medium text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100">{svc.name}</p>
                        {svc.desc && (
                          <p className="mt-1 text-sm text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">{svc.desc}</p>
                        )}
                      </div>
                      {/* flex здесь = мобильная строка «цена + кнопка»
                          (одна строка, не тесно втроём с названием — бриф
                          «Не размещай цену и «В визит» сразу после названия
                          в одной текстовой строке»). lg:contents растворяет
                          этот div на десктопе — его дети становятся
                          колонками 2 и 3 сетки-родителя напрямую, вместо
                          того чтобы сидеть вложенными в одну ячейку. */}
                      <div className="mt-3 flex min-w-0 items-center justify-between gap-4 lg:contents">
                        {/* Раньше здесь был truncate (nowrap + многоточие) —
                            при узком экране (320 px) и длинном тексте
                            «уточняйте у администратора» (t.price.val,
                            data/services.js) цена обрезалась многоточием и
                            была нечитаема. min-w-0 остаётся (строка —
                            flex-элемент, без него она не сможет сжаться
                            меньше своего однострочного контента и вытолкнет
                            кнопку), но теперь при нехватке места текст
                            переносится на вторую строку целиком, а не
                            обрезается. */}
                        <span
                          className={`min-w-0 text-[15px] lg:text-right ${
                            svc.price == null
                              ? 'text-slate-500 dark:text-slate-400'
                              : 'font-semibold text-slate-900 dark:text-slate-50'
                          }`}
                        >
                          {svc.priceLabel}
                        </span>
                        <div className="shrink-0 lg:flex lg:justify-end">
                          <ServiceToggleButton
                            svc={svc}
                            selected={selectedIds.includes(svc.id)}
                            onToggle={handleToggle}
                            addLabel={addLabel}
                            addAria={t.price.addAria}
                            unselectAria={t.price.unselectAria}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Закреплённая нижняя панель «Ваш визит» — этап 3.16 (коррект.).
          Раньше это была ДВЕ разные реализации одного и того же состояния:
          эта компактная fixed-панель (lg:hidden — только мобильный) и
          отдельная большая плашка-сводка прямо в потоке прайса (десктоп/
          планшет). Плашка-в-потоке и была источником P1-бага «скачок
          страницы после добавления услуги» (см. историю коммита) — её
          вставка/ресайз выше текущей позиции пользователя двигала контент,
          браузер компенсировал scrollY, страница «прыгала». У неё был и
          второй недостаток, отдельно от бага: на длинном прайсе она видна
          только у самого верха секции — пролистав вниз, пользователь её не
          видит и не может быстро проверить список выбранного.
          Правильное решение — не чинить плашку, а убрать её: одна и та же
          компактная fixed-панель (раньше — только мобильная) теперь работает
          на всех ширинах. У неё уже был весь нужный набор свойств —
          position: fixed (не часть потока документа, добавление/удаление
          услуги и раскрытие списка физически не могут сдвинуть scrollY),
          счётчик, «Перейти к записи» и раскрывающийся список с удалением
          построчно и «Очистить». lg:hidden убран, остальное — без
          структурных изменений. mx-auto max-w-[1080px] на содержимом — та же
          ширина, что у самого списка услуг выше, чтобы панель не читалась
          на широких экранах как во всю ширину вьюпорта растянутая строка.
          Условие показа — mobileBarActive (см. определение выше): только
          selectedList.length > 0, БЕЗ pricesInView — панель больше не
          пропадает, стоит уйти из кадра прайса (второй баг-репорт, см.
          комментарий у pricesInView). safe-area-inset-bottom — нижняя
          безопасная зона на телефонах с «чёлкой»/жестовой полосой снизу. */}
      {/* lg:-оверрайды (этап полировки 6.3) — на ≥1024px это больше не
          full-bleed бар во всю ширину окна: компактная плавающая карточка
          420px, низ-центр (inset-x-0 + mx-auto с явной шириной центрирует
          fixed-элемент так же, как absolute). Низ-центр — сознательный
          выбор из трёх кандидатов (низ-лево/низ-центр/низ-право): чат
          плавает справа (right:12–20px, см. index.css/ChatWidget.jsx), а
          «Наверх» слева (left:20px, ScrollUi.jsx) — центр не пересекается
          ни с одним из них ни при какой ширине, без необходимости знать их
          точные координаты заранее. Мобильная full-bleed версия (<1024px)
          не трогается — только lg:-классы добавлены поверх. */}
      {mobileBarActive && (
        <div
          className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:inset-x-0 lg:mx-auto lg:bottom-6 lg:w-[420px] lg:rounded-2xl lg:border lg:shadow-card lg:dark:border-slate-700"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {!mobileCartOpen ? (
            <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
              <button
                type="button"
                onClick={() => setMobileCartOpen(true)}
                aria-expanded={false}
                aria-controls="pm-price-cart-panel"
                aria-label={t.price.cartExpand}
                // min-w-0 — без него flex-1 не давал кнопке сжаться меньше
                // собственного «естественного» content-based минимума (в
                // ряду с CTA справа так и было: на 320 px их суммарная
                // ширина превышала контейнер, и «Перейти к записи» вылезал
                // за край экрана — truncate у внутреннего span тут ни при
                // чём, он ограничивает только сам span, а не родителя-flex-
                // item). С min-w-0 кнопка может сжаться, и укорачивается
                // текст внутри (span ниже), а не сама кнопка/CTA.
                className="-my-2.5 flex h-11 min-w-0 flex-1 items-center gap-1.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-50"
              >
                <span className="min-w-0 truncate">
                  {t.price.cartBarLabel}: {selectedList.length} {formatCount(selectedList.length, t.price.unitWord, lang)}
                </span>
                <ChevronDown size={16} className="shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
              </button>
              {/* Короткая формулировка (t.price.toBooking, «К записи» — уже
                  была в словаре под всеми 4 языками, просто нигде не
                  использовалась). В свёрнутой строке рядом с ней сидит
                  счётчик выбранного — это именно то число, которое должно
                  быть видно в первую очередь. При полной «Перейти к
                  записи» на 320 px счётчику не хватало места и обрезалось
                  само число (проверено: «Выбрано: …» без цифры вообще). В
                  развёрнутой панели ниже своя строка с CTA — там места
                  достаточно, там остаётся полная формулировка. */}
              <Button href="/#booking" size="sm" className="shrink-0">{t.price.toBooking}</Button>
            </div>
          ) : (
            <div id="pm-price-cart-panel" className="mx-auto flex max-h-[65vh] max-w-[1080px] flex-col">
              <div className="flex shrink-0 items-center justify-between gap-3 px-4 pt-3 pb-2 sm:px-6">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{t.form.bookingTitleServices}</p>
                <button
                  type="button"
                  onClick={() => setMobileCartOpen(false)}
                  aria-expanded={true}
                  aria-controls="pm-price-cart-panel"
                  aria-label={t.price.cartCollapse}
                  className="-m-2.5 flex h-11 w-11 items-center justify-center text-slate-400 dark:text-slate-500"
                >
                  <ChevronDown size={18} className="rotate-180" aria-hidden="true" />
                </button>
              </div>
              <ul className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
                {selectedList.map((svc) => (
                  <li key={svc.id} className="flex min-w-0 items-start justify-between gap-3 border-t border-slate-100 py-2.5 first:border-t-0 dark:border-slate-800/70">
                    <span className="line-clamp-2 min-w-0 flex-1 text-sm text-slate-700 [overflow-wrap:anywhere] dark:text-slate-200">
                      {svc.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggle(svc)}
                      aria-label={t.price.removeAria.replace('{name}', svc.name)}
                      className="-m-2.5 flex h-11 w-11 shrink-0 items-center justify-center text-slate-400 dark:text-slate-400"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:px-6 dark:border-slate-800">
                <button type="button" onClick={handleClear} className="h-11 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t.price.clear}
                </button>
                <Button href="/#booking" size="sm">{t.price.goToBooking}</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}

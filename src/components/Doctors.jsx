import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDoctors } from '../hooks/useDoctors.js';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { PhotoPlaceholder } from './PhotoPlaceholder.jsx';
import { SplitSectionHeader } from './ui/Section.jsx';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/a11y';

// Этап 3.12 — Doctors перестроена из статичной сетки 2×2 в горизонтальный
// Swiper карточек-превью, каждая из которых ссылается на настоящую страницу
// врача (/doctors/:slug, см. DoctorPage.jsx и роутинг в App.jsx). Первая
// версия этого этапа открывала профиль модальным окном поверх секции — по
// прямой правке было решено, что профиль обязан быть страницей со своим
// адресом: только так на конкретного врача можно прислать ссылку. Модальная
// обвязка (диалог/фокус-трап/Escape) удалена, контент профиля остался —
// он теперь целиком живёт в DoctorProfileContent.jsx и рендерится
// DoctorPage.jsx.
//
// Прежняя сетка одинаково крупно показывала все четыре плейсхолдера сразу —
// при реальных данных CRM это не масштабируется (десятый врач просто не
// поместится в сетку 2×2). Swiper с частично видимой следующей карточкой
// сам подсказывает «здесь больше одного».
//
// Композиция header-ряда (eyebrow+заголовок слева / intro справа на lg,
// nav-стрелки у заголовка, не поверх лиц) — тот же приём, что в About
// (Stage 3.10) и Timeline: Section не используется — как и там, нужен свой
// компактный header-ряд с местом под стрелки навигации, а не
// центрированный SectionHeader.
export function Doctors({ onOpenDoctor }) {
  const { t } = useLang();
  const { ref: sectionRef, className: revealClass } = useReveal();
  const swiperRef = useRef(null);
  const doctors = useDoctors();
  const [activeIndex, setActiveIndex] = useState(0);

  // Карточка — настоящая ссылка (<a href="/doctors/slug">), не <button> с
  // onClick: так работают правый клик «Копировать адрес ссылки», Ctrl/Cmd+
  // клик «открыть в новой вкладке» и просмотр адреса в статус-баре при
  // наведении — то, что пациент естественно ожидает от «поделиться врачом».
  // SPA-переход (без перезагрузки страницы) — только на простой клик левой
  // кнопкой без модификаторов; во всех остальных случаях предотвращаем
  // preventDefault, чтобы браузер сам открыл ссылку как обычно.
  const handleCardClick = (e, routeSlug) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onOpenDoctor?.(routeSlug);
  };

  return (
    <div className="bg-white border-y border-slate-200 dark:bg-slate-950 dark:border-slate-800">
      <section
        id="doctors"
        ref={sectionRef}
        // overflow-x-hidden — обязателен именно здесь, а не только на самом
        // Swiper. На мобильном Swiper нарочно !overflow-visible (следующая
        // карточка выглядывает за край экрана, эффект «есть ещё карточки»),
        // но у pm-container нет собственного overflow — это просто
        // max-width/центрирование. Без обрезки на уровне секции этот
        // «выглядывающий» хвост карточек раздувал ширину всего документа
        // (шапка и мобильная панель звонка — fixed inset-x-0 — в реальных
        // мобильных браузерах раздуваются вместе с ним, а не остаются
        // прижатыми к экрану). Секция — правильная граница для обрезки:
        // ровно край экрана, тот же эффект peek, но не дальше.
        className={`${revealClass} overflow-x-hidden pm-container px-4 sm:px-6 py-10 sm:py-12`}
      >
        {/* Общий SplitSectionHeader (этап полировки 1.1/3.3) — раньше
            собирался вручную, своим flex+grid, с mb-7(28px) до карточек
            (диапазон брифа 40–64) — теперь mb-12(48px) и общая с About/
            Timeline вёрстка заголовка. Стрелки идут в actions — тот же
            flex-wrap ряд, что и описание: на широком десктопе рядом с
            текстом, при нехватке ширины (граничные ~1024–1120px) сами
            переносятся под него, не сжимая описание. */}
        <SplitSectionHeader
          eyebrow={t.doc.eyebrow}
          title={t.doc.title}
          className="mb-9 sm:mb-10"
        />

        {/* slidesPerView="auto" — ширина карточки задаётся ей самой
            (Tailwind-классы на слайде ниже), а не вычисляется из дробного
            slidesPerView. Первая версия задавала общий вид через дробный
            slidesPerView (2.6 карточки на контейнер) при фиксированной
            высоте фото — на деле это означало «ширина = контейнер / 2.6»,
            а не «ширина ~300px», и на широких контейнерах карточка выходила
            почти квадратной (410×360). auto отвязывает ширину карточки от
            ширины контейнера: карточка остаётся ~300–320px при любой
            ширине секции, а сколько их видно — уже следствие, не цель. */}
        <Swiper
          modules={[Keyboard, A11y]}
          onSwiper={(swiper) => { swiperRef.current = swiper; }}
          keyboard={{ enabled: true }}
          a11y={{ prevSlideMessage: t.doc.prev, nextSlideMessage: t.doc.next }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          slidesPerView="auto"
          spaceBetween={20}
          breakpoints={{
            640: { spaceBetween: 20 },
            1024: { spaceBetween: 24 },
            1440: { spaceBetween: 28 },
          }}
          className="reveal-stagger !overflow-visible sm:!overflow-hidden"
        >
          {doctors.map((doctor) => {
            const displayName = doctor.name ?? doctor.directionTitle;
            const secondaryLine = doctor.name ? doctor.factLine : null;
            return (
              <SwiperSlide key={doctor.id} className="!w-[78vw] !h-auto sm:!w-[300px] lg:!w-[320px]">
                <a
                  href={`/doctors/${doctor.routeSlug}`}
                  onClick={(e) => handleCardClick(e, doctor.routeSlug)}
                  className="group block w-full text-left focus-visible:outline-none"
                >
                  <PhotoPlaceholder
                    label={t.doc.photo}
                    radius="rounded-2xl"
                    className="aspect-[4/5] w-full mb-3 transition-shadow group-focus-visible:ring-2 group-focus-visible:ring-primary-500 group-focus-visible:ring-offset-2"
                  />
                  {/* Специальность мелко и приглушённо сверху — только у
                      реального врача (роль без имени рядом ничего не
                      объясняет). ФИО крупнее и жирнее под ней. У
                      плейсхолдера вместо этой пары — просто название
                      направления: второй строки-специализации у него нет,
                      выдумывать нечего. */}
                  {doctor.name && (
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{doctor.role}</p>
                  )}
                  <p className="text-[15px] font-semibold text-slate-900 mt-0.5 dark:text-slate-50">{displayName}</p>
                  {secondaryLine && (
                    <p className="text-sm text-slate-500 mt-0.5 dark:text-slate-400">{secondaryLine}</p>
                  )}
                  <span className="mt-2 inline-flex items-center text-sm font-medium text-primary-600 group-hover:underline dark:text-primary-300">
                    {t.doc.more} →
                  </span>
                </a>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {doctors.length > 1 && (
          <div className="mt-7 flex items-center justify-end gap-4 border-t border-slate-200 pt-5 dark:border-slate-800">
            <p className="text-xs font-medium tracking-[0.08em] text-slate-500 dark:text-slate-400">
              {String(activeIndex + 1).padStart(2, '0')} / {String(doctors.length).padStart(2, '0')}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={t.doc.prev}
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={activeIndex === 0}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-colors hover:border-primary-400 hover:text-primary-700 disabled:cursor-default disabled:opacity-30 dark:border-slate-600 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-300"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                aria-label={t.doc.next}
                onClick={() => swiperRef.current?.slideNext()}
                disabled={activeIndex >= doctors.length - 1}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-colors hover:border-primary-400 hover:text-primary-700 disabled:cursor-default disabled:opacity-30 dark:border-slate-600 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-300"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

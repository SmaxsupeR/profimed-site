import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDoctors } from '../hooks/useDoctors.js';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { PhotoPlaceholder } from './PhotoPlaceholder.jsx';
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
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const doctors = useDoctors();

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
        className={`${revealClass} pm-container px-4 sm:px-6 py-10 sm:py-12`}
      >
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="grid gap-4 lg:flex-1 lg:grid-cols-[9fr_11fr] lg:items-start lg:gap-12">
            <div>
              <p className="text-sm font-medium text-slate-600 tracking-[0.08em] mb-2 dark:text-slate-400">{t.doc.eyebrow}</p>
              <h2 className="font-display text-slate-900 text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] text-balance dark:text-slate-50">
                {t.doc.title}
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed lg:max-w-[480px] dark:text-slate-300">{t.doc.desc}</p>
          </div>

          {/* Стрелки у заголовка, не поверх лиц врачей — и только от sm:
              на телефоне вести пальцем естественнее, чем целиться в
              кнопку 28×28px. */}
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button
              ref={prevRef}
              type="button"
              aria-label={t.doc.prev}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-colors hover:border-primary-400 hover:text-primary-700 disabled:opacity-30 dark:border-slate-600 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-400"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              ref={nextRef}
              type="button"
              aria-label={t.doc.next}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-colors hover:border-primary-400 hover:text-primary-700 disabled:opacity-30 dark:border-slate-600 dark:text-slate-300 dark:hover:border-primary-500 dark:hover:text-primary-400"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

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
          modules={[Navigation, Keyboard, A11y]}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          keyboard={{ enabled: true }}
          a11y={{ prevSlideMessage: t.doc.prev, nextSlideMessage: t.doc.next }}
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
            const secondaryLine = doctor.name ? doctor.factLine : t.doc.note;
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
                  <span className="mt-2 inline-flex items-center text-sm font-medium text-primary-600 group-hover:underline dark:text-primary-400">
                    {t.doc.more} →
                  </span>
                </a>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>
    </div>
  );
}

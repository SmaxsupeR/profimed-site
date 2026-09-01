import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { PhotoPlaceholder } from './PhotoPlaceholder.jsx';
import { SplitSectionHeader } from './ui/Section.jsx';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/a11y';

// Этап 3.10 — вторая перестройка About. Версия 3.9 (фото слева 40% + текст
// справа 60%) структурно повторяла Laser (визуал слева, eyebrow/заголовок/
// текст справа) — при разных цветах это была та же композиционная грамматика,
// и About читался как «ещё один Laser, только светлый». Разница должна быть
// в композиции, не в перекраске: теперь секция построена вертикально —
// редакционная шапка (заголовок + интро в строку) → широкая горизонтальная
// галерея на всю ширину контейнера → компактные факты. Двухколоночная
// раскладка [фото][текст] больше не используется вообще.
//
// Реальных фото клиники в проекте нет (в site/src/assets — только hero.jpg,
// уже занят в Hero, см. историю Laser.jsx). Плейсхолдеры честные — тот же
// PhotoPlaceholder с иконкой камеры, что и раньше, просто их теперь три,
// с разными подписями по брифу (фасад/ресепшен/оборудование), а не шесть
// одинаковых слайдов ради демонстрации карусели. Массив подписей — это и
// есть структура для будущих реальных фото: добавить фото позже — значит
// заменить PhotoPlaceholder на <img> в SwiperSlide, порядок и подписи не
// меняются.
const GALLERY_KEYS = ['g1', 'g2', 'g3'];

export function About() {
  const { t } = useLang();
  const { ref: sectionRef, className: revealClass } = useReveal();
  const equip = [t.equip.e1, t.equip.e2, t.equip.e3, t.equip.e4];
  const slides = GALLERY_KEYS.map((key) => t.about.gallery[key]);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="bg-primary-50 border-y border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
      <section
        id="about"
        ref={sectionRef}
        className={`${revealClass} pm-container px-4 sm:px-6 py-10 sm:py-12`}
      >
        {/* Общий SplitSectionHeader (этап полировки 1.1/3.4) — та же
            вёрстка, что теперь у Doctors/Timeline, вместо собственной
            копии. mb-16(64px), не mb-7(28px) — «шапка → галерея» из
            требуемых брифом 48–72px. */}
        <SplitSectionHeader
          eyebrow={t.about.eyebrow}
          title={t.about.title.map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
          description={t.about.intro}
          className="mb-8 border-b border-slate-200 pb-8 dark:border-slate-700"
        />

        {/* Полная ширина контейнера с управляемой высотой. Нельзя сочетать
            aspect-ratio с max-height: на широких экранах браузер переносит
            ограничение высоты на ширину и оставляет справа пустую колонку. */}
        <div className="relative mb-2 h-[280px] w-full overflow-hidden rounded-[28px] sm:h-[340px] lg:h-[420px]">
          <Swiper
            modules={[Navigation, Keyboard, A11y]}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            keyboard={{ enabled: true }}
            a11y={{ prevSlideMessage: t.about.galleryPrev, nextSlideMessage: t.about.galleryNext }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="h-full w-full"
          >
            {slides.map((caption, i) => (
              <SwiperSlide key={i}>
                <PhotoPlaceholder label={caption} className="h-full w-full rounded-none" />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Контролы — не поверх всего слайда, компактная плашка снизу:
              подпись слева, дробь + стрелки справа. Без точек-пагинации на
              всю ширину, без больших круглых кнопок. Скрыто целиком, если
              слайд один — по брифу. */}
          {slides.length > 1 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-3 p-3 sm:p-4">
              <span className="pointer-events-none rounded-full bg-slate-900/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {slides[activeIndex]}
              </span>
              <div className="pointer-events-auto flex items-center gap-2">
                <span className="rounded-full bg-slate-900/55 px-2 py-1 text-xs font-medium tabular-nums text-white backdrop-blur-sm">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
                <button
                  ref={prevRef}
                  type="button"
                  aria-label={t.about.galleryPrev}
                  // relative + before:absolute — тач-зона 44×44 (бриф, п.
                  // «Размер сенсорных зон») без увеличения самой видимой
                  // кнопки: плашка над фото компактная нарочно (бриф той же
                  // секции запрещает «визуально тяжёлый» интерфейс), а
                  // псевдоэлемент растягивает только зону клика/тапа за
                  // пределы видимого кружка, не влияя на layout соседей
                  // (position: absolute не участвует в потоке).
                  className="relative flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/55 text-white backdrop-blur-sm transition-colors before:absolute before:-inset-2 before:content-[''] hover:bg-slate-900/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <ChevronLeft size={14} strokeWidth={2} />
                </button>
                <button
                  ref={nextRef}
                  type="button"
                  aria-label={t.about.galleryNext}
                  // relative + before:absolute — тач-зона 44×44 (бриф, п.
                  // «Размер сенсорных зон») без увеличения самой видимой
                  // кнопки: плашка над фото компактная нарочно (бриф той же
                  // секции запрещает «визуально тяжёлый» интерфейс), а
                  // псевдоэлемент растягивает только зону клика/тапа за
                  // пределы видимого кружка, не влияя на layout соседей
                  // (position: absolute не участвует в потоке).
                  className="relative flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/55 text-white backdrop-blur-sm transition-colors before:absolute before:-inset-2 before:content-[''] hover:bg-slate-900/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  <ChevronRight size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Факты — один border-t сверху вместо карточек, две колонки на
            sm+. Только два факта, третьего (логика записи) больше нет —
            это уже рассказывает Timeline. */}
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5 border-t border-slate-200 pt-8 dark:border-slate-700">
          <div>
            <h3 className="font-semibold text-slate-900 mb-1 dark:text-slate-50">{t.about.f1t}</h3>
            <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-400">{t.about.f1d}</p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-1 dark:text-slate-50">{t.about.f2t}</h3>
            <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-400">{t.about.f2d}</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-4 dark:text-slate-400">
          {t.equip.title}: {equip.join(' · ')}
        </p>
      </section>
    </div>
  );
}

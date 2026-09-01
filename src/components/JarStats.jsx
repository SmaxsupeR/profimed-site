import { useState } from 'react';
import { useLang } from '../i18n/LangContext.jsx';
import { useInView } from '../hooks/useInView.js';
import { useReveal } from '../hooks/useReveal.js';
import { useCountUp } from '../hooks/useCountUp.js';
import { PhysicsJar } from './PhysicsJar.jsx';
import { PATIENTS_TOTAL } from './glassesPhysics.js';

// Этап 3.5 — секция была центрированной «статистикой» (eyebrow/заголовок/
// абзац по центру, банка мелко и отдельно от числа) и внешне не отличалась
// от других editorial-секций сайта. Банка на ресепшене — настоящая: это не
// геймификация и не техно-демо физики, а маленькая история клиники, поэтому
// вёрстка теперь не через Section/SectionHeader (тот же центрированный
// h2-грамматика, что и везде), а свой asymmetric layout: текст слева,
// крупная банка справа, левым выравниванием, без карточек.
//
// Секция всегда графитовая — не переключается вместе с темой сайта (в
// отличие от остальных секций, у которых просто dark:-вариант). Это
// осознанный контрастный «перебив» посреди светлой страницы, поэтому здесь
// нет вызовов Section (который просто наследует фон страницы), а свой
// внешний div на всю ширину экрана + внутренний pm-container, как у
// TONES.raised в Section.jsx, только без dark:-развилки — графит один и тот
// же в обеих темах сайта.
export function JarStats() {
  const { t } = useLang();
  // Section сам вызывает useReveal() внутри себя и вешает его на <section>;
  // раз Section здесь больше не используется, дублируем ровно то же самое
  // явно, чтобы не потерять появление секции при скролле.
  const { ref: sectionRef, className: revealClass } = useReveal();
  // Свой, отдельный от reveal, useInView — как и раньше, он запускает
  // именно физику банки (её порог/момент не обязан совпадать с появлением
  // всей секции).
  const { ref: jarRef, inView } = useInView(0.05);
  const [physicsFailed, setPhysicsFailed] = useState(false);
  const count = useCountUp(PATIENTS_TOTAL, 2600, inView && !physicsFailed);

  return (
    <div className="bg-slate-900">
      <section
        ref={sectionRef}
        className={`${revealClass} pm-container px-4 sm:px-6 py-16 sm:py-20 lg:py-24`}
      >
        {/* lg:grid-cols-[3fr_2fr] (этап полировки 3.1, было [1fr_1.15fr]) —
            прежняя пропорция держала текстовую колонку у ~483px даже на
            максимальном container (72rem), тогда как бриф этого этапа
            прямо просит 560–680px. Раньше комментарий здесь объяснял «банка
            должна быть весомее текста» — это была верная цель на момент
            первой версии секции, но текущий этап её не повторяет, а даёт
            точный числовой диапазон для текста; банка по-прежнему читается
            весомо за счёт собственной высоты (380–500px, ниже) и плотной
            графики, не обязательно за счёт доли ширины колонки. */}
        <div ref={jarRef} className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-16">
          {/* Текстовая колонка — на мобильном она же задаёт порядок секции
              целиком (eyebrow → заголовок → текст → число → банка), grid
              складывается в одну колонку сам, без отдельной mobile-версии
              разметки. */}
          <div className="lg:max-w-[620px]">
            <p className="text-sm font-medium text-primary-300 tracking-[0.08em] mb-3">{t.jar.eyebrow}</p>
            {/* lg:text-[48px], не [52px] — на 52px вторая строка («больше не
                нужны.») сама переносилась ещё раз внутри своего же <span>
                (484px нужно против 480px доступных в колонке), и заголовок
                вместо заданных по брифу двух строк рендерился в три.
                Проверено измерением natural width — на 48px требуется 447px,
                запас есть. 48px — нижняя граница диапазона брифа (48–58px),
                не превышение вниз. */}
            <h2 className="font-display text-slate-50 text-[34px] sm:text-[42px] lg:text-[48px] leading-[1.1] mb-5">
              {t.jar.title.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h2>
            {/* max-w-[500px] на самом абзаце — независимое от ширины
                колонки ограничение длины строки (читаемость), колонка
                выросла до 620px именно чтобы вместить более длинный текст,
                а не чтобы сам абзац растягивался на всю её ширину. */}
            <p className="text-slate-300 leading-relaxed max-w-[500px] mb-12">{t.jar.desc}</p>
            {/* Число — часть текстовой колонки, не отдельный «дашборд»-блок
                и не карточка: тот же вертикальный поток, что и у абзаца
                выше него. PATIENTS_TOTAL — это именно пациенты (см.
                комментарий у константы в glassesPhysics.js), не количество
                очков/пар — label сверен с этим смыслом, не придуман заново.
                Точечная полировка: мельче/крупнее и оттенок подписи —
                архитектура блока и раскладка не меняются. */}
            <div>
              <p className="font-display text-slate-50 text-[44px] leading-none">
                {physicsFailed ? PATIENTS_TOTAL : count}
              </p>
              <p className="text-sm text-slate-300 mt-2">{t.jar.label}</p>
            </div>
          </div>

          {/* Банка — размер теперь через CSS custom property (--jar-size,
              объявлена по медиа-запросам в index.css), не через
              clamp(vw) (этап полировки 3.1, было `clamp(216px, 41vw,
              496px)`). clamp(vw) реально масштабировал банку от ширины
              viewport непрерывно — прямое нарушение «не масштабировать
              относительно viewport» из брифа этого этапа. --jar-size
              переключается только на конкретных брейкпоинтах (чистый CSS
              media query, без JS/useMediaQuery и без лишних ре-рендеров).
              Важно: size — это ширина (см. PhysicsJar.jsx, style.width), а
              брифом заданы 380–500px именно высоты; GEO (400×460,
              glassesPhysics.js) даёт height=width×1.15 через собственный
              aspect-ratio элемента — --jar-size подобран так, чтобы именно
              ВЫСОТА попадала в требуемый диапазон (365px/420px ширины →
              ≈420px/≈483px высоты на lg/xl), не сама ширина. На мобильном
              (240px) — заведомо меньше доступной ширины контента (320px
              viewport минус px-4 контейнера с обеих сторон = 288px), с
              явным запасом от боковых полей, а не «во всю ширину экрана».
              forcePalette="dark" — секция всегда графитовая независимо от
              темы сайта (см. комментарий выше), поэтому банке всегда нужна
              именно светлая-на-графите пара цветов из PhysicsJar.jsx, а не
              привязанная к isDark сайта. При ошибке загрузки Matter.js
              колонка просто пустует — число уже показано в тексте слева,
              дублировать его тут нечем. */}
          {!physicsFailed && (
            <div className="flex justify-center lg:justify-end">
              <PhysicsJar
                trigger={inView}
                onError={() => setPhysicsFailed(true)}
                size="var(--jar-size)"
                forcePalette="dark"
                ariaLabel={t.jar.jarAlt}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

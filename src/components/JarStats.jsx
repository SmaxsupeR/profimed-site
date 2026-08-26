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
        <div ref={jarRef} className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
          {/* Текстовая колонка — на мобильном она же задаёт порядок секции
              целиком (eyebrow → заголовок → текст → число → банка), grid
              складывается в одну колонку сам, без отдельной mobile-версии
              разметки. lg:grid-cols-[1fr_1.15fr], не ровно 1fr/1fr — бриф
              прямо просил не строгую 50/50 card-сетку, банка (правая
              колонка) должна выглядеть немного весомее текста. */}
          <div className="lg:max-w-[480px]">
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
            <p className="text-slate-300 leading-relaxed max-w-[500px] mb-6">{t.jar.desc}</p>
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

          {/* Банка — крупнее прежнего (было фиксированных 240px). clamp
              вместо булевого «мобильный/десктопный» размера: чистый CSS,
              без доп. JS-состояния под брейкпоинт (в отличие от
              headerHeight в Header.jsx, здесь оно не нужно — PhysicsJar
              просто подставляет строку в style.width, а не пересчитывает
              что-то ещё). 216/496px — точечная полировка поверх исходных
              200/460px (ещё +~8%, в пределах мобильного таргета 180–240px
              и десктопного 1.8–2.5× от прежних 240px). forcePalette="dark" —
              секция всегда графитовая независимо от темы сайта (см.
              комментарий выше), поэтому банке всегда нужна именно
              светлая-на-графите пара цветов из PhysicsJar.jsx, а не
              привязанная к isDark сайта. При ошибке загрузки Matter.js
              колонка просто пустует — число уже показано в тексте слева,
              дублировать его тут нечем. */}
          {!physicsFailed && (
            <div className="flex justify-center lg:justify-end">
              <PhysicsJar
                trigger={inView}
                onError={() => setPhysicsFailed(true)}
                size="clamp(216px, 41vw, 496px)"
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

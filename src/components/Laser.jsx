import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { Button } from './ui/Button.jsx';
import { PhotoPlaceholder } from './PhotoPlaceholder.jsx';

// Этап 3.7 (коррект.) — первый заход убрал нумерованный процесс 1/2/3, но
// оставил справа шесть смысловых уровней (eyebrow → заголовок → методы →
// абзац → 2 факта → врач → CTA) — многовато для одной service-секции, а
// «Диагностика перед коррекцией»/«Коррекция и наблюдение» почти дословно
// повторяли то, что пользователь только что прочитал в Timeline. Оба факта
// убраны целиком, абзац сокращён до одного медицинского тезиса, строка
// методов приглушена (была наполовину акцентной — «Методы:» светлым,
// сами методы серым — теперь вся строка ровно тем же неброским тоном:
// справочная деталь, не второй заголовок). Итоговая иерархия — фото →
// направление → заголовок → тезис → врач → действие, ровно пять остановок
// для глаза справа.
//
// Слайдер «до/после» (BeforeAfterSlider) убран из вёрстки, не удалён из
// проекта — в site/src/assets нет ни одной реальной фотографии клиники,
// кроме hero.jpg (уже занята в Hero), так что обе половины слайдера всё
// равно были PhotoPlaceholder (декоративный градиент), а перетаскивание
// между двумя одинаковыми плейсхолдерами не сравнивает ничего настоящего —
// то самое «маркетинговый жест без медицинского смысла» из брифа. Один
// статичный PhotoPlaceholder на месте — секция готова принять реальное фото
// операционной/оборудования, когда оно появится, без переверстки.
//
// Три grid-элемента, не два — блок вступления (eyebrow/заголовок/методы/
// абзац) и блок врача+CTA разнесены по разным <div>, а не собраны в один,
// специально ради мобильного порядка: «заголовок/контекст → фото → факт →
// CTA», а не фото первым (как было) и не фото в самом конце. lg:row-span-2
// у фото — единственный способ и растянуть его на всю высоту правой колонки
// на десктопе, и одновременно оставить его вторым по DOM-порядку (а не
// первым) для мобильного/скринридер-порядка чтения. explicit col/row-start
// на десктопе полностью переопределяют порядок отрисовки, DOM же остаётся
// «сначала текст, потом фото» и на мобильном это уже готовый порядок без
// каких-либо order-классов.
export function Laser({ onPick }) {
  const { t } = useLang();
  const reveal = useReveal();

  return (
    // Тёмная графитовая полоса — без изменений (бриф, п.2: «keep the
    // current dark/graphite identity», «use the existing approved values»).
    <section ref={reveal.ref} className={`${reveal.className} bg-[#202327] dark:bg-[#191C1F] py-16 sm:py-20`}>
      <div className="pm-container px-4 sm:px-6 grid gap-10 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-10">
        <div className="lg:col-start-2 lg:row-start-1">
          <p className="text-sm font-medium text-primary-300 tracking-[0.08em] mb-3">{t.laser.eyebrow}</p>
          <h2 className="font-display text-[28px] sm:text-[34px] lg:text-[46px] leading-[1.15] text-white text-balance mb-4">
            {t.laser.title.map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h2>
          {/* Справочная деталь, не второй заголовок — вся строка одним
              приглушённым тоном, без светлого акцента на «Методы:». */}
          {/* slate-500 (не dark:-вариант — секция всегда графитовая
              независимо от темы сайта, см. комментарий выше о фоне) дал
              4.27:1 на реальном фоне секции (#191C1F) — чуть ниже порога
              4.5:1 для 12px-текста (Lighthouse). slate-400 проходит с
              запасом, тон остаётся тем же самым приглушённым. */}
          <p className="text-xs text-slate-400 mb-5">{t.laser.badge}: {t.laser.methods}</p>
          <p className="text-slate-300 max-w-[34em]">{t.laser.text}</p>
        </div>

        <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:self-start">
          <PhotoPlaceholder label={t.laser.photo} className="aspect-[4/3] w-full" />
        </div>

        <div className="lg:col-start-2 lg:row-start-2">
          {/* Врач — раньше последним предложением длинного абзаца, теперь
              отдельным компактным блоком (бриф, п.10): те же самые имя и
              роль, никаких новых регалий/стажа/наград не добавлено. Имя и
              роль — одной строкой через «·», не мини-карточка врача. */}
          <div className="mb-6">
            <p className="text-sm text-slate-400 mb-1">{t.laser.doctorLead}</p>
            <p className="text-base font-semibold text-white">
              {t.laser.doctorName} <span className="font-normal text-slate-400">· {t.laser.doctorRole}</span>
            </p>
          </div>

          <Button variant="primary" size="lg" onClick={() => onPick('ophthalmology')}>{t.laser.cta}</Button>
        </div>
      </div>
    </section>
  );
}

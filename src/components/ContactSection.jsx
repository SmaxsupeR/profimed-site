import { useEffect } from 'react';
import { useLang } from '../i18n/LangContext.jsx';
import { Section } from './ui/Section.jsx';
import { Card } from './ui/Card.jsx';
import { ContactInfo } from './ContactInfo.jsx';
import { Map } from './Map.jsx';
import { MapActions } from './MapActions.jsx';

// Этап 3.21 — раньше контакты и карта были двумя отдельными секциями
// (ContactInfo.jsx и MapSection.jsx), каждая со своей рамкой/фоном — два
// разных «острова» вместо одной темы «как нас найти». Одна карточка:
// border/bg/radius общие, overflow-hidden подрезает карту точно по
// скруглению.
//
// Композиция «второго захода» (после ревью — прежняя горизонтальная
// таблица из 4 мелких колонок читалась плохо: мелкий текст, тонкие
// вертикальные разделители, много пустоты). Теперь desktop — двухчастная
// grid-композиция: контакты слева (компактная колонка), карта во всю
// высоту справа — grid lg:grid-cols-[minmax(360px,0.85fr)_minmax(0,1.4fr)].
// На mobile части идут последовательно (контакты → карта → действия) —
// уже так по построению DOM, отдельной мобильной разметки не требуется.
//
// id="contact" — здесь, на всей секции целиком (а не на каком-то из
// внутренних кусков): это тот же якорь, на который уже ведёт «Контакты» в
// навигации.
//
// Два наблюдателя (этап 3.22): для панели «Ваш визит» верно прятаться,
// пока в кадре вся секция целиком (форма записи уже выше, ей нечего
// показывать здесь); чат мешает управлению только рядом с картой и
// кнопками маршрута — над контактами он никому не мешает.
// onSectionInView — вся секция целиком (id="contact") → cartBarSuppressed
//   у Prices.jsx.
// onMapAreaInView — только #contact-map-area (карта + нижняя панель) →
//   раньше уходил в ChatWidget, теперь используется только MobileCallBar
//   (см. App.jsx, mobileCallBarHidden) — чат ниже 1024px управляется
//   иначе (см. комментарий в ChatWidget.jsx).
export function ContactSection({ onSectionInView = () => {}, onMapAreaInView = () => {} }) {
  const { t } = useLang();

  useEffect(() => {
    const section = document.getElementById('contact');
    const mapArea = document.getElementById('contact-map-area');
    if (!section || !mapArea || typeof IntersectionObserver === 'undefined') return undefined;

    const sectionIo = new IntersectionObserver(([entry]) => onSectionInView(entry.isIntersecting), { threshold: 0 });
    sectionIo.observe(section);
    const mapAreaIo = new IntersectionObserver(([entry]) => onMapAreaInView(entry.isIntersecting), { threshold: 0 });
    mapAreaIo.observe(mapArea);

    return () => {
      sectionIo.disconnect();
      mapAreaIo.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // !pt-* (этап полировки 1.2) — переход Booking→Contacts на 768px был
    // 80(низ BookingSection, tone="raised") + 80(верх этой секции, оба —
    // унаследованный Section-дефолт py-16 sm:py-20) = 160px суммарно,
    // заметно больше диапазона «переход между секциями» из spacing scale.
    // !-префикс обязателен — та же cascade-order задача, что и везде в
    // проекте (Tailwind не гарантирует победу класса по порядку в JSX):
    // !pt-* перебивает только верхнюю половину унаследованного py-16
    // sm:py-20, нижняя половина Section-обёртки не трогается. Итог на
    // 768px: 80 (низ Booking) + 48 (верх Contacts, sm:-шаг) = 128px.
    <Section id="contact" className="!pt-10 sm:!pt-12 lg:!pt-16">
      {/* mb-12 (48px) — «между заголовком секции и карточкой ~40–56px». */}
      <div className="mb-12">
        <p className="text-sm font-medium text-slate-600 tracking-[0.08em] mb-3 dark:text-slate-400">{t.con.eyebrow}</p>
        <h2 className="font-display text-3xl sm:text-4xl text-slate-900 text-balance dark:text-slate-50">{t.con.title}</h2>
      </div>

      {/* Единственная рамка/фон/радиус на всю объединённую карточку.
          overflow-hidden — обязателен: без него прямоугольный iframe карты
          вылезал бы острыми углами за скруглённые края контейнера, и
          вертикальный grid-разделитель справа тоже упирался бы в уже
          скруглённый край неровно.
          grid lg:grid-cols-[minmax(360px,0.85fr)_minmax(0,1.4fr)] — ровно
          то соотношение, что просил пользователь: компактная колонка
          контактов слева (не уже 360px даже на очень широких экранах,
          иначе адрес/телефоны начнут ломаться), карта — заметно шире
          справа. items-stretch (grid-дефолт) — оба столбца одной высоты
          ряда, у карты (flex-col внутри) от этого высота на всю правую
          часть, а не только высота её контента. */}
      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-[minmax(360px,0.85fr)_minmax(0,1.4fr)]">
          <ContactInfo />
          {/* id — для наблюдателя выше (onMapAreaInView). border-t/lg:border-l
              — разделитель между контактами и картой: горизонтальная линия
              на mobile (части идут одна под другой), вертикальная на
              desktop (части рядом). flex-col + lg:justify-start — карта
              (Map.jsx) держит собственную безопасную фиксированную высоту
              (не растягивается — см. комментарий там же, почему) и уже
              сама по себе заполняет свою колонку от верха без зазора (было
              justify-center, но карта+кнопки и так ровно равны высоте
              строки — центрировать было нечего; сменил на justify-start
              для единообразия с контактами слева, которые тоже теперь
              justify-start, см. ContactInfo.jsx). */}
          <div id="contact-map-area" className="flex flex-col border-t border-slate-200 dark:border-slate-800 lg:justify-start lg:border-t-0 lg:border-l">
            <Map />
            <MapActions />
          </div>
        </div>
      </Card>
    </Section>
  );
}

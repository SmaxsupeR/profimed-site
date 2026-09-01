import { useEffect, useRef, useState } from 'react';
import { useDocumentMeta } from './hooks/useDocumentMeta.js';
import { useSelectedServices } from './hooks/useSelectedServices.js';
import { useReviewRatings } from './hooks/useReviewRatings.js';
import { LangProvider, useLang } from './i18n/LangContext.jsx';
import { ThemeProvider } from './theme/ThemeContext.jsx';
import { LogoTintFilter } from './components/LogoTintFilter.jsx';
import { Splash } from './components/Splash.jsx';
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { JarStats } from './components/JarStats.jsx';
import { Directions } from './components/Directions.jsx';
import { Timeline } from './components/Timeline.jsx';
import { Laser } from './components/Laser.jsx';
import { About } from './components/About.jsx';
import { Doctors } from './components/Doctors.jsx';
import { DoctorPage } from './components/DoctorPage.jsx';
import { Prices } from './components/Prices.jsx';
import { Reviews } from './components/Reviews.jsx';
import { Faq } from './components/Faq.jsx';
import { BookingSection } from './components/BookingSection.jsx';
import { ContactSection } from './components/ContactSection.jsx';
import { Footer } from './components/Footer.jsx';
import { MobileCallBar } from './components/MobileCallBar.jsx';
import { ScrollUi } from './components/ScrollUi.jsx';
import { ChatWidget } from './components/ChatWidget.jsx';

// Разбор пути без библиотеки-роутера — единственный динамический маршрут
// на весь сайт (/doctors/:slug), заводить react-router ради одного паттерна
// не стоит. Продакшен-сервер (server/src/index.js) уже отдаёт index.html на
// любой неизвестный путь как SPA-fallback — прямой заход на
// /doctors/usmanov-akbar (например, по ссылке из мессенджера) поэтому
// работает без изменений на сервере, тем самым закрывая требование брифа
// «не строить страницы, если инфраструктура для роутинга ещё не готова».
function parseRoute(pathname) {
  const m = pathname.match(/^\/doctors\/([a-z0-9-]+)\/?$/i);
  if (m) return { name: 'doctor', slug: m[1] };
  return { name: 'home' };
}

function Page() {
  const { t } = useLang();
  const [presetDirection, setPresetDirection] = useState('');
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));
  // Только для главной — на маршруте врача свои title/description ставит
  // сам DoctorPage.jsx (там они зависят от конкретного врача, а не только
  // от языка). Хук вызывается безусловно (это правило хуков), но реально
  // применяет теги только пока route.name === 'home' — на маршруте врача
  // эти же значения просто не используются, они перезаписываются хуком
  // внутри DoctorPage сразу следующим эффектом.
  useDocumentMeta(
    route.name === 'home' ? t.meta.homeTitle : undefined,
    route.name === 'home' ? t.meta.homeDesc : undefined
  );
  // Выбор услуг в прайсе — общий для Prices (выбор, панель «Ваш визит») и
  // BookingForm (блок «Выбранные услуги», авто-направление). Пробрасывается
  // пропсами вниз, а не через React Context: конвенция дизайн-системы
  // (.design-sync/conventions.md) прямо запрещает контексты — компоненты
  // должны собираться в изолированном превью без обвязки, а обычный проп
  // (как presetDirection/onPick ниже) продолжает работать и там, просто
  // получая значение по умолчанию.
  const { selectedIds, toggle: toggleService, clear: clearSelectedServices } = useSelectedServices();
  // Состояние закреплённой мобильной панели «Ваш визит» в Prices.jsx —
  // active: панель сейчас замещает общую MobileCallBar (пользователь рядом
  // с прайсом и что-то выбрано); expanded: панель ещё и раскрыта на весь
  // список, тогда прячем и ChatWidget (см. комментарии в самих компонентах,
  // почему именно так и почему это не React Context — та же причина, что и
  // у selectedIds выше).
  const [pricesBarState, setPricesBarState] = useState({ inSection: false, active: false, expanded: false });
  // Этап полировки 2 (единая стратегия fixed-элементов) заменяет прежнюю
  // ширинозависимую chatSuppressed-формулу (см. историю коммита) на
  // структурное решение: ниже 1024px у ChatWidget.jsx больше нет
  // отдельного видимого FAB (см. комментарий в самом ChatWidget.jsx) —
  // доступ к чату там даёт третья кнопка в MobileCallBar.jsx, а сама
  // панель — общая, управляется отсюда же (chatOpen/setChatOpen). Больше
  // не нужно решать «прятать чат рядом с прайсом/картой на узких экранах»
  // — прятать там уже нечего.
  //
  // bookingInView/contactSectionInView/mapAreaInView — форма записи
  // (#booking) и объединённая секция контактов+карты (#contact/
  // #contact-map-area) сейчас в кадре — BookingSection.jsx/
  // ContactSection.jsx следят каждый за своим id (см. комментарий у
  // onBookingInView/onSectionInView/onMapAreaInView в этих компонентах).
  // bookingInView/contactSectionInView вместе идут в cartBarSuppressed для
  // Prices.jsx: её закреплённая панель «Ваш визит» не должна лежать ни
  // поверх кнопки «Отправить» формы, ни поверх кнопок карты. mapAreaInView
  // раньше был нужен ещё и чату — теперь только для MobileCallBar (см.
  // mobileCallBarHidden ниже): рядом с кнопками маршрута/такси нижняя
  // панель «Позвонить/Записаться/Чат» тоже не должна висеть поверх.
  const [bookingInView, setBookingInView] = useState(false);
  const [contactSectionInView, setContactSectionInView] = useState(false);
  const [mapAreaInView, setMapAreaInView] = useState(false);
  // Открытая панель чата — общее состояние ChatWidget.jsx: обе точки
  // входа (desktop-FAB и мобильная иконка в MobileCallBar.jsx) управляют
  // одним и тем же булевым значением через проп вниз/колбэк вверх, без
  // Context — тот же приём, что и везде в этом файле.
  const [chatOpen, setChatOpen] = useState(false);
  // Открыто мобильное меню — поднято из Header.jsx (onMenuOpenChange).
  const [menuOpen, setMenuOpen] = useState(false);
  // «CTA первого экрана в кадре» — наблюдатель на мобильный блок кнопок
  // Hero (id="hero-mobile-actions", см. Hero.jsx). Пока «Записаться»/
  // «Позвонить» из Hero ещё видны, MobileCallBar с теми же по смыслу
  // действиями снизу не нужна — она их дублировала бы.
  const [heroCtaInView, setHeroCtaInView] = useState(false);
  useEffect(() => {
    const el = document.getElementById('hero-mobile-actions');
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([entry]) => setHeroCtaInView(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // Единая формула для MobileCallBar (этап полировки 2.1/2.5) — панель
  // «Позвонить/Записаться/Чат» скрывается, пока: активна панель выбранных
  // услуг Prices.jsx (тот же принцип «не больше одного конкурирующего
  // нижнего action-layer», что и раньше), видны CTA Hero, открыта форма
  // записи, видна нижняя часть контактов+карты, или открыто мобильное
  // меню. Формула НЕ зависит от ширины — сам компонент уже существует
  // только <1024px (lg:hidden в MobileCallBar.jsx), отдельная проверка
  // ширины здесь не нужна (в отличие от прежней chatSuppressed-формулы).
  const mobileCallBarHidden =
    pricesBarState.active || heroCtaInView || bookingInView || mapAreaInView || menuOpen;
  // Этап полировки 4.1 — единый источник «есть подтверждённые данные
  // рейтингов» вместо того, чтобы Reviews.jsx и Header.jsx каждый по
  // отдельности вычисляли один и тот же фильтр (и рисковали разойтись).
  // useReviewRatings() поднят сюда, places — уже отфильтрованный список
  // (visible + rating/reviewCount/checkedAt не null, тот же критерий, что
  // раньше жил только в Reviews.jsx) идёт вниз пропом; reviewsVisible —
  // тот же список, просто как булево, для Header (пункт меню). Секция и
  // пункт меню теперь в буквальном смысле управляются одним и тем же
  // рендером — не могут разойтись (появиться/исчезнуть не синхронно).
  const reviewRatings = useReviewRatings();
  const visibleReviewPlaces = reviewRatings.filter(
    (p) => p.visible && p.rating != null && p.reviewCount != null && p.checkedAt != null
  );
  // Секция/якорь, к которому нужно проскроллить ПОСЛЕ того, как главная
  // перерендерится с нуля (переход со страницы врача на форму записи или
  // назад к карусели). Ref, а не state: сам факт «есть отложенный скролл»
  // не должен вызывать лишний рендер, он нужен только эффекту ниже.
  const pendingScrollId = useRef(null);

  useEffect(() => {
    const onPopState = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!pendingScrollId.current) return;
    const id = pendingScrollId.current;
    pendingScrollId.current = null;
    // Кадр ожидания — секция с этим id монтируется в этом же рендере, что
    // и route, и scrollIntoView, вызванный до отрисовки DOM, ничего не
    // найдёт.
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [route]);

  const navigate = (path, scrollToId) => {
    window.history.pushState(null, '', path);
    setRoute(parseRoute(path));
    if (scrollToId) {
      pendingScrollId.current = scrollToId;
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const openDoctor = (slug) => navigate(`/doctors/${slug}`);

  const handlePickDirection = (id) => {
    setPresetDirection(id);
    // Со страницы врача форма записи физически не существует в DOM — сперва
    // возвращаемся на главную и просим эффект выше доскроллить к ней, как
    // только секция появится.
    if (route.name !== 'home') {
      navigate('/', 'booking');
    } else {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (route.name === 'doctor') {
    return (
      <div>
        <LogoTintFilter />
        <DoctorPage
          slug={route.slug}
          onBack={() => navigate('/', 'doctors')}
          onPick={handlePickDirection}
        />
      </div>
    );
  }

  return (
    <div>
      <LogoTintFilter />
      <Splash />
      <Header onMenuOpenChange={setMenuOpen} reviewsVisible={visibleReviewPlaces.length > 0} />
      {/* Порядок секций — этап 3.17. Раньше врачи (Doctors) и «как проходит
          приём» (Timeline) шли ДО основного направления (Laser), а Timeline
          — ещё и до Doctors: последовательность «предложение → направления
          → процесс → врачи → оснащение» читалась не в том порядке, в каком
          пациент реально принимает решение. Новый порядок ниже — прямое
          требование брифа (см. историю коммита, п. «Желаемый порядок всей
          страницы»): Hero → эмоциональное доказательство (JarStats) →
          направления → ключевая специализация (Laser) → врачи → процесс
          приёма (Timeline) → оснащение (About) → прайс → отзывы → FAQ →
          «не знаете к кому» (CtaBand) → форма записи → контакты+карта.
          Сами компоненты между собой не менялись — только порядок вызовов
          и (у нижних двух) то, из чего они собраны, см. BookingSection.jsx/
          ContactSection.jsx. */}
      <main>
        <Hero />
        <JarStats />
        <Directions onPick={handlePickDirection} />
        <Laser onPick={handlePickDirection} />
        <Doctors onOpenDoctor={openDoctor} />
        <Timeline />
        <About />
        <Prices
          selectedIds={selectedIds}
          onToggleService={toggleService}
          onClearSelected={clearSelectedServices}
          onMobileBarStateChange={setPricesBarState}
          cartBarSuppressed={bookingInView || contactSectionInView}
        />
        <Reviews places={visibleReviewPlaces} />
        <Faq />
        {/* Две самостоятельные секции вместо старой двухколоночной Contact
            (форма+контакты+карта в одном grid-ряду) — см. подробное
            обоснование в BookingSection.jsx и ContactSection.jsx (контакты
            и карта, этап 3.21, объединены в одну общую карточку — не три
            отдельных куска, а один визуальный блок «как нас найти»).
            PreFooter (сетка «Разделы / Клиника / Запись») из потока убран:
            она дублировала тот же адрес/телефон/почту, что теперь честно
            один раз показывает ContactSection прямо над ней же — держать
            оба смысла не было причины. Компонент не удалён из проекта,
            просто больше не вызывается здесь. */}
        <BookingSection
          presetDirection={presetDirection}
          selectedIds={selectedIds}
          onRemoveService={toggleService}
          onSubmitted={clearSelectedServices}
          onBookingInView={setBookingInView}
        />
        <ContactSection onSectionInView={setContactSectionInView} onMapAreaInView={setMapAreaInView} />
      </main>
      <Footer />
      <MobileCallBar hidden={mobileCallBarHidden} onOpenChat={() => setChatOpen(true)} />
      <ScrollUi />
      <ChatWidget open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <ThemeProvider>
        <Page />
      </ThemeProvider>
    </LangProvider>
  );
}

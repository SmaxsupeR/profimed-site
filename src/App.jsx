import { useEffect, useRef, useState } from 'react';
import { LangProvider } from './i18n/LangContext.jsx';
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
import { VisitPlanner } from './components/VisitPlanner.jsx';
import { Reviews } from './components/Reviews.jsx';
import { Faq } from './components/Faq.jsx';
import { CtaBand } from './components/CtaBand.jsx';
import { Contact } from './components/Contact.jsx';
import { PreFooter } from './components/PreFooter.jsx';
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
  const [presetDirection, setPresetDirection] = useState('');
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));
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
      <Header />
      <main>
        <Hero />
        <JarStats />
        <Directions onPick={handlePickDirection} />
        <Timeline />
        <Laser onPick={handlePickDirection} />
        <About />
        <Doctors onOpenDoctor={openDoctor} />
        <Prices />
        <VisitPlanner onSubmit={handlePickDirection} />
        <Reviews />
        <Faq />
        <CtaBand />
        <Contact presetDirection={presetDirection} />
        <PreFooter />
      </main>
      <Footer />
      <MobileCallBar />
      <ScrollUi />
      <ChatWidget />
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

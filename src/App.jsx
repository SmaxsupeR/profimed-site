import { useState } from 'react';
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
import { Quote } from './components/Quote.jsx';
import { About } from './components/About.jsx';
import { VisitPlanner } from './components/VisitPlanner.jsx';
import { VisionGame } from './components/VisionGame.jsx';
import { Doctors } from './components/Doctors.jsx';
import { Prices } from './components/Prices.jsx';
import { Reviews } from './components/Reviews.jsx';
import { Faq } from './components/Faq.jsx';
import { CtaBand } from './components/CtaBand.jsx';
import { Contact } from './components/Contact.jsx';
import { Map } from './components/Map.jsx';
import { PreFooter } from './components/PreFooter.jsx';
import { Footer } from './components/Footer.jsx';
import { MobileCallBar } from './components/MobileCallBar.jsx';
import { ScrollUi } from './components/ScrollUi.jsx';
import { ChatWidget } from './components/ChatWidget.jsx';

function Page() {
  const [presetDirection, setPresetDirection] = useState('');

  const handlePickDirection = (id) => {
    setPresetDirection(id);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
        <Quote />
        <About />
        <VisitPlanner onSubmit={handlePickDirection} />
        <VisionGame onPick={handlePickDirection} />
        <Doctors />
        <Prices />
        <Reviews />
        <Faq />
        <CtaBand />
        <Contact presetDirection={presetDirection} />
        <Map />
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

import { useState } from 'react';
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { Directions } from './components/Directions.jsx';
import { Doctors } from './components/Doctors.jsx';
import { Prices } from './components/Prices.jsx';
import { Reviews } from './components/Reviews.jsx';
import { Contact } from './components/Contact.jsx';
import { Footer } from './components/Footer.jsx';

export default function App() {
  const [presetDirection, setPresetDirection] = useState('');

  const handlePickDirection = (id) => {
    setPresetDirection(id);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      <Header />
      <main>
        <Hero />
        <Directions onPick={handlePickDirection} />
        <Doctors />
        <Prices />
        <Reviews />
        <Contact presetDirection={presetDirection} />
      </main>
      <Footer />
    </div>
  );
}

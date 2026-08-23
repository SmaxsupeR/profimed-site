import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/literata';
import '@fontsource-variable/inter';
// Spectral 600 — Hero h1 (этап 3.2). Только один вес: h1 нигде не берёт
// другое начертание этого шрифта. Файл 600.css уже включает кириллицу и
// латиницу разом (см. fontFamily.hero в tailwind.config.js).
import '@fontsource/spectral/600.css';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

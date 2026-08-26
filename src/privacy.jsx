import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/literata';
import '@fontsource-variable/inter';
import './index.css';
import { LangProvider } from './i18n/LangContext.jsx';
import { ThemeProvider } from './theme/ThemeContext.jsx';
import { LogoTintFilter } from './components/LogoTintFilter.jsx';
import { PrivacyPage } from './components/PrivacyPage.jsx';

// Вторая точка входа сборки (см. vite.config.js). Отличается от main.jsx
// двумя вещами:
//
// 1. Нет Spectral: этот шрифт подключён ради единственного h1 на главной
//    (см. комментарий в main.jsx). Заголовок политики набран Literata, как
//    остальные h2 сайта, поэтому лишний шрифтовой файл странице не нужен.
// 2. Нет Splash, Header, ScrollUi, ChatWidget и MobileCallBar — юридический
//    документ не должен встречать заставкой, догонять плавающими кнопками
//    и предлагать записаться поверх текста про обработку данных.
//
// LangProvider и ThemeProvider обязательны: и страница, и переиспользуемый
// подвал читают язык и тему из контекста. Выбор языка сохраняется в
// localStorage тем же ключом, что и на главной, — перейдя сюда, пациент
// остаётся на своём языке, а вернувшись назад, не обнаружит сброс на русский.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LangProvider>
      <ThemeProvider>
        <LogoTintFilter />
        <PrivacyPage />
      </ThemeProvider>
    </LangProvider>
  </StrictMode>
);

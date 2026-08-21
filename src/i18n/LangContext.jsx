import { createContext, useContext, useEffect, useState } from 'react';
import { DICT } from './dict.js';

const LangContext = createContext(null);
const STORAGE_KEY = 'pm-lang';

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && DICT[saved]) return saved;
  } catch { /* приватный режим — localStorage недоступен */ }
  return 'ru';
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = DICT[lang].htmlLang;
  }, [lang]);

  const setLang = (code) => {
    if (!DICT[code]) return;
    try { localStorage.setItem(STORAGE_KEY, code); } catch { /* приватный режим */ }
    setLangState(code);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: DICT[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang должен вызываться внутри LangProvider');
  return ctx;
}

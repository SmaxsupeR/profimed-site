import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'pm-theme';

function initialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  } catch { /* приватный режим */ }
  return 'system';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemDark(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const isDark = theme === 'dark' || (theme === 'system' && systemDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [isDark]);

  // localStorage синхронизируется отдельным эффектом от theme, а не внутри
  // сеттера — эффект всегда бьёт по уже закоммиченному состоянию, а не по
  // значению, пойманному в замыкании конкретного вызова.
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* приватный режим */ }
  }, [theme]);

  // Функциональная форма setState, а не toggleTheme = () => setTheme(isDark
  // ? 'light' : 'dark') — при быстрых повторных кликах (быстрее, чем
  // успевает закоммититься предыдущий рендер) toggleTheme из предыдущего
  // рендера видел устаревший isDark и либо не переключал тему, либо дёргал
  // её непредсказуемо. С prev => ... React всегда подставляет актуальное
  // на момент применения состояние, а не то, что было на момент клика.
  const toggleTheme = () => {
    setTheme((prev) => {
      const prevIsDark = prev === 'dark' || (prev === 'system' && systemDark);
      return prevIsDark ? 'light' : 'dark';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme должен вызываться внутри ThemeProvider');
  return ctx;
}

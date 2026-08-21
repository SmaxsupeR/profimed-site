import { useLang } from '../i18n/LangContext.jsx';
import logoMark from '../assets/profimed-logo-mark.svg';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <img src={logoMark} alt="ProfiMed" className="h-8 w-auto" style={{ filter: 'url(#pm-logo-tint)' }} />
        <p className="text-sm text-slate-400 dark:text-slate-500">© {new Date().getFullYear()} {t.foot}</p>
      </div>
    </footer>
  );
}

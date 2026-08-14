import { LOGO_SRC } from '../assets/logo.js';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <img src={LOGO_SRC} alt="ProfiMed" className="h-8 w-auto" />
        <p className="text-sm text-slate-400">© {new Date().getFullYear()} ProfiMed. Медицинская клиника в Ташкенте.</p>
      </div>
    </footer>
  );
}

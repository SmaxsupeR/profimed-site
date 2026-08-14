import { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from './ui/Button.jsx';
import { LOGO_SRC } from '../assets/logo.js';

const NAV = [
  { href: '#directions', label: 'Направления' },
  { href: '#doctors', label: 'Врачи' },
  { href: '#prices', label: 'Цены' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#contact', label: 'Контакты' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          <img src={LOGO_SRC} alt="ProfiMed" className="h-10 w-auto" />
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 hover:text-primary-700 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a href="tel:+998951956119" className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-primary-700">
            <Phone size={16} />
            +998 95 195 61 19
          </a>
          <Button href="#booking" size="sm">Записаться</Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 -mr-2 text-slate-700"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 sm:px-6 py-4 flex flex-col gap-1">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-2.5 text-[15px] font-medium text-slate-700"
            >
              {item.label}
            </a>
          ))}
          <Button href="#booking" size="md" className="mt-3" onClick={() => setOpen(false)}>
            Записаться
          </Button>
        </div>
      )}
    </header>
  );
}

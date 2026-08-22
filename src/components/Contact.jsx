import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { BookingForm } from './BookingForm.jsx';
import { Map } from './Map.jsx';
import { Section } from './ui/Section.jsx';

export function Contact({ presetDirection }) {
  const { t } = useLang();
  return (
    <Section id="contact" tone="raised">
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <p className="text-sm font-medium text-slate-600 tracking-[0.08em] mb-3 dark:text-slate-400">{t.con.eyebrow}</p>
          <h2 className="font-display text-3xl sm:text-4xl text-slate-900 mb-8 text-balance dark:text-slate-50">{t.con.title}</h2>

          <ul className="space-y-5">
            <li className="flex items-start gap-3.5">
              <MapPin size={20} className="text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
              <span className="text-slate-600 dark:text-slate-300">{t.con.addr}</span>
            </li>
            <li className="flex items-start gap-3.5">
              <Phone size={20} className="text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <a href="tel:+998951956119" className="text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-400">+998 95 195 61 19</a>
                <a href="tel:+998712156169" className="text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-400">+998 71 215 61 69</a>
                <a href="tel:+998990776119" className="text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-400">+998 99 077 61 19</a>
              </div>
            </li>
            <li className="flex items-start gap-3.5">
              <Clock size={20} className="text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
              <span className="text-slate-600 dark:text-slate-300">{t.con.hours}</span>
            </li>
            <li className="flex items-start gap-3.5">
              <Mail size={20} className="text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
              <a href="mailto:info@profimed.uz" className="text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-400">info@profimed.uz</a>
            </li>
          </ul>

          <div className="mt-8">
            <Map />
          </div>
        </div>

        <div id="booking">
          <BookingForm presetDirection={presetDirection} />
        </div>
      </div>
    </Section>
  );
}

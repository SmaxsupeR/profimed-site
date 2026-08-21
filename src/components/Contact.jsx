import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { BookingForm } from './BookingForm.jsx';
import { Section } from './ui/Section.jsx';

export function Contact({ presetDirection }) {
  const { t } = useLang();
  return (
    <Section id="contact" tone="raised">
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <p className="text-sm font-semibold text-leaf-700 uppercase tracking-wide mb-3 dark:text-leaf-400">{t.con.eyebrow}</p>
          <h2 className="font-display text-3xl sm:text-4xl text-slate-900 mb-8 text-balance dark:text-white">{t.con.title}</h2>

          <ul className="space-y-5">
            <li className="flex items-start gap-3.5">
              <MapPin size={20} className="text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
              <span className="text-slate-600 dark:text-slate-300">{t.con.addr}</span>
            </li>
            <li className="flex items-start gap-3.5">
              <Phone size={20} className="text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
              <a href="tel:+998951956119" className="text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-400">+998 95 195 61 19</a>
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
        </div>

        <div id="booking">
          <BookingForm presetDirection={presetDirection} />
        </div>
      </div>
    </Section>
  );
}

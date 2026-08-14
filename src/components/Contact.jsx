import { MapPin, Phone, Clock, Send } from 'lucide-react';
import { BookingForm } from './BookingForm.jsx';
import { Section } from './ui/Section.jsx';

// Адрес/телефон/часы — перенесены как есть из архива старого сайта (2021).
// Перед публикацией стоит перепроверить, что они всё ещё актуальны.
export function Contact({ presetDirection }) {
  return (
    <Section id="contact">
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <p className="text-sm font-semibold text-leaf-700 uppercase tracking-wide mb-3">Контакты</p>
          <h2 className="font-display text-3xl sm:text-4xl text-slate-900 mb-8 text-balance">Как нас найти</h2>

          <ul className="space-y-5">
            <li className="flex items-start gap-3.5">
              <MapPin size={20} className="text-primary-600 shrink-0 mt-0.5" />
              <span className="text-slate-600">
                г. Ташкент, улица Мирабад (быв. Кунаева), дом 6
                <span className="block text-xs text-slate-400 mt-0.5">адрес перенесён из старого сайта — проверить перед запуском</span>
              </span>
            </li>
            <li className="flex items-start gap-3.5">
              <Phone size={20} className="text-primary-600 shrink-0 mt-0.5" />
              <a href="tel:+998951956119" className="text-slate-600 hover:text-primary-700">+998 95 195 61 19</a>
            </li>
            <li className="flex items-start gap-3.5">
              <Clock size={20} className="text-primary-600 shrink-0 mt-0.5" />
              <span className="text-slate-600">Пн–Сб, 09:00–19:00</span>
            </li>
            <li className="flex items-start gap-3.5">
              <Send size={20} className="text-primary-600 shrink-0 mt-0.5" />
              <span className="text-slate-600">Telegram — ссылку добавим, когда определимся с ботом для сайта</span>
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

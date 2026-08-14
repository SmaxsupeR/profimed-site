import { CircleDollarSign, Phone } from 'lucide-react';
import { DIRECTIONS } from '../data/directions.js';
import { Section, SectionHeader } from './ui/Section.jsx';
import { Card } from './ui/Card.jsx';

// Сознательно без цифр: старый сайт как раз спалился на выдуманном/забытом
// контенте (плейсхолдер вместо отзывов). Прайс подключаем к CRM по-настоящему
// (см. бриф, раздел про интеграцию) — до этого честнее показать «уточняйте»,
// чем нарисовать цифры, которые потом разойдутся с реальностью.
export function Prices() {
  return (
    <Section id="prices">
      <SectionHeader eyebrow="Цены" title="Прайс-лист" />

      <Card className="overflow-hidden">
        <div className="grid sm:grid-cols-2 divide-y divide-slate-100 sm:divide-y-0">
          {DIRECTIONS.map(({ id, title }, i) => (
            <div
              key={id}
              className={`p-6 flex items-center justify-between gap-4 border-slate-100 ${i % 2 === 0 ? 'sm:border-r' : ''} ${i < 2 ? 'sm:border-b' : ''}`}
            >
              <span className="font-medium text-slate-800">{title}</span>
              <span className="text-sm text-slate-400">уточняйте у администратора</span>
            </div>
          ))}
        </div>
        <div className="bg-primary-50 px-6 py-5 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2.5 text-primary-800 text-sm">
            <CircleDollarSign size={18} />
            Актуальный прайс подключим напрямую из CRM клиники — цифры здесь никогда не устареют.
          </div>
          <a href="tel:+998951956119" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700">
            <Phone size={15} /> +998 95 195 61 19
          </a>
        </div>
      </Card>
    </Section>
  );
}

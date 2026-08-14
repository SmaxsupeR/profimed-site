import { DIRECTIONS } from '../data/directions.js';
import { Section, SectionHeader } from './ui/Section.jsx';
import { Card } from './ui/Card.jsx';

export function Directions({ onPick }) {
  return (
    <Section id="directions">
      <SectionHeader eyebrow="Направления" title="Чем занимается клиника" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {DIRECTIONS.map(({ id, icon: Icon, title, text }) => (
          <Card key={id} variant="interactive" className="group p-6" onClick={() => onPick(id)}>
            <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5 group-hover:bg-primary-600 group-hover:text-white transition-colors">
              <Icon size={22} strokeWidth={1.75} />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1.5">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{text}</p>
            <span className="inline-block mt-4 text-sm font-medium text-primary-600 group-hover:underline">
              Записаться →
            </span>
          </Card>
        ))}
      </div>
    </Section>
  );
}

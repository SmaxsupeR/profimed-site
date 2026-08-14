import { DIRECTIONS } from '../data/directions.js';
import { PhotoPlaceholder } from './PhotoPlaceholder.jsx';
import { Section, SectionHeader } from './ui/Section.jsx';
import { Card } from './ui/Card.jsx';

// По одной карточке-плейсхолдеру на направление — имена и фото возьмём из
// CRM (таблица staff), когда до этого дойдёт очередь. Пока — честная
// заглушка, а не выдуманные ФИО.
export function Doctors() {
  return (
    <Section id="doctors">
      <SectionHeader
        eyebrow="Врачи"
        title="Специалисты клиники"
        description="Карточки врачей заполним из CRM — здесь появятся реальные фото, имена и стаж."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {DIRECTIONS.map(({ id, title }) => (
          <Card key={id} className="overflow-hidden">
            <PhotoPlaceholder label="Фото врача" className="aspect-square w-full rounded-none" />
            <div className="p-5">
              <p className="text-xs uppercase tracking-wide text-primary-600 font-semibold mb-1">{title}</p>
              <p className="text-sm text-slate-400">Имя и стаж — из CRM</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

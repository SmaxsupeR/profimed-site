import { MessageSquareHeart } from 'lucide-react';
import { Section, SectionHeader } from './ui/Section.jsx';
import { Card } from './ui/Card.jsx';

// Осознанно без вымышленных цитат — именно на этом споткнулся старый сайт
// (незаполненный плейсхолдер конструктора вместо реальных отзывов). Честная
// пустая полка лучше, чем красивая ложь.
export function Reviews() {
  return (
    <Section id="reviews">
      <SectionHeader eyebrow="Отзывы" title="Что говорят пациенты" />

      <Card variant="dashed" className="p-10 flex flex-col items-center text-center gap-3">
        <MessageSquareHeart size={28} className="text-primary-400" strokeWidth={1.5} />
        <p className="text-slate-500 max-w-md">
          Здесь появятся отзывы реальных пациентов — начнём собирать их с запуском сайта,
          без плейсхолдеров и без выдумки.
        </p>
      </Card>
    </Section>
  );
}

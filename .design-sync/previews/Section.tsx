import { Section, SectionHeader, Card } from 'profimed-site';

// Section — это обёртка: единая ширина контента и вертикальный ритм.
// Показываем её с типичным наполнением, иначе смотреть не на что.

export const WithHeaderAndCards = () => (
  <Section id="directions">
    <SectionHeader eyebrow="Направления" title="Чем занимается клиника" />
    <div className="grid sm:grid-cols-3 gap-5">
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-1.5">Офтальмология</h3>
        <p className="text-sm text-slate-500">Диагностика зрения и лазерная коррекция.</p>
      </Card>
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-1.5">Стоматология</h3>
        <p className="text-sm text-slate-500">Терапевтическая и эстетическая.</p>
      </Card>
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-1.5">КТ-диагностика</h3>
        <p className="text-sm text-slate-500">Компьютерная 3D-томография.</p>
      </Card>
    </div>
  </Section>
);

export const TextOnly = () => (
  <Section>
    <SectionHeader
      eyebrow="О клинике"
      title="В Ташкенте с 2014 года"
      description="Четыре направления под одной крышей: офтальмология, оториноларингология, стоматология и КТ-диагностика."
    />
  </Section>
);

import { Card, Button } from 'profimed-site';

export const Solid = () => (
  <Card className="p-6 max-w-sm">
    <h3 className="font-semibold text-slate-900 mb-1.5">Офтальмология</h3>
    <p className="text-sm text-slate-500 leading-relaxed">
      Диагностика и лечение зрения, лазерная коррекция LASIK, LESIK и ФРК.
    </p>
  </Card>
);

export const Interactive = () => (
  <Card variant="interactive" className="p-6 max-w-sm">
    <h3 className="font-semibold text-slate-900 mb-1.5">Стоматология</h3>
    <p className="text-sm text-slate-500 leading-relaxed">
      Терапевтическая и эстетическая стоматология на современном оборудовании.
    </p>
    <span className="inline-block mt-4 text-sm font-medium text-primary-600">Записаться →</span>
  </Card>
);

export const Dashed = () => (
  <Card variant="dashed" className="p-10 max-w-md text-center">
    <p className="text-slate-500">
      Здесь появятся отзывы реальных пациентов — начнём собирать их с запуском сайта.
    </p>
  </Card>
);

export const WithAction = () => (
  <Card className="p-6 max-w-sm flex flex-col gap-4 items-start">
    <div>
      <h3 className="font-semibold text-slate-900 mb-1.5">КТ-диагностика</h3>
      <p className="text-sm text-slate-500">Компьютерная 3D-томография прямо в клинике.</p>
    </div>
    <Button size="sm">Записаться</Button>
  </Card>
);

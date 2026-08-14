import { Textarea, Field } from 'profimed-site';

export const InField = () => (
  <div className="max-w-sm">
    <Field label="Комментарий (необязательно)">
      <Textarea placeholder="Что беспокоит, удобное время для звонка и т.п." />
    </Field>
  </div>
);

export const Filled = () => (
  <div className="max-w-sm">
    <Field label="Комментарий">
      <Textarea defaultValue="Удобнее после 17:00, беспокоит правый глаз последние две недели." />
    </Field>
  </div>
);

export const Taller = () => (
  <div className="max-w-sm">
    <Field label="Жалобы" hint="Чем подробнее, тем лучше подготовится врач">
      <Textarea rows={6} placeholder="Опишите, что вас беспокоит" />
    </Field>
  </div>
);

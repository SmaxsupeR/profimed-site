import { Input, Field } from 'profimed-site';

// Input почти всегда живёт внутри Field — голое поле без подписи в реальном
// интерфейсе не встречается, поэтому показываем его в родной обвязке.

export const InField = () => (
  <div className="max-w-sm">
    <Field label="Ваше имя">
      <Input placeholder="Как к вам обращаться" />
    </Field>
  </div>
);

export const Filled = () => (
  <div className="max-w-sm">
    <Field label="Телефон">
      <Input type="tel" defaultValue="+998 95 195 61 19" />
    </Field>
  </div>
);

export const Disabled = () => (
  <div className="max-w-sm">
    <Field label="Номер карты пациента" hint="Заполняется автоматически">
      <Input defaultValue="П-2026-0417" disabled />
    </Field>
  </div>
);

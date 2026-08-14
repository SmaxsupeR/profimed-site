import { Field, Input, Select, Textarea } from 'profimed-site';

export const WithInput = () => (
  <div className="max-w-sm">
    <Field label="Ваше имя">
      <Input placeholder="Как к вам обращаться" />
    </Field>
  </div>
);

export const WithHint = () => (
  <div className="max-w-sm">
    <Field label="Телефон" hint="Администратор перезвонит по этому номеру">
      <Input type="tel" placeholder="+998 __ ___ __ __" />
    </Field>
  </div>
);

export const WithSelect = () => (
  <div className="max-w-sm">
    <Field label="Направление">
      <Select defaultValue="stomatology">
        <option value="">Не уверен(а), подскажите сами</option>
        <option value="ophthalmology">Офтальмология</option>
        <option value="ent">Оториноларингология</option>
        <option value="stomatology">Стоматология</option>
        <option value="ct">КТ-диагностика</option>
      </Select>
    </Field>
  </div>
);

export const WithTextarea = () => (
  <div className="max-w-sm">
    <Field label="Комментарий (необязательно)">
      <Textarea placeholder="Что беспокоит, удобное время для звонка и т.п." />
    </Field>
  </div>
);

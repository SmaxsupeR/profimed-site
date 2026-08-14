import { Select, Field } from 'profimed-site';

export const Directions = () => (
  <div className="max-w-sm">
    <Field label="Направление">
      <Select defaultValue="">
        <option value="">Не уверен(а), подскажите сами</option>
        <option value="ophthalmology">Офтальмология</option>
        <option value="ent">Оториноларингология</option>
        <option value="stomatology">Стоматология</option>
        <option value="ct">КТ-диагностика</option>
      </Select>
    </Field>
  </div>
);

export const Preselected = () => (
  <div className="max-w-sm">
    <Field label="Направление" hint="Подставлено кликом по плитке направления">
      <Select defaultValue="ct">
        <option value="">Не уверен(а), подскажите сами</option>
        <option value="ophthalmology">Офтальмология</option>
        <option value="ent">Оториноларингология</option>
        <option value="stomatology">Стоматология</option>
        <option value="ct">КТ-диагностика</option>
      </Select>
    </Field>
  </div>
);

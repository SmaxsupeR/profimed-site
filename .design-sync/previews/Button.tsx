import { Button } from 'profimed-site';

export const Variants = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
    <Button variant="primary">Записаться на приём</Button>
    <Button variant="secondary">Позвонить в клинику</Button>
    <Button variant="ghost">Отправить ещё одну заявку</Button>
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
    <Button size="sm">Записаться</Button>
    <Button size="md">Записаться</Button>
    <Button size="lg">Записаться на приём</Button>
  </div>
);

export const AsLink = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
    <Button href="#booking">Якорь на форму</Button>
    <Button href="tel:+998951956119" variant="secondary">+998 95 195 61 19</Button>
  </div>
);

export const Disabled = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
    <Button disabled>Отправить заявку</Button>
    <Button variant="secondary" disabled>Позвонить</Button>
  </div>
);

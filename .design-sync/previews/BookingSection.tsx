import { BookingSection } from 'profimed-site';

// presetDirection/selectedIds опциональны (см. .d.ts) — без них секция
// самодостаточна и в изолированном превью, форма просто открывается с
// пустыми полями и обычным select направления.
export const Default = () => <BookingSection />;

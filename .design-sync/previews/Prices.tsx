import { Prices } from 'profimed-site';

// selectedIds/onToggleService/onClearSelected опциональны (см. .d.ts) —
// без них секция самодостаточна и в изолированном превью, просто без
// панели «Выбрано услуг» (она и на сайте показывается только при
// непустом выборе).
export const Default = () => <Prices />;

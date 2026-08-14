import { SectionHeader } from 'profimed-site';

// Текстоёмкое превью — на нём видно, применилась ли Literata к кириллице.
// Именно здесь ловятся проблемы со шрифтами, которые не видны на кнопках.

export const WithEyebrow = () => (
  <SectionHeader eyebrow="Направления" title="Чем занимается клиника" />
);

export const WithDescription = () => (
  <SectionHeader
    eyebrow="Врачи"
    title="Специалисты клиники"
    description="Карточки врачей заполним из CRM — здесь появятся реальные фото, имена и стаж."
  />
);

export const TitleOnly = () => <SectionHeader title="Прайс-лист" />;

export const LongTitle = () => (
  <SectionHeader
    eyebrow="Оториноларингология"
    title="Лечение уха, горла и носа — от острых состояний до плановых операций"
    description="Заголовок в две строки: проверяем перенос и что строки не слипаются."
  />
);

import { PhotoPlaceholder } from 'profimed-site';

// Заглушка вместо фото — пока нет реальной съёмки клиники и врачей.
// Осознанное решение: не тормозить макет ради фотосессии.

export const Wide = () => <PhotoPlaceholder label="Фото клиники" className="aspect-[4/3] w-80" />;

export const Square = () => <PhotoPlaceholder label="Фото врача" className="aspect-square w-56" />;

export const NoLabel = () => <PhotoPlaceholder className="h-40 w-80" />;

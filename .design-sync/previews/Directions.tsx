import { Directions } from 'profimed-site';

// Клик по плитке отдаёт id направления наружу — на странице это скроллит
// к форме заявки и подставляет туда направление.

export const Default = () => <Directions onPick={(id) => console.log('выбрано направление:', id)} />;

// Точка входа библиотеки компонентов сайта.
//
// Сам сайт этот файл не импортирует — он собирается из main.jsx. Баррель нужен
// как единый список того, что считается публичным API дизайн-системы: его
// читает синхронизация с claude.ai/design, чтобы понять, какие компоненты
// вообще существуют. Без него пришлось бы угадывать по содержимому src/.
//
// Добавил компонент, который должен быть частью системы, — допиши сюда строку.

// Примитивы — из них собрано всё остальное.
export { Button } from './components/ui/Button.jsx';
export { Card } from './components/ui/Card.jsx';
export { Field, Input, Select, Textarea } from './components/ui/Field.jsx';
export { Section, SectionHeader } from './components/ui/Section.jsx';
export { PhotoPlaceholder } from './components/PhotoPlaceholder.jsx';

// Секции страницы — готовые блоки, собранные из примитивов выше.
export { Header } from './components/Header.jsx';
export { Hero } from './components/Hero.jsx';
export { Directions } from './components/Directions.jsx';
export { Doctors } from './components/Doctors.jsx';
export { Prices } from './components/Prices.jsx';
export { Reviews } from './components/Reviews.jsx';
export { BookingForm } from './components/BookingForm.jsx';
export { Contact } from './components/Contact.jsx';
export { Footer } from './components/Footer.jsx';

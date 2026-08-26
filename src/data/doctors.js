import { DIRECTIONS } from './directions.js';

// Плейсхолдерный слой врачей — этап 3.12. Один к одному с направлениями,
// как и в дорефакторинговой версии секции, но теперь это самостоятельная
// сущность «врач» со своей формой полей, а не просто перечисление
// направлений напрямую в разметке. Форма полей — то, что заменит будущий
// CRM/CMS-импорт один в один: подставит реальные photo/category/
// experienceYears/education и т.д. по тем же ключам, порядок и код
// компонентов трогать не придётся.
//
// slug, category, experienceYears, serviceIds, published, sortOrder — поля
// приняты по брифу заранее, хотя сейчас используются частично: это и есть
// «не строить архитектуру, которую придётся выбросить», а не подготовка
// впрок ради architecture astronautics — каждое поле уже читается компонентом
// (см. DoctorProfile.jsx), просто у всех, кроме одной записи, оно пустое.
//
// verified: true стоит только у офтальмолога — единственного врача, чьи имя
// и специализация уже одобрены и опубликованы на сайте (см. Laser.jsx,
// dict.js: laser.doctorName/doctorRole). Переводы имени и роли для карточки
// и профиля продублированы в dict.js (doc.d1Name/d1Role) намеренно, а не
// импортированы из laser-ключей: секции разные, и завтрашняя правка текста
// в Laser не должна тихо переименовать врача в Doctors.
//
// Для остальных трёх направлений реального врача пока нет. Придумывать имя,
// категорию или стаж запрещено брифом (раздел 22) — они остаются честными
// плейсхолдерами: фото-заглушка и название направления вместо имени, точно
// как было в исходной версии секции.
export const DOCTORS = DIRECTIONS.map((direction, i) => ({
  id: direction.id,
  slug: direction.id === 'ophthalmology' ? 'usmanov-akbar' : null,
  directionId: direction.id,
  photo: null,
  verified: direction.id === 'ophthalmology',
  category: null,
  experienceYears: null,
  shortBio: null,
  bio: null,
  education: [],
  certificates: [],
  languages: [],
  serviceIds: [],
  published: true,
  sortOrder: i,
}));

import { useLang } from '../i18n/LangContext.jsx';
import { Button } from './ui/Button.jsx';
import { PhotoPlaceholder } from './PhotoPlaceholder.jsx';

// Чистое содержимое профиля врача — без диалогового каркаса (portal,
// фокус-трап, Escape, задний фон). Раньше это и было диалогом целиком
// (этап 3.12, первая версия): открывался модальным окном поверх Doctors.
// Пользователь прямо попросил не окно, а полноценную страницу с
// собственным адресом — /doctors/usmanov-akbar, на которую можно
// сослаться. Модальная обвязка ушла целиком (см. историю коммитов, если
// понадобится вернуть быстрый предпросмотр), контент остался — он ровно
// то же самое до и после: фото, имя, роль, био, образование, запись.
// Рендерится и в DoctorPage.jsx (единственный потребитель сейчас), и это
// ровно то место, которое подставит будущий route-компонент, если разбор
// путей когда-нибудь переедет на настоящий роутер.
export function DoctorProfileContent({ doctor, onBook }) {
  const { t } = useLang();

  const name = doctor.name ?? doctor.directionTitle;
  const role = doctor.name ? doctor.role : t.doc.note;

  return (
    <div className="grid gap-6 sm:grid-cols-[280px_1fr] sm:gap-8">
      <PhotoPlaceholder
        label={t.doc.photo}
        radius="rounded-2xl"
        className="aspect-[4/3] w-full sm:aspect-[4/5]"
      />

      <div>
        <h1 className="font-display text-[28px] sm:text-[32px] leading-[1.15] text-slate-900 text-balance dark:text-slate-50">
          {name}
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">{role}</p>
        {doctor.factLine && (
          <p className="mt-3 text-sm font-medium text-primary-700 dark:text-primary-300">{doctor.factLine}</p>
        )}
        {doctor.shortBio && (
          <p className="mt-4 text-slate-600 leading-relaxed dark:text-slate-300">{doctor.shortBio}</p>
        )}

        {/* Разделы ниже рендерятся только при реальных данных — без этого
            пациент увидел бы «Образование —» под именем единственного
            пока заполненного врача. Пустая секция хуже отсутствующей:
            выглядит как недоделанный профиль, а не как «эти данные ещё
            не внесены». */}
        {doctor.bio && (
          <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 mb-2 dark:text-slate-50">{t.doc.aboutTitle}</h2>
            <p className="text-slate-600 leading-relaxed dark:text-slate-300">{doctor.bio}</p>
          </div>
        )}

        {doctor.education?.length > 0 && (
          <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 mb-3 dark:text-slate-50">{t.doc.educationTitle}</h2>
            <ul className="grid gap-3">
              {doctor.education.map((item, i) => (
                <li key={i} className="grid grid-cols-[3.5rem_1fr] gap-3 text-sm">
                  <span className="tabular-nums text-slate-400 dark:text-slate-400">{item.year}</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {item.institution}
                    {item.qualification && <span className="text-slate-500 dark:text-slate-400"> — {item.qualification}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
          <Button onClick={onBook}>{t.doc.bookCta}</Button>
        </div>
      </div>
    </div>
  );
}

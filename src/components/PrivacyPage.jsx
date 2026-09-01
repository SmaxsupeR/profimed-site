import { ArrowLeft } from 'lucide-react';
import { useDocumentMeta } from '../hooks/useDocumentMeta.js';
import { useLang } from '../i18n/LangContext.jsx';
import { LEGAL, isFilled } from '../data/legal.js';
import { PRIVACY } from '../legal/privacyText.js';
import { Footer } from './Footer.jsx';
import logoMark from '../assets/profimed-logo-mark.svg';

// Отдельная страница политики (собирается вторым входом Vite, см.
// vite.config.js и privacy/index.html). Полную шапку сайта сюда не тянем:
// её меню состоит из якорей вида #directions, которых на этой странице нет,
// и все пункты вели бы в никуда. Вместо неё — узкая полоса с логотипом и
// возвратом на главную. Подвал, наоборот, переиспользуется как есть: он
// самодостаточен (логотип, копирайт, реквизиты, переключатели языка и темы)
// и не ссылается ни на один якорь главной.
//
// Реквизиты выводятся из data/legal.js через isFilled: незаполненное поле
// не показывается пациенту вовсе. Публиковать «Лицензия: [УКАЗАТЬ: номер]»
// на сайте медицинской клиники хуже, чем не показать строку совсем.
export function PrivacyPage() {
  const { t, lang } = useLang();
  const doc = PRIVACY[lang] ?? PRIVACY.ru;
  const labels = doc.operatorLabels;

  // privacy/index.html даёт статичный русский <title>/description на
  // первый показ (см. комментарий в vite.config.js) — верный дефолт для
  // прямого захода и для поисковика. Хук поправляет их на клиенте, если
  // язык не русский или переключился уже после монтирования.
  useDocumentMeta(t.meta.privacyTitle, t.meta.privacyDesc);

  // Лицензия разложена на три строки, а не склеена в одну: номер, срок
  // действия и выдавший орган — разные по смыслу сведения, и слепленные
  // через запятую они читаются как сплошная строка мелкого шрифта, мимо
  // которой глаз проходит. Срок действия показывается диапазоном, как в
  // самом документе: пациенту важно не когда лицензию выдали, а что она
  // действует сейчас.
  const licenseValidity = isFilled(LEGAL.licenseValidFrom) && isFilled(LEGAL.licenseValidTo)
    ? `${LEGAL.licenseValidFrom} — ${LEGAL.licenseValidTo}`
    : null;

  // Реквизиты юрлица. Фактический адрес клиники берётся из общего словаря
  // (con.addr), а не дублируется в legal.js: он уже показан в контактах на
  // главной, и два независимых источника одного адреса рано или поздно
  // разъедутся при переезде.
  const entityRows = [
    isFilled(LEGAL.entityName) && [labels.entityName, LEGAL.entityName],
    isFilled(LEGAL.taxId) && [labels.taxId, LEGAL.taxId],
    isFilled(LEGAL.licenseNumber) && [labels.license, `№ ${LEGAL.licenseNumber}`],
    licenseValidity && [labels.licenseValidity, licenseValidity],
    isFilled(LEGAL.licenseIssuer) && [labels.licenseIssuer, LEGAL.licenseIssuer],
    isFilled(LEGAL.legalAddress) && [labels.legalAddress, LEGAL.legalAddress],
    [labels.clinicAddress, t.con.addr],
  ].filter(Boolean);

  // Контакты для обращений именно по персональным данным — отдельным
  // блоком от реквизитов: это не «где находится клиника», а «куда писать,
  // чтобы отозвать согласие», и пациент должен найти это одним взглядом.
  //
  // Только почта. Телефона здесь сознательно нет: единственный общий номер
  // клиники — это регистратура, а она за вопросы обработки персональных
  // данных не отвечает. Дать её как канал для отзыва согласия — значит
  // отправить человека туда, где ему не смогут помочь, и превратить
  // обещание политики в футбол между сотрудниками.
  //
  // Фамилии сотрудника здесь тоже нет: оператор данных — юрлицо, а
  // публиковать чьё-то ФИО в документе о защите персональных данных
  // только потому, что человек обслуживает сайт, значит раскрывать лишнее.
  // Ответственный за жалобы и предложения — другая роль и другой канал,
  // он живёт в секции контактов на главной, не здесь.
  const contactRows = [
    isFilled(LEGAL.privacyEmail) && [labels.privacyEmail, LEGAL.privacyEmail, `mailto:${LEGAL.privacyEmail}`],
  ].filter(Boolean);

  const updated = LEGAL.policyUpdatedLabel[lang] ?? LEGAL.policyUpdatedLabel.ru;

  return (
    <div className="min-h-dvh flex flex-col bg-white dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800">
        <div className="pm-container px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center" aria-label="ProfiMed">
            <span
              role="img"
              aria-label="ProfiMed"
              className="pm-logo-mask h-8"
              style={{ WebkitMaskImage: `url(${logoMark})`, maskImage: `url(${logoMark})` }}
            />
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200"
          >
            <ArrowLeft size={16} />
            {doc.back}
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* max-w-[68ch] — предел читаемой длины строки для сплошного текста.
            pm-container задаёт 72rem, и на широком мониторе строки политики
            растянулись бы почти на всю ширину, что для длинного документа
            заметно тяжелее читается, чем для секций главной с их сеткой. */}
        <article className="pm-container px-4 sm:px-6 py-12 sm:py-16 max-w-[68ch]">
          <h1 className="font-display text-[30px] sm:text-[38px] leading-[1.15] text-slate-900 text-balance dark:text-slate-50">
            {doc.title}
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            {doc.updatedLabel} <time dateTime={LEGAL.policyUpdatedAt}>{updated}</time>
          </p>

          <section className="mt-9">
            <h2 className="text-[19px] font-semibold text-slate-900 mb-3 dark:text-slate-50">{doc.operatorTitle}</h2>
            <div className="rounded-2xl border border-slate-200 p-5 sm:p-6 dark:border-slate-800">
              <p className="text-sm text-slate-600 mb-4 dark:text-slate-400">{doc.operatorIntro}</p>
              <dl className="grid gap-3 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-x-6">
                {entityRows.map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="text-sm text-slate-600 dark:text-slate-400">{label}</dt>
                    <dd className="text-sm text-slate-900 dark:text-slate-200">{value}</dd>
                  </div>
                ))}
              </dl>

              {contactRows.length > 0 && (
                <>
                  <p className="text-sm font-medium text-slate-900 mt-6 mb-3 dark:text-slate-200">
                    {doc.operatorContactsTitle}
                  </p>
                  <dl className="grid gap-3 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-x-6">
                    {contactRows.map(([label, value, href]) => (
                      <div key={label} className="contents">
                        <dt className="text-sm text-slate-600 dark:text-slate-400">{label}</dt>
                        <dd className="text-sm text-slate-900 dark:text-slate-200">
                          {href ? (
                            <a href={href} className="text-primary-700 hover:underline dark:text-primary-300">{value}</a>
                          ) : value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}

              {/* Пока официальный адрес для обращений не утверждён, честнее
                  сказать об этом прямо, чем молча не показать строку: у
                  пациента иначе останется вопрос, куда писать. Подставлять
                  сюда общую почту клиники нельзя — политика обещала бы
                  канал, который для этих обращений не согласован. */}
              {!isFilled(LEGAL.privacyEmail) && (
                <p className="text-sm text-slate-600 mt-4 dark:text-slate-400">{doc.operatorEmailPending}</p>
              )}
            </div>
          </section>

          {doc.sections.map((section) => (
            <section key={section.h} className="mt-9">
              <h2 className="text-[19px] font-semibold text-slate-900 mb-2.5 dark:text-slate-50">{section.h}</h2>
              {section.blocks.map((block, i) =>
                block.t === 'ul' ? (
                  <ul key={i} className="mb-3 last:mb-0 list-disc pl-5 grid gap-1.5 marker:text-slate-400 dark:marker:text-slate-600">
                    {block.v.map((item, j) => (
                      <li key={j} className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i} className="text-[15px] leading-relaxed text-slate-700 mb-3 last:mb-0 dark:text-slate-300">
                    {block.v}
                  </p>
                )
              )}
            </section>
          ))}
        </article>
      </main>

      <Footer />
    </div>
  );
}

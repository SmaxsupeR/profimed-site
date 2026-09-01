import { Fragment, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2, X } from 'lucide-react';
import { parsePhoneNumberFromString } from 'libphonenumber-js/core';
import { DIRECTIONS } from '../data/directions.js';
import { LEGAL } from '../data/legal.js';
import phoneMetadata from '../data/phoneMetadataUz.json';
import { useSelectedServiceList } from '../hooks/useSelectedServiceList.js';
import { useLang } from '../i18n/LangContext.jsx';
import { formatCount } from '../i18n/plural.js';
import { Card } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Field, Input, Select } from './ui/Field.jsx';

// Поля свободного текста здесь нет намеренно. Комментарий («что беспокоит»)
// был убран вместе с соответствующим абзацем политики: сколько ни пиши
// рядом «не указывайте диагнозы», человек видит пустое поле и пишет туда
// историю болезни. Форма, которая физически не может принять медицинские
// сведения, надёжнее просьбы их не вводить — и заодно упрощает юридическую
// модель: через сайт передаются только имя, телефон и направление.
const initialForm = { fio: '', phone: '', direction: '', consent: false };

// selectedIds/onRemoveService/onSubmitted — тот же выбор услуг, что и в
// Prices.jsx, тем же путём (пропсы из App.jsx → Page(), не React Context —
// см. подробное обоснование в hooks/useSelectedServices.js). onRemoveService
// — это toggle из App.jsx: вызванный для уже выбранной услуги, он и есть
// «удалить», отдельной функции на «убрать одну позицию» не нужно.
export function BookingForm({ presetDirection, selectedIds = [], onRemoveService = () => {}, onSubmitted = () => {} }) {
  const { t, lang } = useLang();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | done | error
  const [announcement, setAnnouncement] = useState('');
  const { list: selectedList, categories: selectedCategories } = useSelectedServiceList(selectedIds);
  const hasServices = selectedList.length > 0;

  useEffect(() => {
    if (presetDirection) setForm((f) => ({ ...f, direction: presetDirection }));
  }, [presetDirection]);

  // Тот же приём, что и в Prices.jsx (см. подробный комментарий там):
  // считаем не по устаревшему замыканию selectedIds внутри обработчика
  // клика, а по факту изменившейся длины после ререндера, и озвучиваем
  // только изменения, начатые нажатием крестика ЗДЕСЬ — иначе, скажем,
  // добавление услуги в Prices.jsx (тот же общий selectedIds) звучало бы
  // и в этом, никак не участвовавшем в действии компоненте.
  const prevCountRef = useRef(selectedIds.length);
  const pendingAnnounceRef = useRef(false);

  useEffect(() => {
    const prevCount = prevCountRef.current;
    const nextCount = selectedIds.length;
    if (pendingAnnounceRef.current && nextCount !== prevCount) {
      setAnnouncement(
        nextCount === 0
          ? t.price.liveClearedAll
          : t.price.liveRemoved.replace('{n}', nextCount).replace('{word}', formatCount(nextCount, t.price.unitWord, lang))
      );
    }
    pendingAnnounceRef.current = false;
    prevCountRef.current = nextCount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds]);

  const handleRemoveService = (svc) => {
    pendingAnnounceRef.current = true;
    onRemoveService(svc.id);
  };

  // Ошибка поля гаснет, как только его начали править: держать её до
  // повторной отправки — значит показывать красным то, что человек уже
  // исправляет прямо сейчас.
  const set = (key) => (e) => {
    // Чекбокс согласия читается из checked, остальные поля — из value.
    const next = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: next }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Телефон — единственный способ ответить на заявку: администратор
    // перезванивает, почту мы не спрашиваем. Раньше здесь был молчаливый
    // `return` при пустых полях, а формат номера не проверялся вообще —
    // «asdf» уезжал как валидная заявка, и она превращалась в потерянного
    // пациента, о котором никто не узнает. defaultCountry 'UZ' позволяет
    // ввести и местный формат «90 123 45 67», и полный «+998 90 123 45 67».
    //
    // Импорт именно из /core со своими метаданными, а не из корня пакета:
    // корневой импорт тянет справочник всех стран мира (+31 КБ gzip к
    // бандлу) ради единственной страны, в которой принимает клиника.
    // src/data/phoneMetadataUz.json — те же данные, отфильтрованные до UZ
    // (385 байт). Как пересобрать после обновления libphonenumber-js:
    //   node -e "const m=require('libphonenumber-js/metadata.min.json');
    //   require('fs').writeFileSync('src/data/phoneMetadataUz.json',
    //   JSON.stringify({version:m.version,country_calling_codes:{'998':['UZ']},
    //   countries:{UZ:m.countries.UZ},nonGeographic:{}},null,2))"
    const phone = parsePhoneNumberFromString(form.phone, 'UZ', phoneMetadata);
    const nextErrors = {};
    if (!form.fio.trim()) nextErrors.fio = t.form.errName;
    if (!phone || !phone.isValid()) nextErrors.phone = t.form.errPhone;
    if (!form.consent) nextErrors.consent = t.form.errConsent;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setStatus('submitting');
    try {
      // Запись о согласии. Отметка проставляется здесь, а не на сервере:
      // consentAt должен фиксировать момент, когда человек нажал отправку с
      // проставленной галочкой, а не когда запрос доехал до CRM.
      // privacyPolicyVersion — дата редакции политики из data/legal.js:
      // текст со временем меняется, и без версии запись о согласии не
      // отвечает на главный вопрос — с чем именно человек согласился.
      // Если выбраны услуги — направление больше не то, что выбрано в
      // select (тот вообще скрыт, см. JSX ниже): при одной затронутой
      // специализации это она и есть, при нескольких — единого значения
      // корректно не существует, вся правда уже в selectedCategories, и
      // тянуть сюда произвольную «первую попавшуюся» значило бы соврать.
      const effectiveDirection = hasServices
        ? (selectedCategories.length === 1 ? selectedCategories[0].id : '')
        : form.direction;

      const payload = {
        name: form.fio.trim(),
        // E.164 («+998901234567») независимо от того, как пациент набрал
        // номер: в CRM попадёт один формат, а не пять написаний одного
        // номера, по которым потом не найти дубли.
        phone: phone.number,
        direction: effectiveDirection,
        // Услуги — этап 3.14. services хранит всё, что реально может
        // понадобиться CRM-импорту заявки (id для сопоставления с
        // каталогом, name/category — на случай, если каталог к моменту
        // обработки заявки уже изменится, displayedPrice — то, что видел
        // пациент, а не «итог», который мы намеренно не считаем).
        // selectedServiceIds/selectedServiceNames/selectedCategories —
        // те же данные плоскими массивами, для потребителей, которым
        // не нужен вложенный объект целиком.
        services: selectedList.map((svc) => ({
          id: svc.id,
          name: svc.name,
          category: svc.categoryId,
          ...(svc.price != null ? { displayedPrice: svc.priceLabel } : {}),
        })),
        selectedServiceIds: selectedList.map((svc) => svc.id),
        selectedServiceNames: selectedList.map((svc) => svc.name),
        selectedCategories: selectedCategories.map((c) => c.id),
        consent: true,
        consentAt: new Date().toISOString(),
        privacyPolicyVersion: LEGAL.policyUpdatedAt,
      };

      // TODO: заменить на реальный POST /api/public/booking-request, когда
      // на сервере CRM появится этот маршрут (см. бриф, «Заявка на приём»).
      // Пока — заявка нигде не сохраняется, это чисто визуальный макет формы.
      // payload собран заранее и в готовом виде: когда маршрут появится,
      // менять останется только эту строку, а не структуру данных.
      //
      // services/selectedService* — новые поля этапа 3.14, серверный
      // маршрут их пока не ждёт вообще (самого маршрута ещё нет). Когда он
      // появится, именно эта часть формы данных — то место, которое нужно
      // явно согласовать с бэкендом/CRM: как минимум подтвердить, что поле
      // называется «services», а не иначе, и что displayedPrice — это
      // строка для отображения, а не число для расчётов.
      void payload;
      await new Promise((resolve) => setTimeout(resolve, 700));
      setStatus('done');
      setForm(initialForm);
      // Выбор очищается только при успехе: при ошибке отправки человек не
      // должен заново собирать список услуг, чтобы попробовать ещё раз.
      onSubmitted();
    } catch {
      setStatus('error');
    }
  };

  // Заголовок над карточкой формы — этап 3.15. Раньше якорь #booking вёл
  // прямо на поля «Ваше имя»/«Телефон» без единого слова о том, что это за
  // блок и зачем в него что-то вводить; заголовок теперь и есть та точка,
  // на которую реально попадает скролл (#booking стоит на Section в
  // BookingSection.jsx, которая рендерит именно эту форму первым и
  // единственным содержимым — см. комментарий там). «Ваш визит» вместо
  // «Запись на приём», когда уже выбраны услуги, — тот же приём, что и
  // заголовок раскрытой мобильной панели в Prices.jsx
  // (t.form.bookingTitleServices, общий ключ на оба места).
  const heading = (
    <div className="mb-5">
      <h2 className="font-display text-2xl text-slate-900 dark:text-slate-50">
        {hasServices ? t.form.bookingTitleServices : t.form.bookingTitle}
      </h2>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        {hasServices ? t.form.bookingSubtitleServices : t.form.bookingSubtitle}
      </p>
    </div>
  );

  if (status === 'done') {
    return (
      <Fragment>
        {heading}
        <Card className="p-8 flex flex-col items-center text-center gap-3">
          <CheckCircle2 size={32} className="text-primary-600 dark:text-primary-400" />
          <h3 className="font-display text-xl text-slate-900 dark:text-slate-50">{t.form.okTitle}</h3>
          <p className="text-slate-500 text-sm max-w-sm dark:text-slate-400">{t.form.okText}</p>
          <Button variant="ghost" size="sm" onClick={() => setStatus('idle')} className="mt-2">
            {t.form.again}
          </Button>
        </Card>
      </Fragment>
    );
  }

  return (
    <Fragment>
      {heading}
      {/* min-w-0 (этап 3.15, P1; актуальность после этапа 3.17 — ниже) —
          изначально Card/форма жили в grid-колонке старого Contact.jsx
          (lg:grid-cols-2, сетка контактов+формы). У grid-элементов
          min-width по умолчанию auto, а не 0: длинное неразрывное название
          услуги в блоке «Выбранные услуги» ниже иначе задавало бы
          min-content шириной больше самой колонки и раздувало сетку
          контактов вправо — с видимым горизонтальным скроллом на узких
          экранах (320–390px, см. репродукцию бага в брифе). Сейчас форма
          вложена в простой центрированный блок (BookingSection.jsx), не в
          grid-колонку, так что сам механизм бага уже не воспроизвести —
          но класс оставлен как есть (безвредный no-op в этом контексте, а
          не то, что стоит трогать без нужды), а [overflow-wrap:anywhere] у
          самого текста ниже — самостоятельная, не зависящая от контейнера
          защита от той же переполненной строки. min-w-0 явно разрешает колонке
          сжаться до отведённой ей ширины и переносить контент внутри, а не
          раздвигать сетку. */}
      <Card className="min-w-0 p-6 sm:p-8">
      {/* noValidate — проверяем сами. Со встроенной валидацией браузер
          перехватывал бы отправку раньше нас и показывал свою подсказку на
          языке браузера: на английской системе под русским интерфейсом
          сайта выскакивало бы «Please fill out this field». required
          оставлен ради семантики (aria-required для скринридеров). */}
      <form onSubmit={handleSubmit} noValidate className="min-w-0 grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t.form.name} error={errors.fio}>
            <Input
              required
              value={form.fio}
              onChange={set('fio')}
              placeholder={t.form.namePh}
              aria-invalid={errors.fio ? true : undefined}
            />
          </Field>
          <Field label={t.form.phone} error={errors.phone}>
            <Input
              required
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder="+998 __ ___ __ __"
              aria-invalid={errors.phone ? true : undefined}
            />
          </Field>
        </div>

        {/* Направление — этап 3.14. Пока услуги не выбраны, ведёт себя как
            раньше: обычный select с честным «не уверен(а), подскажите
            сами». Как только выбрана хоть одна услуга, направление уже
            известно из неё самой — просить человека продублировать этот
            выбор в выпадающем списке значило бы спрашивать дважды то, что
            он уже сказал кликом «Добавлено» в прайсе (бриф прямо это
            запрещает). Select в этом случае не просто задизейблен, а
            заменён на статичный текст: задизейбленный select с одним
            неверным выбранным значением выглядел бы как баг, а не как
            «поле стало ненужным». */}
        {hasServices ? (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {selectedCategories.length > 1 ? t.form.dirMulti : t.form.dir}
            </span>
            <p className="text-sm text-slate-800 break-words dark:text-slate-100">
              {selectedCategories.map((c) => c.title).join(', ')}
            </p>
          </div>
        ) : (
          <Field label={t.form.dir}>
            <Select value={form.direction} onChange={set('direction')}>
              <option value="">{t.form.dirAny}</option>
              {DIRECTIONS.map(({ id }, i) => (
                <option key={id} value={id}>{t.dir[`d${i + 1}t`]}</option>
              ))}
            </Select>
          </Field>
        )}

        {/* Выбранные услуги — этап 3.14, до согласия на обработку данных
            (бриф прямо требует именно это место в форме). Пустое состояние
            текстом, а не скрытием блока целиком: человек, который пришёл
            на форму напрямую (не через прайс), должен понимать, что вообще
            существует способ выбрать услуги заранее, а не просто видеть
            пустоту там, где у другого пользователя был бы список. */}
        <div aria-live="polite" className="sr-only">{announcement}</div>
        <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.form.svcTitle}</span>
            {hasServices && (
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">{selectedList.length}</span>
            )}
          </div>
          {hasServices ? (
            <>
              {/* min-w-0/break-words вместо truncate (этап 3.15, P1) — бриф
                  прямо запрещает однострочный ellipsis у названия услуги в
                  конечной форме: это главное подтверждение выбора, оно
                  должно читаться полностью, хоть в 2–3 строки.
                  [overflow-wrap:anywhere] — подстраховка для длинных
                  непрерывных значений без пробелов (не встречается в
                  текущих данных, но не полагаемся на это молча). Кнопка
                  удаления — 44×44px реальной зоны нажатия через отрицательный
                  margin, компенсирующий увеличенный padding: сама точка
                  клика выросла, видимый промежуток между строками — нет. */}
              <ul className="flex flex-col gap-1 mb-3">
                {selectedList.map((svc) => (
                  <li key={svc.id} className="flex min-w-0 items-start justify-between gap-3">
                    <span className="min-w-0 flex-1 py-2.5 text-sm text-slate-700 [overflow-wrap:anywhere] dark:text-slate-200">
                      {svc.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(svc)}
                      aria-label={t.price.removeAria.replace('{name}', svc.name)}
                      className="-m-2.5 flex h-11 w-11 shrink-0 items-center justify-center text-slate-400 transition-colors hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                    >
                      <X size={15} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
              <a
                href="/#prices"
                className="-my-2.5 inline-flex h-11 items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200"
              >
                {t.form.svcAdd}
              </a>
            </>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">{t.form.svcEmpty}</p>
          )}
        </div>

        {/* Согласие на обработку данных — настоящий чекбокс, а не строка
            «отправляя форму, вы соглашаетесь». Разница не косметическая: с
            галочкой в CRM уходит запись consent/consentAt/
            privacyPolicyVersion, то есть проверяемый факт согласия с
            конкретной редакцией политики, а не рассуждение «он же нажал
            кнопку». Ту же модель использует государственный реестр
            персональных данных.

            Чекбокс стоит ДО кнопки: он часть условий отправки, а не
            примечание после неё. Текст собирается подстановкой {link}, а не
            склейкой двух половин, — в узбекском ссылка стоит в середине
            предложения, и склейка дала бы неестественный порядок слов. */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={set('consent')}
            aria-invalid={errors.consent ? true : undefined}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-400 dark:border-slate-600 dark:bg-slate-800"
          />
          <span className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {t.form.consent.split('{link}').map((part, i) => (
              <span key={i}>
                {part}
                {i === 0 && (
                  <a
                    href="/privacy/"
                    // Ссылка внутри label: без stopPropagation клик по ней
                    // сначала переключил бы чекбокс (label ловит клик), и
                    // человек ушёл бы читать политику, случайно сняв или
                    // поставив галочку.
                    onClick={(e) => e.stopPropagation()}
                    className="underline text-primary-700 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200"
                  >
                    {t.form.consentLink}
                  </a>
                )}
              </span>
            ))}
          </span>
        </label>
        {errors.consent && (
          <p role="alert" className="text-xs text-red-600 -mt-2 dark:text-red-400">{errors.consent}</p>
        )}

        {status === 'error' && (
          <p className="text-sm text-red-600 dark:text-red-400">{t.form.err}</p>
        )}

        <Button type="submit" size="lg" disabled={status === 'submitting'}>
          {status === 'submitting' && <Loader2 size={16} className="animate-spin" />}
          {t.form.submit}
        </Button>
        <p className="text-xs text-slate-400 -mt-1 dark:text-slate-400">{t.form.note}</p>
      </form>
      </Card>
    </Fragment>
  );
}

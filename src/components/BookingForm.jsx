import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { parsePhoneNumberFromString } from 'libphonenumber-js/core';
import { DIRECTIONS } from '../data/directions.js';
import { LEGAL } from '../data/legal.js';
import phoneMetadata from '../data/phoneMetadataUz.json';
import { useLang } from '../i18n/LangContext.jsx';
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

export function BookingForm({ presetDirection }) {
  const { t } = useLang();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | done | error

  useEffect(() => {
    if (presetDirection) setForm((f) => ({ ...f, direction: presetDirection }));
  }, [presetDirection]);

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
      const payload = {
        name: form.fio.trim(),
        // E.164 («+998901234567») независимо от того, как пациент набрал
        // номер: в CRM попадёт один формат, а не пять написаний одного
        // номера, по которым потом не найти дубли.
        phone: phone.number,
        direction: form.direction,
        consent: true,
        consentAt: new Date().toISOString(),
        privacyPolicyVersion: LEGAL.policyUpdatedAt,
      };

      // TODO: заменить на реальный POST /api/public/booking-request, когда
      // на сервере CRM появится этот маршрут (см. бриф, «Заявка на приём»).
      // Пока — заявка нигде не сохраняется, это чисто визуальный макет формы.
      // payload собран заранее и в готовом виде: когда маршрут появится,
      // менять останется только эту строку, а не структуру данных.
      void payload;
      await new Promise((resolve) => setTimeout(resolve, 700));
      setStatus('done');
      setForm(initialForm);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <Card className="p-8 flex flex-col items-center text-center gap-3">
        <CheckCircle2 size={32} className="text-primary-600 dark:text-primary-400" />
        <h3 className="font-display text-xl text-slate-900 dark:text-slate-50">{t.form.okTitle}</h3>
        <p className="text-slate-500 text-sm max-w-sm dark:text-slate-400">{t.form.okText}</p>
        <Button variant="ghost" size="sm" onClick={() => setStatus('idle')} className="mt-2">
          {t.form.again}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      {/* noValidate — проверяем сами. Со встроенной валидацией браузер
          перехватывал бы отправку раньше нас и показывал свою подсказку на
          языке браузера: на английской системе под русским интерфейсом
          сайта выскакивало бы «Please fill out this field». required
          оставлен ради семантики (aria-required для скринридеров). */}
      <form onSubmit={handleSubmit} noValidate className="grid gap-4">
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

        <Field label={t.form.dir}>
          <Select value={form.direction} onChange={set('direction')}>
            <option value="">{t.form.dirAny}</option>
            {DIRECTIONS.map(({ id }, i) => (
              <option key={id} value={id}>{t.dir[`d${i + 1}t`]}</option>
            ))}
          </Select>
        </Field>

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
                    className="underline text-primary-700 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
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
        <p className="text-xs text-slate-400 -mt-1 dark:text-slate-500">{t.form.note}</p>
      </form>
    </Card>
  );
}

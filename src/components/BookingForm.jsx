import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { DIRECTIONS } from '../data/directions.js';
import { useLang } from '../i18n/LangContext.jsx';
import { Card } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Field, Input, Select, Textarea } from './ui/Field.jsx';

const initialForm = { fio: '', phone: '', direction: '', comment: '' };

export function BookingForm({ presetDirection }) {
  const { t } = useLang();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | submitting | done | error

  useEffect(() => {
    if (presetDirection) setForm((f) => ({ ...f, direction: presetDirection }));
  }, [presetDirection]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fio.trim() || !form.phone.trim()) return;
    setStatus('submitting');
    try {
      // TODO: заменить на реальный POST /api/public/booking-request, когда
      // на сервере CRM появится этот маршрут (см. бриф, «Заявка на приём»).
      // Пока — заявка нигде не сохраняется, это чисто визуальный макет формы.
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
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t.form.name}>
            <Input required value={form.fio} onChange={set('fio')} placeholder={t.form.namePh} />
          </Field>
          <Field label={t.form.phone}>
            <Input required type="tel" value={form.phone} onChange={set('phone')} placeholder="+998 __ ___ __ __" />
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

        <Field label={t.form.comment}>
          <Textarea value={form.comment} onChange={set('comment')} placeholder={t.form.commentPh} />
        </Field>

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

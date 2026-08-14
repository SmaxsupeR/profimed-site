import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { DIRECTIONS } from '../data/directions.js';
import { Card } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { Field, Input, Select, Textarea } from './ui/Field.jsx';

const initialForm = { fio: '', phone: '', direction: '', comment: '' };

export function BookingForm({ presetDirection }) {
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
        <CheckCircle2 size={32} className="text-leaf-600" />
        <h3 className="font-display text-xl text-slate-900">Заявка отправлена</h3>
        <p className="text-slate-500 text-sm max-w-sm">
          Администратор клиники свяжется с вами и подтвердит время приёма.
        </p>
        <Button variant="ghost" size="sm" onClick={() => setStatus('idle')} className="mt-2">
          Отправить ещё одну заявку
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Ваше имя">
            <Input required value={form.fio} onChange={set('fio')} placeholder="Как к вам обращаться" />
          </Field>
          <Field label="Телефон">
            <Input required type="tel" value={form.phone} onChange={set('phone')} placeholder="+998 __ ___ __ __" />
          </Field>
        </div>

        <Field label="Направление">
          <Select value={form.direction} onChange={set('direction')}>
            <option value="">Не уверен(а), подскажите сами</option>
            {DIRECTIONS.map((d) => (
              <option key={d.id} value={d.id}>{d.title}</option>
            ))}
          </Select>
        </Field>

        <Field label="Комментарий (необязательно)">
          <Textarea
            value={form.comment}
            onChange={set('comment')}
            placeholder="Что беспокоит, удобное время для звонка и т.п."
          />
        </Field>

        {status === 'error' && (
          <p className="text-sm text-red-600">
            Не получилось отправить заявку. Попробуйте ещё раз или позвоните нам — +998 95 195 61 19.
          </p>
        )}

        <Button type="submit" size="lg" disabled={status === 'submitting'}>
          {status === 'submitting' && <Loader2 size={16} className="animate-spin" />}
          Отправить заявку
        </Button>
        <p className="text-xs text-slate-400 -mt-1">
          Это заявка на приём, не оплата — администратор перезвонит и согласует время.
        </p>
      </form>
    </Card>
  );
}

// Поля формы. Все три контрола (текст, список, многострочный) делят одну
// строку классов — иначе они незаметно разъезжаются по высоте и радиусу,
// когда правишь только один из них.
//
// Field — это подпись + контрол. Подпись именно <label>, оборачивающая поле,
// чтобы клик по тексту ставил фокус в поле (важнее всего на телефоне, где
// в поля попадают пальцем).

const CONTROL =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 ' +
  'placeholder:text-slate-400 transition-colors ' +
  'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 ' +
  'dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500';

export function Field({ label, hint, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      {children}
      {hint && <span className="text-xs text-slate-400 dark:text-slate-500">{hint}</span>}
    </label>
  );
}

export function Input({ className = '', ...rest }) {
  return <input className={`${CONTROL} ${className}`} {...rest} />;
}

export function Select({ className = '', children, ...rest }) {
  return (
    <select className={`${CONTROL} ${className}`} {...rest}>
      {children}
    </select>
  );
}

export function Textarea({ className = '', rows = 3, ...rest }) {
  return <textarea rows={rows} className={`${CONTROL} resize-none ${className}`} {...rest} />;
}

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';

// Виджет-заглушка ИИ-помощника — сам текст в словаре честно говорит
// «черновик, отвечает демо-фразами» (chat.subtitle), реального бэкенда нет.
//
// Этап полировки 2 (единая стратегия fixed-элементов) — компонент теперь
// ВСЕГДА смонтирован (никогда не возвращает null и не размонтируется по
// ширине): его обёртка .pm-chat-fab должна существовать в DOM на любой
// ширине, чтобы у панели (ниже) была точка позиционирования
// (absolute right-0 bottom-[68px]) независимо от того, кто её открыл.
// Ниже 1024px скрывается CSS-классом (hidden lg:flex) только сама кнопка-
// FAB — доступ к открытию панели там даёт третья кнопка в
// MobileCallBar.jsx (onOpenChat), вызывающая тот же лифтованный
// open/onOpenChange, что и эта кнопка. Раньше это был проп `hidden`,
// управлявший видимостью всего компонента по формуле, завязанной на
// секцию прайса/карты и ширину экрана — теперь этого не нужно: ниже
// 1024px видимого FAB, который надо было бы прятать по секции, просто нет.
export function ChatWidget({ open = false, onOpenChange }) {
  const { t } = useLang();
  const setOpen = (next) => onOpenChange?.(typeof next === 'function' ? next(open) : next);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { from: 'user', text }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: t.chat.demoReply }]);
    }, 700);
  };

  return (
    <div className="pm-chat-fab">
      {open && (
        <div className="absolute right-0 bottom-[68px] w-80 max-w-[calc(100vw-32px)] h-[420px] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:bg-slate-800 dark:border-slate-700">
          <div className="shrink-0 bg-primary-600 px-4 py-3.5 flex items-center justify-between gap-2">
            <div>
              <p className="text-white font-bold text-sm">{t.chat.title}</p>
              <p className="text-white/80 text-[11px] mt-0.5">{t.chat.subtitle}</p>
            </div>
            {/* h-11 w-11 (этап полировки 11, было p-1 ≈ 26×26px факт.
                области) — минимальная touch target 44×44, иконка внутри
                того же размера.
                aria-label — отдельный ключ t.chat.close (найденный баг:
                раньше здесь стоял t.chat.send, то есть в открытой панели
                было ДВЕ кнопки «Отправить» — крестик закрытия и настоящая
                кнопка отправки ниже; скринридер не мог их различить). */}
            <button type="button" onClick={() => setOpen(false)} aria-label={t.chat.close} className="flex h-11 w-11 shrink-0 items-center justify-center text-white">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2 bg-white dark:bg-slate-800">
            <div className="flex justify-start">
              <span className="max-w-[85%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
                {t.chat.greeting}
              </span>
            </div>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.from === 'user' ? (
                  <span className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary-600 px-3 py-2 text-[13px] text-white">{msg.text}</span>
                ) : (
                  <span className="max-w-[85%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
                    {msg.text}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="shrink-0 flex gap-2 p-2.5 border-t border-slate-200 dark:border-slate-700">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              placeholder={t.chat.placeholder}
              className="flex-1 rounded-full border border-slate-300 bg-white px-3.5 py-2 text-[13px] outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 dark:bg-slate-950 dark:border-slate-600 dark:text-slate-100"
            />
            {/* h-11 w-11 (этап полировки 11, было w-[38px] h-[38px]) —
                минимальная touch target 44×44, иконка внутри того же
                размера. */}
            <button
              type="button"
              onClick={send}
              aria-label={t.chat.send}
              className="shrink-0 flex items-center justify-center h-11 w-11 rounded-full bg-primary-600 hover:bg-primary-700 text-white"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* hidden lg:flex (этап полировки 2) — единственное место, где FAB
          прячется по ширине: ниже 1024px кнопку заменяет иконка чата в
          MobileCallBar.jsx, вызывающая тот же onOpenChange. Сама кнопка
          при этом остаётся в DOM (просто display:none) — обёртка
          .pm-chat-fab и панель выше её не требуют. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.chat.fabLabel}
        className={`hidden lg:flex items-center justify-center w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-card-hover ${open ? '' : 'pm-fab-btn'}`}
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
}

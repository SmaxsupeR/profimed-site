import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'pm-selected-services';

// Тот же приём приватного режима, что и в i18n/LangContext.jsx и
// Splash.jsx: sessionStorage может бросить исключение (приватная вкладка,
// заблокированное хранилище) — тогда просто стартуем с пустого выбора,
// а не роняем страницу.
function readInitial() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

// Единый источник состояния «какие услуги выбраны» — вызывается один раз в
// App.jsx (Page()) и пробрасывается пропсами вниз в Prices и BookingForm,
// тем же способом, что уже несёт presetDirection/onPick. Отдельный
// React Context здесь намеренно не заводится: .design-sync/conventions.md
// прямо требует «никаких провайдеров и контекстов» — компоненты дизайн-
// системы должны собираться без обвязки, а обычный проп, в отличие от
// контекста, продолжает работать в изолированном превью без объявления.
//
// Хранит только id услуг (не сами объекты с именем/ценой): имя услуги
// зависит от текущего языка интерфейса, и, храня готовую строку, при
// переключении языка в выбранном списке остался бы текст на старом языке.
// Разрешение id → {name, price, ...} происходит отдельно, в
// useSelectedServiceList.js, на каждый рендер, как и everywhere else в
// проекте (useDoctors.js, useServices.js).
export function useSelectedServices() {
  const [selectedIds, setSelectedIds] = useState(readInitial);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
    } catch {
      /* приватный режим — выбор просто не переживёт обновление страницы */
    }
  }, [selectedIds]);

  const toggle = useCallback((id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const clear = useCallback(() => setSelectedIds([]), []);

  return { selectedIds, toggle, clear };
}

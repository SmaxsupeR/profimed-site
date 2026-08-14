import { BookingForm } from 'profimed-site';

// Состояния submitting/done изнутри компонента, статически их не выставить —
// это внутренний useState, который меняется только по реальной отправке.
// Здесь показываем то, что рендерится статически: пустая форма и форма
// с заранее выбранным направлением (так она открывается после клика по плитке).

export const Empty = () => <BookingForm />;

export const WithPresetDirection = () => <BookingForm presetDirection="stomatology" />;

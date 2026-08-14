import { PhotoPlaceholder } from './PhotoPlaceholder.jsx';
import { Button } from './ui/Button.jsx';

export function Hero() {
  return (
    <section id="top" className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm font-semibold text-leaf-700 uppercase tracking-wide mb-4">
            В Ташкенте с 2014 года
          </p>
          <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] text-slate-900 mb-5 text-balance">
            Тёплый приём с&nbsp;точной диагностикой
          </h1>
          <p className="text-lg text-slate-600 max-w-lg mb-8">
            Офтальмология, оториноларингология, стоматология и КТ-диагностика —
            под одной крышей, с современным оборудованием и врачами,
            которым доверяют не первый год.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="#booking" size="lg">Записаться на приём</Button>
            <Button href="tel:+998951956119" variant="secondary" size="lg">Позвонить в клинику</Button>
          </div>
        </div>

        <PhotoPlaceholder label="Фото клиники" className="aspect-[4/3] w-full" />
      </div>
    </section>
  );
}

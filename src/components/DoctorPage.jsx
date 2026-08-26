import { ArrowLeft } from 'lucide-react';
import { useLang } from '../i18n/LangContext.jsx';
import { useDoctors } from '../hooks/useDoctors.js';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import { MobileCallBar } from './MobileCallBar.jsx';
import { ScrollUi } from './ScrollUi.jsx';
import { ChatWidget } from './ChatWidget.jsx';
import { DoctorProfileContent } from './DoctorProfileContent.jsx';

// Настоящая страница врача, а не диалог поверх главной — по прямой просьбе:
// на неё должна работать обычная ссылка вида /doctors/usmanov-akbar,
// присланная кому-то в мессенджер, а не только состояние React-компонента
// внутри одной сессии. Роутинг — см. App.jsx (разбор pathname без
// библиотеки: единственный динамический сегмент не оправдывает react-router
// ради него одного). Полный набор глобальных элементов (Header/Footer/
// MobileCallBar/ScrollUi/ChatWidget) подключен намеренно: сюда попадают по
// прямой ссылке "холодным" визитом, а не только перелистыванием карусели
// на главной, — и такому визиту нужна та же навигация и точка записи, что
// и на главной, а не урезанная страница без выхода к остальному сайту.
// Splash сюда не подключаем: это экран-приветствие для первого захода на
// главную, а не для конкретного врача.
export function DoctorPage({ slug, onBack, onPick }) {
  const { t } = useLang();
  const doctors = useDoctors();
  const doctor = doctors.find((d) => d.routeSlug === slug);

  return (
    <div>
      <Header />
      <main>
        <div className="bg-white dark:bg-slate-950">
          <div className="pm-container px-4 sm:px-6 py-10 sm:py-14">
            <button
              type="button"
              onClick={onBack}
              className="mb-7 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              <ArrowLeft size={16} />
              {t.doc.back}
            </button>

            {doctor ? (
              <DoctorProfileContent doctor={doctor} onBook={() => onPick?.(doctor.directionId)} />
            ) : (
              <p className="text-slate-500 dark:text-slate-400">{t.doc.notFound}</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <MobileCallBar />
      <ScrollUi />
      <ChatWidget />
    </div>
  );
}

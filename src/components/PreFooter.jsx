import { useLang } from '../i18n/LangContext.jsx';
import { Button } from './ui/Button.jsx';

const NAV_HREFS = ['#directions', '#doctors', '#prices', '#reviews', '#contact'];

export function PreFooter() {
  const { t } = useLang();
  return (
    <div className="bg-primary-50 border-t border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
      <div className="pm-container px-4 sm:px-6 py-10">
        <div className="grid sm:grid-cols-3 gap-12">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-600 font-semibold mb-3.5 dark:text-slate-300">{t.pre.s1}</p>
            <div className="grid gap-2.5">
              {NAV_HREFS.map((href, i) => (
                <a key={href} href={href} className="text-sm text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-400">
                  {t.nav[i]}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-600 font-semibold mb-3.5 dark:text-slate-300">{t.pre.s2}</p>
            <div className="grid gap-2.5">
              <span className="text-sm text-slate-600 dark:text-slate-300">{t.con.addr}</span>
              <a href="tel:+998951956119" className="text-sm text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-400">+998 95 195 61 19</a>
              <a href="mailto:info@profimed.uz" className="text-sm text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-400">info@profimed.uz</a>
              <span className="text-sm text-slate-600 dark:text-slate-300">{t.con.hours}</span>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-600 font-semibold mb-3.5 dark:text-slate-300">{t.pre.s3}</p>
            <p className="text-sm text-slate-600 mb-4 dark:text-slate-300">{t.pre.text}</p>
            <Button href="#booking" variant="secondary" size="sm">{t.pre.cta}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

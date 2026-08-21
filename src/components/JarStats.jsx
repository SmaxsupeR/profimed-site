import { useState } from 'react';
import { useLang } from '../i18n/LangContext.jsx';
import { useInView } from '../hooks/useInView.js';
import { useCountUp } from '../hooks/useCountUp.js';
import { PhysicsJar } from './PhysicsJar.jsx';
import { PATIENTS_TOTAL } from './glassesPhysics.js';
import { Section, SectionHeader } from './ui/Section.jsx';

export function JarStats() {
  const { t } = useLang();
  const { ref, inView } = useInView(0.05);
  const [physicsFailed, setPhysicsFailed] = useState(false);
  const count = useCountUp(PATIENTS_TOTAL, 2600, inView && !physicsFailed);

  return (
    <Section>
      {/* useInView здесь остаётся своим — он запускает физику банки, а не
          появление секции (появлением с недавних пор занимается сам Section). */}
      <div ref={ref} className="flex flex-col items-center gap-4.5 text-center">
        <SectionHeader eyebrow={t.jar.eyebrow} title={t.jar.title} />
        <p className="text-slate-600 max-w-[34em] -mt-4 dark:text-slate-300">{t.jar.desc}</p>
        {physicsFailed ? (
          <div className="mt-2">
            <p className="font-display text-primary-700 text-[34px] dark:text-primary-400">{PATIENTS_TOTAL}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t.jar.label}</p>
          </div>
        ) : (
          <div className="mt-2 flex flex-col md:flex-row items-center gap-8">
            <PhysicsJar trigger={inView} onError={() => setPhysicsFailed(true)} size={240} />
            <div className="flex flex-col items-center md:items-start">
              <p className="font-display text-primary-700 text-[44px] leading-none dark:text-primary-400">{count}</p>
              <p className="text-sm text-slate-500 mt-1.5 dark:text-slate-400">{t.jar.label}</p>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

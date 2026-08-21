import { useEffect, useState } from 'react';
import { useLang } from '../i18n/LangContext.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { Card } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';
import { buildColorPlates } from './visionPlates.js';

export function VisionGame({ onPick }) {
  const { t } = useLang();
  const reveal = useReveal();
  const [tab, setTab] = useState('sharp');
  const [snellenSize, setSnellenSize] = useState(110);
  const [plates, setPlates] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => { setPlates(buildColorPlates()); }, []);

  const pickAnswer = (value) => {
    const correct = value === plates[index].correct;
    const next = [...answers, correct];
    setAnswers(next);
    if (index + 1 < plates.length) setIndex(index + 1);
    else setDone(true);
  };

  const restart = () => { setIndex(0); setAnswers([]); setDone(false); };

  const correctCount = answers.filter(Boolean).length;
  const total = plates ? plates.length : 0;
  const resultTitle = correctCount === total ? t.vision.resultTitleGood
    : correctCount >= total - 1 ? t.vision.resultTitleMid
    : t.vision.resultTitleLow;
  const resultDesc = correctCount === total ? t.vision.resultDescGood
    : correctCount >= total - 1 ? t.vision.resultDescMid
    : t.vision.resultDescLow;
  const resultScore = t.vision.resultScore.replace('{c}', correctCount).replace('{n}', total);

  return (
    <section ref={reveal.ref} className={`${reveal.className} max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20`}>
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm font-semibold text-leaf-700 uppercase tracking-wide mb-3 dark:text-leaf-400">{t.vision.eyebrow}</p>
          <h2 className="font-display text-2xl sm:text-3xl text-slate-900 text-balance mb-3.5 dark:text-white">{t.vision.title}</h2>
          <p className="text-slate-600 max-w-[30em] mb-2.5 dark:text-slate-300">{t.vision.sub}</p>
          <p className="text-xs text-slate-400 max-w-[30em] mb-5.5 dark:text-slate-500">{t.vision.note}</p>
          <Button variant="secondary" onClick={() => onPick('ophthalmology')}>{t.vision.cta}</Button>
        </div>

        <Card className="p-8">
          <div className="flex gap-1.5 mb-5 rounded-full bg-primary-50 p-1 dark:bg-primary-950/40">
            <button
              type="button"
              onClick={() => setTab('sharp')}
              className={`flex-1 rounded-full py-1.5 px-2.5 text-xs font-bold transition-colors ${tab ==='sharp' ? 'bg-white text-primary-600 dark:bg-slate-800 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`}
            >
              {t.vision.tabSharp}
            </button>
            <button
              type="button"
              onClick={() => setTab('color')}
              className={`flex-1 rounded-full py-1.5 px-2.5 text-xs font-bold transition-colors ${tab ==='color' ? 'bg-white text-primary-600 dark:bg-slate-800 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`}
            >
              {t.vision.tabColor}
            </button>
          </div>

          {tab === 'sharp' && (
            <div className="flex flex-col items-center gap-5.5">
              <span className="font-display text-slate-900 leading-none dark:text-white" style={{ fontSize: `${snellenSize}px` }}>E</span>
              <input
                type="range"
                min="24"
                max="140"
                value={snellenSize}
                onChange={(e) => setSnellenSize(Number(e.target.value))}
                aria-label={t.vision.title}
                className="w-full accent-primary-600"
              />
            </div>
          )}

          {tab === 'color' && plates && (
            <div className="flex flex-col items-center gap-4 w-full">
              {done ? (
                <div className="text-center w-full">
                  <p className="font-display text-slate-900 text-xl mb-1.5 dark:text-white">{resultTitle}</p>
                  <p className="text-sm text-slate-600 max-w-[30em] mb-1.5 dark:text-slate-300">{resultDesc}</p>
                  <p className="text-xs text-slate-400 mb-4 dark:text-slate-500">{resultScore}</p>
                  <Button variant="secondary" size="sm" onClick={restart}>{t.vision.restart}</Button>
                </div>
              ) : (
                <>
                  <img src={plates[index].src} alt="Ishihara plate" className="w-[140px] h-[140px] rounded-full" />
                  <p className="text-xs text-slate-400 text-center dark:text-slate-500">
                    {t.vision.plateLabel.replace('{i}', index + 1).replace('{n}', plates.length)}
                  </p>
                  <p className="text-sm text-slate-600 text-center dark:text-slate-300">{t.vision.question}</p>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {plates[index].options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => pickAnswer(opt)}
                        className="rounded-full border border-slate-200 bg-white px-4.5 py-2 text-[15px] font-bold text-primary-700 transition-all hover:border-primary-400 hover:bg-primary-50 hover:-translate-y-0.5 dark:bg-slate-800 dark:border-slate-600 dark:text-primary-400 dark:hover:border-primary-500 dark:hover:bg-primary-950/40"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => pickAnswer('__none__')}
                    className="text-xs text-slate-500 underline dark:text-slate-400"
                  >
                    {t.vision.choiceNone}
                  </button>
                  <p className="text-xs text-slate-400 text-center dark:text-slate-500">{t.vision.colorHint}</p>
                </>
              )}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}

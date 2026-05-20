import { useState } from 'react';
import { tmaGenevaZones } from '../data/tmaGeneva';
import type { TmaVisibility, TmaZone } from '../types/tma';
import TmaFlashcards from './TmaFlashcards';
import TmaInfoCard from './TmaInfoCard';
import TmaMap from './TmaMap';
import TmaQuiz from './TmaQuiz';
import TmaSidebar from './TmaSidebar';

type TmaMode = 'learn' | 'quiz' | 'flashcards';

const modes: { label: string; value: TmaMode }[] = [
  { label: 'Apprendre', value: 'learn' },
  { label: 'Quiz', value: 'quiz' },
  { label: 'Flashcards', value: 'flashcards' },
];

export default function TmaTrainer() {
  const [mode, setMode] = useState<TmaMode>('learn');
  const [selectedZone, setSelectedZone] = useState<TmaZone | null>(tmaGenevaZones[0]);
  const [visibility, setVisibility] = useState<TmaVisibility>({
    names: true,
    altitudes: true,
    classes: true,
    numbersOnly: false,
    cityLabels: false,
  });

  function toggleVisibility(key: keyof TmaVisibility) {
    setVisibility((currentVisibility) => ({
      ...currentVisibility,
      [key]: !currentVisibility[key],
      ...(key === 'numbersOnly' && !currentVisibility.numbersOnly
        ? { names: true, altitudes: false, classes: false }
        : {}),
    }));
  }

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-slate-700 bg-slate-950/90 shadow-2xl shadow-sky-950/30">
      <div className="border-b border-slate-700 bg-slate-950 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-300">
              Module TMA Geneve
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">Entrainement interactif TMA</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Apprends les formes, classes et limites verticales des TMA de Geneve avec une carte interactive.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-full bg-slate-900 p-1">
            {modes.map((trainerMode) => (
              <button
                key={trainerMode.value}
                type="button"
                onClick={() => setMode(trainerMode.value)}
                className={[
                  'rounded-full px-4 py-2 text-sm font-black transition',
                  mode === trainerMode.value
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-950/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                ].join(' ')}
              >
                {trainerMode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {mode === 'learn' && (
          <div className="grid gap-5 xl:grid-cols-[14rem_minmax(0,1fr)_20rem]">
            <TmaSidebar
              zones={tmaGenevaZones}
              selectedZoneId={selectedZone?.id ?? null}
              onSelectZone={setSelectedZone}
            />

            <div className="grid gap-4">
              <div className="grid gap-2 rounded-3xl border border-slate-700 bg-slate-950/70 p-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['names', 'Noms'],
                  ['altitudes', 'Altitudes'],
                  ['classes', 'Classes'],
                  ['numbersOnly', 'Numeros seuls'],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-bold text-slate-200"
                  >
                    <input
                      type="checkbox"
                      checked={visibility[key as keyof TmaVisibility]}
                      onChange={() => toggleVisibility(key as keyof TmaVisibility)}
                      className="h-4 w-4 accent-sky-500"
                    />
                    {label}
                  </label>
                ))}
              </div>

              <TmaMap
                zones={tmaGenevaZones}
                selectedZoneId={selectedZone?.id ?? null}
                visibility={visibility}
                onSelectZone={setSelectedZone}
              />
            </div>

            <TmaInfoCard zone={selectedZone} />
          </div>
        )}

        {mode === 'quiz' && <TmaQuiz zones={tmaGenevaZones} />}
        {mode === 'flashcards' && <TmaFlashcards zones={tmaGenevaZones} />}
      </div>
    </section>
  );
}

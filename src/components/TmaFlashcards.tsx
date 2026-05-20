import { useMemo, useState } from 'react';
import type { TmaFlashcardStatus, TmaZone } from '../types/tma';
import TmaMap from './TmaMap';

type TmaFlashcardsProps = {
  zones: TmaZone[];
};

type FlashcardFilter = 'all' | TmaFlashcardStatus;

const storageKey = 'fic-delta-tma-flashcards';

function getInitialStatuses(zones: TmaZone[]) {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? '{}') as Record<
      string,
      TmaFlashcardStatus
    >;
  } catch {
    return zones.reduce<Record<string, TmaFlashcardStatus>>((statuses, zone) => {
      statuses[zone.id] = 'unknown';
      return statuses;
    }, {});
  }
}

export default function TmaFlashcards({ zones }: TmaFlashcardsProps) {
  const [statuses, setStatuses] = useState(() => getInitialStatuses(zones));
  const [filter, setFilter] = useState<FlashcardFilter>('all');
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const cards = useMemo(() => {
    if (filter === 'all') {
      return zones;
    }

    return zones.filter((zone) => (statuses[zone.id] ?? 'unknown') === filter);
  }, [filter, statuses, zones]);
  const currentCard = cards[index] ?? cards[0] ?? zones[0];
  const remaining = cards.length;

  function saveStatus(status: TmaFlashcardStatus) {
    const nextStatuses = {
      ...statuses,
      [currentCard.id]: status,
    };
    setStatuses(nextStatuses);
    window.localStorage.setItem(storageKey, JSON.stringify(nextStatuses));
  }

  function handleNext() {
    setIndex((currentIndex) => (currentIndex + 1) % Math.max(cards.length, 1));
    setIsFlipped(false);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4 shadow-xl shadow-sky-950/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
              Flashcards
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-400">
              {remaining} cartes dans le filtre actuel
            </p>
          </div>
          <select
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value as FlashcardFilter);
              setIndex(0);
              setIsFlipped(false);
            }}
            className="rounded-2xl border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-bold text-white outline-none"
          >
            <option value="all">Toutes les cartes</option>
            <option value="unknown">Seulement unknown</option>
            <option value="learning">Seulement learning</option>
            <option value="known">Seulement known</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setIsFlipped((currentValue) => !currentValue)}
          className="mt-5 min-h-[24rem] w-full rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-left shadow-inner shadow-sky-950/20 transition hover:border-sky-500"
        >
          {!isFlipped ? (
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-300">Recto</p>
              <h3 className="mt-8 text-5xl font-black text-white">TMA {currentCard.number}</h3>
              <p className="mt-4 text-lg font-bold text-slate-300">{currentCard.name}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-300">Verso</p>
              <h3 className="mt-6 text-4xl font-black text-white">
                {currentCard.floor} - {currentCard.ceiling}
              </h3>
              <p className="mt-3 text-lg font-bold text-sky-200">Classe {currentCard.airspaceClass}</p>
              <p className="mt-4 text-sm leading-6 text-slate-300">{currentCard.description}</p>
              <div className="mt-5 max-w-sm">
                <TmaMap
                  zones={zones}
                  selectedZoneId={currentCard.id}
                  visibility={{
                    names: false,
                    altitudes: false,
                    classes: false,
                    numbersOnly: true,
                    cityLabels: false,
                  }}
                  onSelectZone={() => undefined}
                />
              </div>
            </div>
          )}
        </button>
      </div>

      <aside className="rounded-3xl border border-slate-700 bg-slate-950/70 p-5 shadow-xl shadow-sky-950/20">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">Statut de la carte</p>
        <div className="mt-4 grid gap-3">
          {(['known', 'learning', 'unknown'] as TmaFlashcardStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => saveStatus(status)}
              className={[
                'rounded-full px-5 py-3 text-sm font-black capitalize transition',
                (statuses[currentCard.id] ?? 'unknown') === status
                  ? 'bg-sky-600 text-white'
                  : 'border border-slate-700 bg-slate-900 text-slate-200 hover:border-sky-500',
              ].join(' ')}
            >
              {status}
            </button>
          ))}
          <button
            type="button"
            onClick={handleNext}
            className="mt-3 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-200"
          >
            Carte suivante
          </button>
        </div>
      </aside>
    </div>
  );
}

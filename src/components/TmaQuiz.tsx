import { useMemo, useState } from 'react';
import { tmaQuizPrompts } from '../data/tmaGeneva';
import type { TmaDifficulty, TmaVisibility, TmaZone } from '../types/tma';
import ScorePanel from './ScorePanel';
import TmaMap from './TmaMap';

type TmaQuizProps = {
  zones: TmaZone[];
};

const difficultyVisibility: Record<TmaDifficulty, TmaVisibility> = {
  easy: { names: true, altitudes: true, classes: true, numbersOnly: false, cityLabels: true },
  medium: { names: false, altitudes: true, classes: true, numbersOnly: false, cityLabels: true },
  hard: { names: false, altitudes: true, classes: false, numbersOnly: false, cityLabels: false },
  expert: { names: false, altitudes: false, classes: false, numbersOnly: false, cityLabels: false },
};

type QuizMode = 'map' | 'altitudes';

function randomIndex(max: number) {
  return Math.floor(Math.random() * max);
}

function formatLimits(zone: TmaZone) {
  return `${zone.floor}${zone.agl ? ` ${zone.agl}` : ''} - ${zone.ceiling}`;
}

function normalizeAnswer(answer: string) {
  return answer.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function buildAltitudeOptions(zones: TmaZone[], answerZone: TmaZone) {
  const wrongOptions = zones
    .filter((zone) => zone.id !== answerZone.id)
    .map(formatLimits)
    .filter((option, index, options) => options.indexOf(option) === index)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return [...wrongOptions, formatLimits(answerZone)].sort(() => Math.random() - 0.5);
}

export default function TmaQuiz({ zones }: TmaQuizProps) {
  const [quizMode, setQuizMode] = useState<QuizMode>('map');
  const [difficulty, setDifficulty] = useState<TmaDifficulty>('easy');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [altitudeZoneIndex, setAltitudeZoneIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answeredZoneId, setAnsweredZoneId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'correct' | 'incorrect' | null>(null);
  const [isRandom, setIsRandom] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [freeAnswer, setFreeAnswer] = useState('');
  const [altitudeFeedback, setAltitudeFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const question = tmaQuizPrompts[questionIndex];
  const answerZone = useMemo(
    () => zones.find((zone) => zone.id === question.answerId),
    [question.answerId, zones],
  );
  const altitudeZone = zones[altitudeZoneIndex] ?? zones[0];
  const altitudeOptions = useMemo(
    () => buildAltitudeOptions(zones, altitudeZone),
    [altitudeZone, zones],
  );
  const altitudeAnswer = formatLimits(altitudeZone);

  function handleAnswer(zone: TmaZone) {
    if (feedbackState) {
      return;
    }

    const isCorrect = zone.id === question.answerId;
    setAnsweredZoneId(zone.id);
    setFeedbackState(isCorrect ? 'correct' : 'incorrect');
    setScore((currentScore) => currentScore + (isCorrect ? 1 : 0));
    setStreak((currentStreak) => (isCorrect ? currentStreak + 1 : 0));
  }

  function handleNextQuestion() {
    setAnsweredZoneId(null);
    setFeedbackState(null);
    setQuestionIndex((index) =>
      isRandom ? randomIndex(tmaQuizPrompts.length) : (index + 1) % tmaQuizPrompts.length,
    );
  }

  function handleAltitudeAnswer(answer: string) {
    if (altitudeFeedback) {
      return;
    }

    const normalizedGivenAnswer = normalizeAnswer(answer);
    const normalizedExpectedAnswer = normalizeAnswer(altitudeAnswer);
    const isCorrect =
      normalizedGivenAnswer === normalizedExpectedAnswer ||
      (normalizedGivenAnswer.includes(normalizeAnswer(altitudeZone.floor)) &&
        normalizedGivenAnswer.includes(normalizeAnswer(altitudeZone.ceiling)));

    setSelectedOption(answer);
    setAltitudeFeedback(isCorrect ? 'correct' : 'incorrect');
    setScore((currentScore) => currentScore + (isCorrect ? 1 : 0));
    setStreak((currentStreak) => (isCorrect ? currentStreak + 1 : 0));
  }

  function handleNextAltitudeQuestion() {
    setSelectedOption(null);
    setFreeAnswer('');
    setAltitudeFeedback(null);
    setAltitudeZoneIndex((index) => (isRandom ? randomIndex(zones.length) : (index + 1) % zones.length));
  }

  const currentProgress =
    quizMode === 'map'
      ? `${questionIndex + 1}/${tmaQuizPrompts.length}`
      : `${altitudeZoneIndex + 1}/${zones.length}`;

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-2 gap-2 rounded-full bg-slate-900 p-1">
        {[
          ['map', 'Carte TMA'],
          ['altitudes', 'Altitudes'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setQuizMode(value as QuizMode)}
            className={[
              'rounded-full px-4 py-2 text-sm font-black transition',
              quizMode === value
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-950/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      <ScorePanel
        score={score}
        streak={streak}
        progress={currentProgress}
        difficulty={difficulty}
      />

      {quizMode === 'altitudes' ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <TmaMap
            zones={zones}
            selectedZoneId={altitudeZone.id}
            visibility={difficultyVisibility.medium}
            onSelectZone={() => undefined}
          />

          <aside className="rounded-3xl border border-slate-700 bg-slate-950/75 p-5 shadow-xl shadow-sky-950/20">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">Quiz altitudes</p>
            <h3 className="mt-3 text-2xl font-black text-white">
              Quelles sont les limites verticales de la TMA {altitudeZone.number} ?
            </h3>

            <div className="mt-5 grid gap-2">
              {altitudeOptions.map((option) => {
                const isSelected = selectedOption === option;
                const isAnswer = option === altitudeAnswer;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAltitudeAnswer(option)}
                    className={[
                      'rounded-2xl border px-4 py-3 text-left text-sm font-black transition',
                      altitudeFeedback && isAnswer
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                        : altitudeFeedback && isSelected && !isAnswer
                          ? 'border-red-400 bg-red-500/20 text-red-100'
                          : 'border-slate-700 bg-slate-900 text-slate-100 hover:border-sky-400',
                    ].join(' ')}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <form
              className="mt-5 grid gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                handleAltitudeAnswer(freeAnswer);
              }}
            >
              <label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Reponse libre
              </label>
              <input
                value={freeAnswer}
                onChange={(event) => setFreeAnswer(event.target.value)}
                placeholder="Ex: 3500 or 1000 AGL - FL195"
                className="rounded-2xl border border-slate-600 bg-slate-900 px-3 py-3 text-sm font-bold text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
              />
              <button
                type="submit"
                className="rounded-full border border-sky-500 px-5 py-3 text-sm font-black text-sky-100 transition hover:bg-sky-500/15"
              >
                Valider ma reponse
              </button>
            </form>

            {altitudeFeedback && (
              <div
                className={[
                  'mt-5 rounded-2xl border p-4 text-sm font-bold',
                  altitudeFeedback === 'correct'
                    ? 'border-emerald-400 bg-emerald-500/15 text-emerald-100'
                    : 'border-red-400 bg-red-500/15 text-red-100',
                ].join(' ')}
              >
                {altitudeFeedback === 'correct'
                  ? 'Correct.'
                  : `Incorrect. Bonne reponse : ${altitudeAnswer}`}
              </div>
            )}

            <div className="mt-5 grid gap-3">
              <label className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-bold text-slate-200">
                <input
                  type="checkbox"
                  checked={isRandom}
                  onChange={(event) => setIsRandom(event.target.checked)}
                  className="h-4 w-4 accent-sky-500"
                />
                Questions aleatoires
              </label>
              <button
                type="button"
                onClick={handleNextAltitudeQuestion}
                className="rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-950/30 transition hover:bg-sky-500"
              >
                Question suivante
              </button>
            </div>
          </aside>
        </div>
      ) : (
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <TmaMap
          zones={zones}
          selectedZoneId={answerZone?.id ?? null}
          feedbackZoneId={feedbackState === 'incorrect' ? answerZone?.id : answeredZoneId}
          feedbackState={feedbackState}
          visibility={difficultyVisibility[difficulty]}
          radarMode={difficulty === 'expert'}
          onSelectZone={handleAnswer}
        />

        <aside className="rounded-3xl border border-slate-700 bg-slate-950/75 p-5 shadow-xl shadow-sky-950/20">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">Quiz</p>
          <h3 className="mt-3 text-2xl font-black text-white">{question.question}</h3>

          {feedbackState && (
            <div
              className={[
                'mt-5 rounded-2xl border p-4 text-sm font-bold',
                feedbackState === 'correct'
                  ? 'border-emerald-400 bg-emerald-500/15 text-emerald-100'
                  : 'border-red-400 bg-red-500/15 text-red-100',
              ].join(' ')}
            >
              {feedbackState === 'correct'
                ? 'Correct.'
                : `Incorrect. Bonne reponse : ${answerZone?.name}`}
            </div>
          )}

          <div className="mt-5 grid gap-3">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Difficulte
              </span>
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value as TmaDifficulty)}
                className="mt-2 w-full rounded-2xl border border-slate-600 bg-slate-900 px-3 py-3 text-sm font-bold text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
              >
                <option value="easy">Facile - labels visibles</option>
                <option value="medium">Moyen - noms caches</option>
                <option value="hard">Difficile - formes + altitudes</option>
                <option value="expert">Expert - style radar</option>
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-bold text-slate-200">
              <input
                type="checkbox"
                checked={isRandom}
                onChange={(event) => setIsRandom(event.target.checked)}
                className="h-4 w-4 accent-sky-500"
              />
              Questions aleatoires
            </label>

            <button
              type="button"
              onClick={handleNextQuestion}
              className="rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-950/30 transition hover:bg-sky-500"
            >
              Question suivante
            </button>
          </div>
        </aside>
      </div>
      )}
    </div>
  );
}

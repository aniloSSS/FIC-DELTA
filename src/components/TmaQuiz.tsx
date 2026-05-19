import { useMemo, useState } from 'react';
import { tmaQuizPrompts } from '../data/tmaGeneva';
import type { TmaDifficulty, TmaVisibility, TmaZone } from '../types/tma';
import ScorePanel from './ScorePanel';
import TmaMap from './TmaMap';

type TmaQuizProps = {
  zones: TmaZone[];
};

const difficultyVisibility: Record<TmaDifficulty, TmaVisibility> = {
  easy: { names: true, altitudes: true, classes: true, numbersOnly: false },
  medium: { names: false, altitudes: true, classes: true, numbersOnly: false },
  hard: { names: false, altitudes: true, classes: false, numbersOnly: false },
  expert: { names: false, altitudes: false, classes: false, numbersOnly: false },
};

function randomIndex(max: number) {
  return Math.floor(Math.random() * max);
}

export default function TmaQuiz({ zones }: TmaQuizProps) {
  const [difficulty, setDifficulty] = useState<TmaDifficulty>('easy');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answeredZoneId, setAnsweredZoneId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'correct' | 'incorrect' | null>(null);
  const [isRandom, setIsRandom] = useState(true);

  const question = tmaQuizPrompts[questionIndex];
  const answerZone = useMemo(
    () => zones.find((zone) => zone.id === question.answerId),
    [question.answerId, zones],
  );

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

  return (
    <div className="grid gap-5">
      <ScorePanel
        score={score}
        streak={streak}
        progress={`${questionIndex + 1}/${tmaQuizPrompts.length}`}
        difficulty={difficulty}
      />

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
                : `Incorrect. Correct answer: ${answerZone?.name}`}
            </div>
          )}

          <div className="mt-5 grid gap-3">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Difficulty
              </span>
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value as TmaDifficulty)}
                className="mt-2 w-full rounded-2xl border border-slate-600 bg-slate-900 px-3 py-3 text-sm font-bold text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
              >
                <option value="easy">Easy - labels visible</option>
                <option value="medium">Medium - names hidden</option>
                <option value="hard">Hard - forms + altitudes</option>
                <option value="expert">Expert - radar style</option>
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-bold text-slate-200">
              <input
                type="checkbox"
                checked={isRandom}
                onChange={(event) => setIsRandom(event.target.checked)}
                className="h-4 w-4 accent-sky-500"
              />
              Random questions
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
    </div>
  );
}

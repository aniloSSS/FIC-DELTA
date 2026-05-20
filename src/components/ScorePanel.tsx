type ScorePanelProps = {
  score: number;
  streak: number;
  progress: string;
  difficulty: string;
};

export default function ScorePanel({
  score,
  streak,
  progress,
  difficulty,
}: ScorePanelProps) {
  const levelLabel =
    {
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile',
      expert: 'Expert',
    }[difficulty] ?? difficulty;

  return (
    <div className="grid grid-cols-2 gap-2 rounded-3xl border border-slate-700 bg-slate-950/70 p-3 text-center shadow-xl shadow-sky-950/20 md:grid-cols-4">
      <div>
        <p className="text-2xl font-black text-white">{score}</p>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Score</p>
      </div>
      <div>
        <p className="text-2xl font-black text-sky-200">{streak}</p>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Serie</p>
      </div>
      <div>
        <p className="text-2xl font-black text-white">{progress}</p>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Progression</p>
      </div>
      <div>
        <p className="text-2xl font-black capitalize text-sky-200">{levelLabel}</p>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Niveau</p>
      </div>
    </div>
  );
}

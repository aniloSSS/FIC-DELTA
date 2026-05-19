import type { TmaZone } from '../types/tma';

type TmaInfoCardProps = {
  zone: TmaZone | null;
};

const classStyles = {
  C: 'border-sky-400 bg-sky-500/15 text-sky-100',
  D: 'border-amber-400 bg-amber-500/15 text-amber-100',
  E: 'border-emerald-400 bg-emerald-500/15 text-emerald-100',
};

export default function TmaInfoCard({ zone }: TmaInfoCardProps) {
  if (!zone) {
    return (
      <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-5 shadow-xl shadow-sky-950/20">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
          Selected TMA
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Select a TMA on the map or from the list to inspect class and vertical limits.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-5 shadow-xl shadow-sky-950/25">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
            {zone.name}
          </p>
          <h3 className="mt-2 text-3xl font-black text-white">TMA {zone.number}</h3>
        </div>
        <span className={`rounded-2xl border px-3 py-2 text-sm font-black ${classStyles[zone.airspaceClass]}`}>
          Class {zone.airspaceClass}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Floor</p>
          <p className="mt-1 text-xl font-black text-sky-200">{zone.floor}</p>
          {zone.agl && <p className="mt-1 text-xs font-bold text-slate-400">{zone.agl}</p>}
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Ceiling</p>
          <p className="mt-1 text-xl font-black text-sky-200">{zone.ceiling}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">{zone.description}</p>
    </div>
  );
}

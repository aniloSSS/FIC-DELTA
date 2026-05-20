import type { TmaZone } from '../types/tma';

type TmaTooltipProps = {
  zone: TmaZone | null;
};

export default function TmaTooltip({ zone }: TmaTooltipProps) {
  if (!zone) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-2xl border border-sky-300/70 bg-slate-950/90 px-4 py-3 text-sm text-white shadow-xl shadow-sky-950/40 backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Zone survolee</p>
      <p className="mt-1 text-lg font-black">{zone.name}</p>
      <p className="mt-1 font-bold text-slate-200">
        Classe {zone.airspaceClass} | {zone.floor} - {zone.ceiling}
      </p>
    </div>
  );
}

import type { TmaZone } from '../types/tma';

type TmaSidebarProps = {
  zones: TmaZone[];
  selectedZoneId: string | null;
  onSelectZone: (zone: TmaZone) => void;
};

export default function TmaSidebar({
  zones,
  selectedZoneId,
  onSelectZone,
}: TmaSidebarProps) {
  return (
    <aside className="max-h-[34rem] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-950/70 p-3 shadow-xl shadow-sky-950/20">
      <p className="px-2 pb-3 text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
        TMA list
      </p>
      <div className="grid gap-2">
        {zones.map((zone) => (
          <button
            key={zone.id}
            type="button"
            onClick={() => onSelectZone(zone)}
            className={[
              'rounded-2xl border px-3 py-3 text-left transition',
              selectedZoneId === zone.id
                ? 'border-sky-400 bg-sky-500/20 shadow-lg shadow-sky-950/20'
                : 'border-slate-700 bg-slate-900/80 hover:border-sky-500/70 hover:bg-slate-800',
            ].join(' ')}
          >
            <span className="block text-sm font-black text-white">TMA {zone.number}</span>
            <span className="mt-1 block text-xs font-semibold text-slate-400">
              {zone.floor} - {zone.ceiling}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

import { useState } from 'react';
import { tmaCityLabels, tmaMapSize } from '../data/tmaGeneva';
import type { TmaVisibility, TmaZone } from '../types/tma';
import CityLabels from './CityLabels';
import TmaOverlay from './TmaOverlay';
import TmaTooltip from './TmaTooltip';

type TmaMapProps = {
  zones: TmaZone[];
  selectedZoneId: string | null;
  feedbackZoneId?: string | null;
  feedbackState?: 'correct' | 'incorrect' | null;
  visibility: TmaVisibility;
  radarMode?: boolean;
  onSelectZone: (zone: TmaZone) => void;
};

const tmaOfficialMapUrl = `${import.meta.env.BASE_URL}assets/tma-geneva-official.png`;

export default function TmaMap({
  zones,
  selectedZoneId,
  feedbackZoneId,
  feedbackState,
  visibility,
  radarMode = false,
  onSelectZone,
}: TmaMapProps) {
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const hoveredZone = zones.find((zone) => zone.id === hoveredZoneId) ?? null;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border shadow-2xl ${
        radarMode
          ? 'border-slate-700 bg-slate-950 shadow-sky-950/30'
          : 'border-slate-300 bg-slate-100 shadow-slate-950/20'
      }`}
    >
      {radarMode && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.14),transparent_42%),linear-gradient(rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.08)_1px,transparent_1px)] bg-[length:100%_100%,42px_42px,42px_42px]" />
      )}

      <svg
        viewBox={`0 0 ${tmaMapSize.width} ${tmaMapSize.height}`}
        className="relative z-10 block w-full"
        style={{ aspectRatio: `${tmaMapSize.width} / ${tmaMapSize.height}` }}
      >
        <defs>
          <filter id="tma-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {!radarMode ? (
          <image
            href={tmaOfficialMapUrl}
            x="0"
            y="0"
            width={tmaMapSize.width}
            height={tmaMapSize.height}
            preserveAspectRatio="xMidYMid meet"
          />
        ) : (
          <rect width={tmaMapSize.width} height={tmaMapSize.height} fill="#020617" />
        )}

        {!radarMode && <CityLabels labels={tmaCityLabels} visible={visibility.cityLabels} />}

        <TmaOverlay
          zones={zones}
          selectedZoneId={selectedZoneId}
          hoveredZoneId={hoveredZoneId}
          feedbackZoneId={feedbackZoneId}
          feedbackState={feedbackState}
          onHoverZone={(zone) => setHoveredZoneId(zone?.id ?? null)}
          onSelectZone={onSelectZone}
        />

        {radarMode && (
          <>
            <ellipse
              cx="385"
              cy="505"
              rx="74"
              ry="168"
              transform="rotate(36 385 505)"
              fill="rgba(2,6,23,0.7)"
              stroke="rgba(203,213,225,0.7)"
              strokeWidth="6"
            />
            <text
              x="385"
              y="510"
              textAnchor="middle"
              className="fill-slate-300 text-[24px] font-black"
              transform="rotate(-28 385 510)"
            >
              CTR GENEVE
            </text>
          </>
        )}
      </svg>
      <TmaTooltip zone={hoveredZone} />
    </div>
  );
}

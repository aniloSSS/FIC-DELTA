import { useState } from 'react';
import type { TmaVisibility, TmaZone } from '../types/tma';

type TmaMapProps = {
  zones: TmaZone[];
  selectedZoneId: string | null;
  feedbackZoneId?: string | null;
  feedbackState?: 'correct' | 'incorrect' | null;
  visibility: TmaVisibility;
  radarMode?: boolean;
  onSelectZone: (zone: TmaZone) => void;
};

const classColors = {
  C: {
    stroke: '#38bdf8',
    fill: 'rgba(14, 165, 233, 0.16)',
  },
  D: {
    stroke: '#fbbf24',
    fill: 'rgba(245, 158, 11, 0.14)',
  },
  E: {
    stroke: '#34d399',
    fill: 'rgba(16, 185, 129, 0.14)',
  },
};

function pointsToString(points: [number, number][]) {
  return points.map(([x, y]) => `${x},${y}`).join(' ');
}

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
  const isPaperMap = !radarMode;

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

      <svg viewBox="0 0 1000 1000" className="relative z-10 block aspect-square w-full">
        <defs>
          <filter id="tma-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="paper-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.18" />
          </filter>
        </defs>

        {isPaperMap && (
          <>
            <rect width="1000" height="1000" fill="#fbfbfa" />
            <path
              d="M610 42 L770 118 L858 278 L880 455 L740 598 L645 750 L425 980 L90 950 L115 780 L145 450 L160 245 L355 248 Z"
              fill="#ffffff"
              stroke="#d4d4d4"
              strokeWidth="4"
            />
            <path d="M118 520 C72 610 82 705 115 780" fill="none" stroke="#cfcfcf" strokeWidth="36" strokeLinecap="round" />
            <path d="M118 520 C72 610 82 705 115 780" fill="none" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" />
            <text x="760" y="72" textAnchor="middle" className="fill-neutral-700 text-[34px] font-black tracking-[0.18em]">
              GENEVA
            </text>
          </>
        )}

        {zones.map((zone) => {
          const isSelected = selectedZoneId === zone.id;
          const isHovered = hoveredZoneId === zone.id;
          const isDimmed = selectedZoneId && !isSelected;
          const feedbackApplies = feedbackZoneId === zone.id;
          const colors = classColors[zone.airspaceClass];
          const fill = feedbackApplies
            ? feedbackState === 'correct'
              ? 'rgba(34,197,94,0.34)'
              : 'rgba(239,68,68,0.34)'
            : isHovered || isSelected
              ? 'rgba(14,165,233,0.22)'
              : isPaperMap
                ? 'rgba(255,255,255,0.58)'
                : colors.fill;
          const stroke = feedbackApplies
            ? feedbackState === 'correct'
              ? '#22c55e'
              : '#ef4444'
            : isPaperMap
              ? isHovered || isSelected
                ? '#0284c7'
                : '#9ca3af'
              : colors.stroke;

          return (
            <g
              key={zone.id}
              className="cursor-pointer transition duration-200"
              onClick={() => onSelectZone(zone)}
              onMouseEnter={() => setHoveredZoneId(zone.id)}
              onMouseLeave={() => setHoveredZoneId(null)}
            >
              <polygon
                points={pointsToString(zone.polygon)}
                fill={fill}
                stroke={stroke}
                strokeWidth={isSelected || isHovered ? 5 : 3}
                opacity={isDimmed ? 0.24 : 1}
                filter={isSelected || isHovered || feedbackApplies ? 'url(#tma-glow)' : undefined}
                className="transition duration-200"
              />
              {(visibility.names || visibility.numbersOnly) && (
                <text
                  x={zone.labelPosition[0]}
                  y={zone.labelPosition[1]}
                  textAnchor="middle"
                  className={`select-none text-[24px] font-black tracking-wide ${
                    isPaperMap ? 'fill-slate-600' : 'fill-white'
                  }`}
                  opacity={isDimmed ? 0.32 : 1}
                >
                  {visibility.numbersOnly ? zone.number : `TMA GENEVA ${zone.number}`}
                </text>
              )}
              {(visibility.classes || visibility.altitudes) && !visibility.numbersOnly && (
                <g opacity={isDimmed ? 0.28 : 1}>
                  <rect
                    x={zone.labelPosition[0] - 52}
                    y={zone.labelPosition[1] + 13}
                    width="104"
                    height={visibility.classes && visibility.altitudes ? 54 : 32}
                    rx="4"
                    fill={isPaperMap ? '#ffffff' : '#0f172a'}
                    stroke={isPaperMap ? '#475569' : '#38bdf8'}
                    strokeWidth="2"
                  />
                  {visibility.classes && (
                    <>
                      <rect
                        x={zone.labelPosition[0] - 46}
                        y={zone.labelPosition[1] + 19}
                        width="26"
                        height="24"
                        rx="2"
                        fill={isPaperMap ? '#1f2937' : colors.stroke}
                      />
                      <text
                        x={zone.labelPosition[0] - 33}
                        y={zone.labelPosition[1] + 38}
                        textAnchor="middle"
                        className="select-none fill-white text-[18px] font-black"
                      >
                        {zone.airspaceClass}
                      </text>
                    </>
                  )}
                  {visibility.altitudes && (
                    <>
                      <text
                        x={zone.labelPosition[0] + (visibility.classes ? 19 : 0)}
                        y={zone.labelPosition[1] + 34}
                        textAnchor="middle"
                        className={`${isPaperMap ? 'fill-slate-800' : 'fill-sky-100'} select-none text-[16px] font-black`}
                      >
                        {zone.ceiling}
                      </text>
                      <text
                        x={zone.labelPosition[0] + (visibility.classes ? 19 : 0)}
                        y={zone.labelPosition[1] + 55}
                        textAnchor="middle"
                        className={`${isPaperMap ? 'fill-slate-800' : 'fill-sky-100'} select-none text-[16px] font-black`}
                      >
                        {zone.floor}
                      </text>
                    </>
                  )}
                </g>
              )}
            </g>
          );
        })}

        <ellipse
          cx="385"
          cy="505"
          rx="74"
          ry="168"
          transform="rotate(36 385 505)"
          fill={isPaperMap ? 'rgba(255,255,255,0.82)' : 'rgba(2,6,23,0.7)'}
          stroke={isPaperMap ? '#737373' : 'rgba(203,213,225,0.7)'}
          strokeWidth="6"
        />
        {!radarMode && (
          <text
            x="385"
            y="510"
            textAnchor="middle"
            className="fill-slate-600 text-[24px] font-black"
            transform="rotate(-28 385 510)"
          >
            CTR GENEVA
          </text>
        )}
      </svg>
    </div>
  );
}

import type { TmaZone } from '../types/tma';

type TmaOverlayProps = {
  zones: TmaZone[];
  selectedZoneId: string | null;
  hoveredZoneId: string | null;
  feedbackZoneId?: string | null;
  feedbackState?: 'correct' | 'incorrect' | null;
  onHoverZone: (zone: TmaZone | null) => void;
  onSelectZone: (zone: TmaZone) => void;
};

function pointsToString(points: [number, number][]) {
  return points.map(([x, y]) => `${x},${y}`).join(' ');
}

export default function TmaOverlay({
  zones,
  selectedZoneId,
  hoveredZoneId,
  feedbackZoneId,
  feedbackState,
  onHoverZone,
  onSelectZone,
}: TmaOverlayProps) {
  return (
    <g>
      {zones.map((zone) => {
        const isSelected = selectedZoneId === zone.id;
        const isHovered = hoveredZoneId === zone.id;
        const isDimmed = selectedZoneId && !isSelected;
        const feedbackApplies = feedbackZoneId === zone.id;
        const fill = feedbackApplies
          ? feedbackState === 'correct'
            ? 'rgba(34,197,94,0.34)'
            : 'rgba(239,68,68,0.34)'
          : isHovered || isSelected
            ? 'rgba(14,165,233,0.28)'
            : 'rgba(255,255,255,0.01)';
        const stroke = feedbackApplies
          ? feedbackState === 'correct'
            ? '#22c55e'
            : '#ef4444'
          : '#0284c7';

        return (
          <polygon
            key={zone.id}
            points={pointsToString(zone.polygon)}
            fill={fill}
            stroke={isHovered || isSelected || feedbackApplies ? stroke : 'transparent'}
            strokeWidth={isHovered || isSelected || feedbackApplies ? 6 : 0}
            opacity={isDimmed ? 0.3 : 1}
            filter={isHovered || isSelected || feedbackApplies ? 'url(#tma-glow)' : undefined}
            className="cursor-pointer transition duration-200"
            onClick={() => onSelectZone(zone)}
            onMouseEnter={() => onHoverZone(zone)}
            onMouseLeave={() => onHoverZone(null)}
          />
        );
      })}
    </g>
  );
}

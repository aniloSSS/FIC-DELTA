import type { TmaCityLabel } from '../types/tma';

type CityLabelsProps = {
  labels: TmaCityLabel[];
  visible: boolean;
};

export default function CityLabels({ labels, visible }: CityLabelsProps) {
  if (!visible) {
    return null;
  }

  return (
    <g className="pointer-events-none">
      {labels.map((label) => (
        <g key={label.id}>
          <circle cx={label.x} cy={label.y} r="5" fill="#082f49" stroke="#e0f2fe" strokeWidth="2" />
          <text
            x={label.x + 10}
            y={label.y - 8}
            className="select-none fill-sky-950 text-[16px] font-black"
            paintOrder="stroke"
            stroke="#e0f2fe"
            strokeWidth="4"
          >
            {label.name}
          </text>
        </g>
      ))}
    </g>
  );
}

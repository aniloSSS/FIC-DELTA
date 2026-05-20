export type TmaClass = 'C' | 'D' | 'E';

export type TmaZone = {
  id: string;
  number: string;
  name: string;
  airspaceClass: TmaClass;
  floor: string;
  ceiling: string;
  agl?: string;
  description: string;
  locationHint: string;
  polygon: [number, number][];
  labelPosition: [number, number];
};

export type TmaCityLabel = {
  id: string;
  name: string;
  x: number;
  y: number;
};

export type TmaVisibility = {
  names: boolean;
  altitudes: boolean;
  classes: boolean;
  numbersOnly: boolean;
  cityLabels: boolean;
};

export type TmaDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type TmaFlashcardStatus = 'known' | 'learning' | 'unknown';

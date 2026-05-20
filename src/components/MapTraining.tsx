import { useMemo, useState } from 'react';
import {
  Circle,
  CircleMarker,
  ImageOverlay,
  MapContainer,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';
import type { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import type { TrainingPoint } from '../types/training';

type MapTrainingProps = {
  title: string;
  description: string;
  points: TrainingPoint[];
  storageKey: string;
  chartMaps?: ChartMap[];
};

type ChartMap = {
  id: string;
  label: string;
  imageUrl: string;
  bounds: [[number, number], [number, number]];
};

type MapModeOption = {
  label: string;
  value: string;
};

type ChartMapMode = MapModeOption & {
  chartMap: ChartMap;
};

type ClickResult = {
  distanceKm: number;
  isCorrect: boolean;
  clickedPosition: Coordinate;
};

type Coordinate = {
  latitude: number;
  longitude: number;
};

type PointStatus = 'unknown' | 'known';
type PointFilter = 'all' | 'unknown' | 'known';
type TrainingView = 'training' | 'points';
type MapMode = string;
type PointStatuses = Record<string, PointStatus>;
type PointEdit = {
  name?: string;
  studyBlock?: string;
};
type PointEdits = Record<string, PointEdit>;

const switzerlandCenter: LatLngExpression = [46.65, 6.8];
const defaultZoom = 8;
const mapModeStorageKey = 'fic-delta-map-mode';
const swisstopoAttribution =
  '&copy; <a href="https://www.swisstopo.admin.ch/">swisstopo</a>';
const swisstopoColorTiles =
  'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg';
const swisstopoGrayTiles =
  'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg';

const filters: { label: string; value: PointFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Unknown only', value: 'unknown' },
  { label: 'Known only', value: 'known' },
];

const views: { label: string; value: TrainingView }[] = [
  { label: 'Training', value: 'training' },
  { label: 'Points list', value: 'points' },
];

const preferredStudyBlockOrder = [
  'Lake Geneva / Geneva Periphery',
  'Jura',
  'Haute-Savoie / Ain',
  'Three Lakes / Broye',
  'Passes / Cols',
  'Mountains / Relief',
  'Lakes',
  'Alps',
  'Aerodromes / Airports',
  'Central sector',
];

function getInitialMapMode(): MapMode {
  if (typeof window === 'undefined') {
    return 'blank';
  }

  const storedMode = window.localStorage.getItem(mapModeStorageKey);

  if (storedMode) {
    return storedMode;
  }

  return 'blank';
}

function getDefaultStatuses(points: TrainingPoint[]) {
  return points.reduce<PointStatuses>((statuses, point) => {
    statuses[point.id] = 'unknown';
    return statuses;
  }, {});
}

function getInitialStatuses(points: TrainingPoint[], storageKey: string): PointStatuses {
  const defaultStatuses = getDefaultStatuses(points);

  if (typeof window === 'undefined') {
    return defaultStatuses;
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey);

    if (!storedValue) {
      return defaultStatuses;
    }

    const storedStatuses = JSON.parse(storedValue) as Partial<PointStatuses>;

    return points.reduce<PointStatuses>((statuses, point) => {
      statuses[point.id] =
        storedStatuses[point.id] === 'known' ? 'known' : 'unknown';
      return statuses;
    }, {});
  } catch {
    return defaultStatuses;
  }
}

function getPointEditsStorageKey(storageKey: string) {
  return `${storageKey}-point-edits`;
}

function getInitialPointEdits(storageKey: string): PointEdits {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(getPointEditsStorageKey(storageKey)) ?? '{}') as PointEdits;
  } catch {
    return {};
  }
}

function getDistanceKm(
  start: { latitude: number; longitude: number },
  end: { latitude: number; longitude: number },
) {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;

  const deltaLatitude = toRadians(end.latitude - start.latitude);
  const deltaLongitude = toRadians(end.longitude - start.longitude);
  const startLatitude = toRadians(start.latitude);
  const endLatitude = toRadians(end.latitude);

  const haversine =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(startLatitude) *
      Math.cos(endLatitude) *
      Math.sin(deltaLongitude / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (event: LeafletMouseEvent) => void;
}) {
  useMapEvents({
    click: onMapClick,
  });

  return null;
}

function getRandomPoint(points: TrainingPoint[], excludedPointId?: string) {
  if (points.length === 0) {
    return null;
  }

  const availablePoints =
    points.length > 1 && excludedPointId
      ? points.filter((point) => point.id !== excludedPointId)
      : points;

  return availablePoints[Math.floor(Math.random() * availablePoints.length)];
}

export default function MapTraining({
  title,
  description,
  points,
  storageKey,
  chartMaps = [],
}: MapTrainingProps) {
  const [activeView, setActiveView] = useState<TrainingView>('training');
  const [currentPointId, setCurrentPointId] = useState(
    () => getRandomPoint(points)?.id ?? '',
  );
  const [pointStatuses, setPointStatuses] = useState<PointStatuses>(() =>
    getInitialStatuses(points, storageKey),
  );
  const [pointFilter, setPointFilter] = useState<PointFilter>('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [studyBlockFilter, setStudyBlockFilter] = useState('all');
  const [listStudyBlockFilter, setListStudyBlockFilter] = useState('all');
  const [pointEdits, setPointEdits] = useState<PointEdits>(() =>
    getInitialPointEdits(storageKey),
  );
  const [editingBlockName, setEditingBlockName] = useState<string | null>(null);
  const [draftBlockName, setDraftBlockName] = useState('');
  const [addPointBlock, setAddPointBlock] = useState<string | null>(null);
  const [selectedPointToAdd, setSelectedPointToAdd] = useState('');
  const [mapMode, setMapMode] = useState<MapMode>(getInitialMapMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorRadius, setErrorRadius] = useState(10);
  const [result, setResult] = useState<ClickResult | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const editedPoints = useMemo(() => {
    return points.map((point) => {
      const pointEdit = pointEdits[point.id];

      return {
        ...point,
        name: pointEdit?.name?.trim() || point.name,
        studyBlock:
          pointEdit?.studyBlock !== undefined
            ? pointEdit.studyBlock.trim() || undefined
            : point.studyBlock,
      };
    });
  }, [pointEdits, points]);

  const filteredTrainingPoints = useMemo(() => {
    return editedPoints.filter((point) => {
      if (regionFilter !== 'all' && point.region !== regionFilter) {
        return false;
      }

      if (categoryFilter !== 'all' && point.category !== categoryFilter) {
        return false;
      }

      if (studyBlockFilter !== 'all' && point.studyBlock !== studyBlockFilter) {
        return false;
      }

      if (pointFilter === 'all') {
        return true;
      }

      return pointStatuses[point.id] === pointFilter;
    });
  }, [categoryFilter, editedPoints, pointFilter, pointStatuses, regionFilter, studyBlockFilter]);

  const regionOptions = useMemo(() => {
    return [...new Set(editedPoints.map((point) => point.region).filter(Boolean))].sort();
  }, [editedPoints]);

  const categoryOptions = useMemo(() => {
    return [...new Set(editedPoints.map((point) => point.category).filter(Boolean))].sort();
  }, [editedPoints]);

  const studyBlockOptions = useMemo(() => {
    return [...new Set(editedPoints.map((point) => point.studyBlock).filter(Boolean))].sort(
      (firstBlock, secondBlock) => {
        const firstOrder = preferredStudyBlockOrder.indexOf(firstBlock ?? '');
        const secondOrder = preferredStudyBlockOrder.indexOf(secondBlock ?? '');

        if (firstOrder !== -1 || secondOrder !== -1) {
          return (firstOrder === -1 ? 999 : firstOrder) - (secondOrder === -1 ? 999 : secondOrder);
        }

        const firstNumber = Number(firstBlock?.replace(/\D/g, ''));
        const secondNumber = Number(secondBlock?.replace(/\D/g, ''));

        if (!Number.isNaN(firstNumber) && !Number.isNaN(secondNumber)) {
          return firstNumber - secondNumber;
        }

        return String(firstBlock).localeCompare(String(secondBlock));
      },
    );
  }, [editedPoints]);

  const blockCounts = useMemo(() => {
    return studyBlockOptions.map((studyBlock) => ({
      studyBlock,
      count: editedPoints.filter((point) => point.studyBlock === studyBlock).length,
    }));
  }, [editedPoints, studyBlockOptions]);

  const sortedPoints = useMemo(() => {
    return [...editedPoints].sort((firstPoint, secondPoint) =>
      firstPoint.name.localeCompare(secondPoint.name),
    );
  }, [editedPoints]);

  const visibleListPoints = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return sortedPoints.filter((point) => {
      if (listStudyBlockFilter === '' && point.studyBlock) {
        return false;
      }

      if (
        listStudyBlockFilter !== 'all' &&
        listStudyBlockFilter !== '' &&
        point.studyBlock !== listStudyBlockFilter
      ) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return point.name.toLowerCase().includes(normalizedSearch);
    });
  }, [listStudyBlockFilter, searchQuery, sortedPoints]);

  const visibleListGroups = useMemo(() => {
    return visibleListPoints.reduce<Array<{ studyBlock: string; points: TrainingPoint[] }>>(
      (groups, point) => {
        const studyBlock = point.studyBlock || 'No block';
        const existingGroup = groups.find((group) => group.studyBlock === studyBlock);

        if (existingGroup) {
          existingGroup.points.push(point);
        } else {
          groups.push({ studyBlock, points: [point] });
        }

        return groups;
      },
      [],
    );
  }, [visibleListPoints]);

  const currentPoint =
    filteredTrainingPoints.find((point) => point.id === currentPointId) ??
    filteredTrainingPoints[0];

  const chartMapModes: ChartMapMode[] = chartMaps.map((chart) => ({
    label: chart.label,
    value: `chart:${chart.id}`,
    chartMap: chart,
  }));
  const mapModes: MapModeOption[] = [
    { label: 'Learning map', value: 'learning' },
    { label: 'Blank map', value: 'blank' },
    ...chartMapModes,
  ];
  const selectedChartMode = chartMapModes.find((mode) => mode.value === mapMode);
  const activeMapMode = mapModes.some((mode) => mode.value === mapMode)
    ? mapMode
    : 'blank';
  const selectedChartMap = selectedChartMode?.chartMap ?? null;
  const chartCenter: LatLngExpression | null = selectedChartMap
    ? [
        (selectedChartMap.bounds[0][0] + selectedChartMap.bounds[1][0]) / 2,
        (selectedChartMap.bounds[0][1] + selectedChartMap.bounds[1][1]) / 2,
      ]
    : null;
  const mapCenter: LatLngExpression =
    selectedChartMap && chartCenter ? chartCenter : switzerlandCenter;
  const answerPosition: LatLngExpression | null = currentPoint
    ? [currentPoint.latitude, currentPoint.longitude]
    : null;
  const shouldShowAnswer = showAnswer || result !== null;
  const knownCount = editedPoints.filter((point) => pointStatuses[point.id] === 'known').length;
  const unknownCount = editedPoints.length - knownCount;

  const statusText = useMemo(() => {
    if (result) {
      return result.isCorrect ? 'Correct' : 'Incorrect';
    }

    if (showAnswer) {
      return 'Answer shown';
    }

    return 'Click on the map to place the point.';
  }, [result, showAnswer]);

  function persistStatuses(nextStatuses: PointStatuses) {
    window.localStorage.setItem(storageKey, JSON.stringify(nextStatuses));
  }

  function persistPointEdits(nextPointEdits: PointEdits) {
    window.localStorage.setItem(
      getPointEditsStorageKey(storageKey),
      JSON.stringify(nextPointEdits),
    );
  }

  function savePointEdit(pointId: string, edit: PointEdit) {
    setPointEdits((currentPointEdits) => {
      const nextPointEdit = {
        ...currentPointEdits[pointId],
        ...edit,
      };
      const nextPointEdits = {
        ...currentPointEdits,
        [pointId]: nextPointEdit,
      };

      persistPointEdits(nextPointEdits);
      return nextPointEdits;
    });
  }

  function renameStudyBlock(oldStudyBlock: string, nextStudyBlock: string) {
    const cleanBlockName = nextStudyBlock.trim();

    if (!cleanBlockName || cleanBlockName === oldStudyBlock) {
      setEditingBlockName(null);
      return;
    }

    const nextPointEdits = editedPoints
      .filter((point) => (point.studyBlock || 'No block') === oldStudyBlock)
      .reduce<PointEdits>(
        (edits, point) => ({
          ...edits,
          [point.id]: {
            ...pointEdits[point.id],
            studyBlock: cleanBlockName,
          },
        }),
        { ...pointEdits },
      );

    setPointEdits(nextPointEdits);
    persistPointEdits(nextPointEdits);
    setEditingBlockName(null);
    setListStudyBlockFilter((currentFilter) =>
      currentFilter === oldStudyBlock ? cleanBlockName : currentFilter,
    );
  }

  function removePointFromBlock(pointId: string) {
    savePointEdit(pointId, { studyBlock: '' });
  }

  function addPointToBlock(studyBlock: string) {
    if (!selectedPointToAdd) {
      return;
    }

    savePointEdit(selectedPointToAdd, { studyBlock });
    setSelectedPointToAdd('');
    setAddPointBlock(null);
  }

  function handleMapModeChange(nextMapMode: MapMode) {
    setMapMode(nextMapMode);
    window.localStorage.setItem(mapModeStorageKey, nextMapMode);
  }

  function resetAttempt() {
    setResult(null);
    setShowAnswer(false);
  }

  function savePointStatus(pointId: string, status: PointStatus) {
    setPointStatuses((currentStatuses) => {
      const nextStatuses = {
        ...currentStatuses,
        [pointId]: status,
      };

      persistStatuses(nextStatuses);
      return nextStatuses;
    });
    resetAttempt();
  }

  function saveAllStatuses(status: PointStatus) {
    const nextStatuses = editedPoints.reduce<PointStatuses>((statuses, point) => {
      statuses[point.id] = status;
      return statuses;
    }, {});

    setPointStatuses(nextStatuses);
    persistStatuses(nextStatuses);
    resetAttempt();
  }

  function handleGuess(clickedPoint: Coordinate) {
    if (!currentPoint) {
      return;
    }

    const distanceKm = getDistanceKm(clickedPoint, currentPoint);

    setResult({
      distanceKm,
      isCorrect: distanceKm <= errorRadius,
      clickedPosition: clickedPoint,
    });
    setShowAnswer(true);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    if (result || showAnswer) {
      return;
    }

    handleGuess({
      latitude: event.latlng.lat,
      longitude: event.latlng.lng,
    });
  }

  function handleNextPoint() {
    if (filteredTrainingPoints.length === 0) {
      resetAttempt();
      return;
    }

    const nextPoint = getRandomPoint(filteredTrainingPoints, currentPoint?.id);

    if (nextPoint) {
      setCurrentPointId(nextPoint.id);
    }
    resetAttempt();
  }

  function handleShowAnswer() {
    setShowAnswer(true);
  }

  function handleFilterChange(nextFilter: PointFilter) {
    setPointFilter(nextFilter);
    resetAttempt();

    const nextPoints = editedPoints.filter((point) => {
      if (regionFilter !== 'all' && point.region !== regionFilter) {
        return false;
      }

      if (categoryFilter !== 'all' && point.category !== categoryFilter) {
        return false;
      }

      if (studyBlockFilter !== 'all' && point.studyBlock !== studyBlockFilter) {
        return false;
      }

      if (nextFilter === 'all') {
        return true;
      }

      return pointStatuses[point.id] === nextFilter;
    });

    if (!nextPoints.some((point) => point.id === currentPointId)) {
      setCurrentPointId(getRandomPoint(nextPoints)?.id ?? '');
    }
  }

  function handleStudyFilterChange(
    nextRegionFilter = regionFilter,
    nextCategoryFilter = categoryFilter,
    nextStudyBlockFilter = studyBlockFilter,
  ) {
    resetAttempt();

    const nextPoints = editedPoints.filter((point) => {
      if (nextRegionFilter !== 'all' && point.region !== nextRegionFilter) {
        return false;
      }

      if (nextCategoryFilter !== 'all' && point.category !== nextCategoryFilter) {
        return false;
      }

      if (nextStudyBlockFilter !== 'all' && point.studyBlock !== nextStudyBlockFilter) {
        return false;
      }

      if (pointFilter === 'all') {
        return true;
      }

      return pointStatuses[point.id] === pointFilter;
    });

    setCurrentPointId(getRandomPoint(nextPoints, currentPointId)?.id ?? '');
  }

  return (
    <section className="mt-8 w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/40">
      <div className="border-b border-slate-200 bg-white p-5 transition-colors dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">
              Training module
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">
              {title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 rounded-full bg-slate-100 p-1 dark:bg-slate-800 sm:grid-cols-2">
            {views.map((view) => (
              <button
                key={view.value}
                type="button"
                onClick={() => setActiveView(view.value)}
                className={[
                  'rounded-full px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2',
                  activeView === view.value
                    ? 'bg-sky-700 text-white shadow-sm shadow-sky-900/20'
                    : 'text-slate-700 hover:bg-white hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white',
                ].join(' ')}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeView === 'training' ? (
        <div>
          <div className="relative mx-auto h-[23rem] min-h-[23rem] w-full overflow-hidden bg-slate-100 dark:bg-slate-950 sm:h-[30rem] lg:h-[38rem]">
            <MapContainer
              key={mapMode}
              center={mapCenter}
              zoom={defaultZoom}
              scrollWheelZoom
              className="h-full w-full"
            >
              {activeMapMode === 'learning' ? (
                <TileLayer
                  attribution={swisstopoAttribution}
                  url={swisstopoColorTiles}
                />
              ) : selectedChartMap ? (
                <ImageOverlay
                  url={selectedChartMap.imageUrl}
                  bounds={selectedChartMap.bounds}
                />
              ) : (
                <TileLayer
                  attribution={swisstopoAttribution}
                  url={swisstopoGrayTiles}
                />
              )}
              <MapClickHandler onMapClick={handleMapClick} />

              {result && (
                <CircleMarker
                  center={[
                    result.clickedPosition.latitude,
                    result.clickedPosition.longitude,
                  ]}
                  pathOptions={{
                    color: result.isCorrect ? '#0284c7' : '#dc2626',
                    fillColor: result.isCorrect ? '#38bdf8' : '#f87171',
                    fillOpacity: 0.75,
                  }}
                  radius={8}
                />
              )}

              {shouldShowAnswer && answerPosition && (
                <>
                  <Circle
                    center={answerPosition}
                    pathOptions={{
                      color: '#0369a1',
                      fillColor: '#7dd3fc',
                      fillOpacity: 0.15,
                    }}
                    radius={errorRadius * 1000}
                  />
                  <CircleMarker
                    center={answerPosition}
                    pathOptions={{
                      color: '#075985',
                      fillColor: '#0ea5e9',
                      fillOpacity: 0.9,
                    }}
                    radius={9}
                  />
                </>
              )}
            </MapContainer>

            <div className="pointer-events-none absolute left-3 top-3 z-[500] max-w-[calc(100%-1.5rem)] rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl shadow-slate-900/15 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 sm:left-4 sm:top-4 sm:max-w-md sm:p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">
                Point to place
              </p>
              <div className="mt-1 flex flex-wrap items-end gap-2">
                <h4 className="text-2xl font-black leading-none text-slate-950 dark:text-white sm:text-4xl">
                  {currentPoint?.name ?? 'No point available'}
                </h4>
                {currentPoint && (
                  <span
                    className={[
                      'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]',
                      pointStatuses[currentPoint.id] === 'known'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                        : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200',
                    ].join(' ')}
                  >
                    {pointStatuses[currentPoint.id]}
                  </span>
                )}
              </div>
            </div>

            <label className="absolute bottom-3 right-3 z-[500] block w-[min(14rem,calc(100%-1.5rem))] rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl shadow-slate-900/15 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 sm:bottom-4 sm:right-4 sm:p-4">
              <span className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-200">
                <span>Error radius</span>
                <span className="text-sky-700 dark:text-sky-300">{errorRadius} km</span>
              </span>
              <input
                type="range"
                min="5"
                max="20"
                value={errorRadius}
                onChange={(event) => setErrorRadius(Number(event.target.value))}
                className="mt-3 w-full accent-sky-700"
              />
            </label>

            {(result || showAnswer) && (
              <div className="absolute right-3 top-3 z-[500] max-w-[calc(100%-1.5rem)] rounded-2xl border border-white/80 bg-white/95 p-3 text-right shadow-xl shadow-slate-900/15 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 sm:right-4 sm:top-4 sm:p-4">
                <p
                  className={[
                    'text-xl font-black',
                    result?.isCorrect
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : result
                        ? 'text-red-600 dark:text-red-300'
                        : 'text-sky-700 dark:text-sky-300',
                  ].join(' ')}
                >
                  {statusText}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">
                  {result
                    ? `${result.distanceKm.toFixed(1)} km error`
                    : 'Answer shown'}
                </p>
              </div>
            )}

            {(result || showAnswer) && (
              <button
                type="button"
                onClick={handleNextPoint}
                className="absolute bottom-3 left-3 z-[500] rounded-full bg-sky-700 px-5 py-3 text-sm font-black text-white shadow-xl shadow-sky-950/25 transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:bottom-4 sm:left-4"
              >
                Next point
              </button>
            )}
          </div>

          <aside className="grid gap-4 border-t border-slate-200 bg-slate-50 p-5 transition-colors dark:border-slate-700 dark:bg-slate-900/80 sm:p-6 lg:grid-cols-[0.9fr_1.1fr_1.1fr_1.1fr]">
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-center transition-colors dark:border-slate-700 dark:bg-slate-800">
              <div>
                <p className="text-xl font-bold text-slate-950 dark:text-white">{editedPoints.length}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total points</p>
              </div>
              <div>
                <p className="text-xl font-bold text-sky-700 dark:text-sky-300">{knownCount}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Known points</p>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-700 dark:text-slate-200">{unknownCount}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Unknown points</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-800">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Map mode</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                {mapModes.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => handleMapModeChange(mode.value)}
                    className={[
                      'rounded-full px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2',
                      activeMapMode === mode.value
                        ? 'bg-sky-700 text-white shadow-sm shadow-sky-900/20'
                        : 'border border-slate-300 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-sky-200',
                    ].join(' ')}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-800">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Training scope</p>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                Random draw uses this selection.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => handleFilterChange(filter.value)}
                    className={[
                      'rounded-full px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2',
                      pointFilter === filter.value
                        ? 'bg-sky-700 text-white shadow-sm shadow-sky-900/20'
                        : 'border border-slate-300 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-sky-200',
                    ].join(' ')}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {(regionOptions.length > 0 ||
              categoryOptions.length > 0 ||
              studyBlockOptions.length > 0) && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Study filters</p>
                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Train by region, theme, or 10-15 point blocks.
                </p>
                <div className="mt-3 grid gap-3">
                  {regionOptions.length > 0 && (
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                        Region
                      </span>
                      <select
                        value={regionFilter}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          setRegionFilter(nextValue);
                          handleStudyFilterChange(nextValue, categoryFilter, studyBlockFilter);
                        }}
                        className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                      >
                        <option value="all">All regions</option>
                        {regionOptions.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {categoryOptions.length > 0 && (
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                        Type
                      </span>
                      <select
                        value={categoryFilter}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          setCategoryFilter(nextValue);
                          handleStudyFilterChange(regionFilter, nextValue, studyBlockFilter);
                        }}
                        className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                      >
                        <option value="all">All types</option>
                        {categoryOptions.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {studyBlockOptions.length > 0 && (
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                        Learning block
                      </span>
                      <select
                        value={studyBlockFilter}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          setStudyBlockFilter(nextValue);
                          handleStudyFilterChange(regionFilter, categoryFilter, nextValue);
                        }}
                        className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                      >
                        <option value="all">All blocks</option>
                        {studyBlockOptions.map((studyBlock) => (
                          <option key={studyBlock} value={studyBlock}>
                            {studyBlock}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
              </div>
            )}

            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-1">
              <button
                type="button"
                onClick={() => currentPoint && savePointStatus(currentPoint.id, 'known')}
                disabled={!currentPoint}
                className="rounded-full border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-bold text-sky-800 transition hover:border-sky-300 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sky-700 dark:bg-sky-950/60 dark:text-sky-200 dark:hover:border-sky-500"
              >
                Mark as known
              </button>
              <button
                type="button"
                onClick={() => currentPoint && savePointStatus(currentPoint.id, 'unknown')}
                disabled={!currentPoint}
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-sky-300 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-sky-400 dark:hover:text-sky-200"
              >
                Mark as unknown
              </button>
              <button
                type="button"
                onClick={handleShowAnswer}
                disabled={!currentPoint}
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-sky-300 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-sky-400 dark:hover:text-sky-200"
              >
                Show answer
              </button>
              <button
                type="button"
                onClick={handleNextPoint}
                className="rounded-full bg-sky-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-900/20 transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Next point
              </button>
            </div>
          </aside>
        </div>
      ) : (
        <div className="bg-slate-50 p-5 transition-colors dark:bg-slate-900/80 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem_auto] lg:items-end">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Search points
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Filter by block
              </span>
              <select
                value={listStudyBlockFilter}
                onChange={(event) => setListStudyBlockFilter(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="all">All blocks</option>
                <option value="">No block</option>
                {studyBlockOptions.map((studyBlock) => (
                  <option key={studyBlock} value={studyBlock}>
                    {studyBlock}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => saveAllStatuses('known')}
                className="rounded-full bg-sky-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-900/20 transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Mark all as known
              </button>
              <button
                type="button"
                onClick={() => saveAllStatuses('unknown')}
                className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-sky-300 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-sky-400 dark:hover:text-sky-200"
              >
                Mark all as unknown
              </button>
            </div>
          </div>

          {blockCounts.length > 0 && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 transition-colors dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Learning blocks
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setListStudyBlockFilter('all')}
                  className={[
                    'rounded-full px-3 py-1 text-xs font-bold transition',
                    listStudyBlockFilter === 'all'
                      ? 'bg-sky-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700',
                  ].join(' ')}
                >
                  All
                </button>
                {blockCounts.map(({ studyBlock, count }) => (
                  <button
                    key={studyBlock}
                    type="button"
                    onClick={() => setListStudyBlockFilter(studyBlock ?? '')}
                    className={[
                      'rounded-full px-3 py-1 text-xs font-bold transition',
                      listStudyBlockFilter === studyBlock
                        ? 'bg-sky-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700',
                    ].join(' ')}
                  >
                    {studyBlock} · {count}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 grid gap-4">
            {visibleListGroups.length > 0 ? (
              visibleListGroups.map((group) => {
                const availablePointsForGroup = sortedPoints.filter(
                  (point) => (point.studyBlock || 'No block') !== group.studyBlock,
                );

                return (
                  <section
                    key={group.studyBlock}
                    className="rounded-xl border border-slate-200 bg-white/70 p-2 dark:border-slate-700 dark:bg-slate-800/60"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 dark:border-slate-700">
                      {editingBlockName === group.studyBlock ? (
                        <form
                          className="flex min-w-0 flex-1 items-center gap-2"
                          onSubmit={(event) => {
                            event.preventDefault();
                            renameStudyBlock(group.studyBlock, draftBlockName);
                          }}
                        >
                          <input
                            value={draftBlockName}
                            onChange={(event) => setDraftBlockName(event.target.value)}
                            className="min-w-0 flex-1 rounded-lg border border-sky-300 bg-white px-2 py-1 text-xs font-black text-slate-950 outline-none focus:ring-2 focus:ring-sky-200 dark:border-sky-700 dark:bg-slate-900 dark:text-white"
                          />
                          <button type="submit" className="rounded-full bg-sky-700 px-2 py-1 text-xs font-black text-white">
                            OK
                          </button>
                        </form>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setListStudyBlockFilter(group.studyBlock === 'No block' ? '' : group.studyBlock)}
                          className="min-w-0 truncate text-left text-xs font-black uppercase tracking-[0.12em] text-slate-800 transition hover:text-sky-700 dark:text-slate-100 dark:hover:text-sky-300"
                        >
                          {group.studyBlock}
                        </button>
                      )}

                      <div className="flex items-center gap-1">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                          {group.points.length}
                        </span>
                        {group.studyBlock !== 'No block' && (
                          <>
                            <button
                              type="button"
                              title="Rename block"
                              onClick={() => {
                                setEditingBlockName(group.studyBlock);
                                setDraftBlockName(group.studyBlock);
                              }}
                              className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-xs font-black text-slate-700 transition hover:border-sky-400 hover:text-sky-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                            >
                              ✎
                            </button>
                            <button
                              type="button"
                              title="Add point"
                              onClick={() => {
                                setAddPointBlock(addPointBlock === group.studyBlock ? null : group.studyBlock);
                                setSelectedPointToAdd('');
                              }}
                              className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-xs font-black text-slate-700 transition hover:border-sky-400 hover:text-sky-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                            >
                              +
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {addPointBlock === group.studyBlock && (
                      <div className="mt-2 grid gap-2 rounded-lg border border-sky-200 bg-sky-50 p-2 dark:border-sky-800 dark:bg-sky-950/40 sm:grid-cols-[minmax(0,1fr)_auto]">
                        <select
                          value={selectedPointToAdd}
                          onChange={(event) => setSelectedPointToAdd(event.target.value)}
                          className="min-w-0 rounded-lg border border-sky-200 bg-white px-2 py-1 text-xs font-bold text-slate-900 outline-none dark:border-sky-700 dark:bg-slate-900 dark:text-slate-100"
                        >
                          <option value="">Choose an existing point</option>
                          {availablePointsForGroup.map((point) => (
                            <option key={point.id} value={point.id}>
                              {point.name} {point.studyBlock ? `(${point.studyBlock})` : '(No block)'}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => addPointToBlock(group.studyBlock)}
                          className="rounded-full bg-sky-700 px-3 py-1 text-xs font-black text-white"
                        >
                          Add
                        </button>
                      </div>
                    )}

                    <div className="mt-2 grid gap-1 sm:grid-cols-2 xl:grid-cols-4">
                      {group.points.map((point) => {
                        const isKnown = pointStatuses[point.id] === 'known';

                        return (
                          <div
                            key={point.id}
                            className={[
                              'flex min-w-0 items-center gap-2 rounded-lg border px-2 py-1 transition',
                              isKnown
                                ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40'
                                : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/35',
                            ].join(' ')}
                          >
                            <input
                              type="checkbox"
                              checked={isKnown}
                              onChange={(event) =>
                                savePointStatus(
                                  point.id,
                                  event.target.checked ? 'known' : 'unknown',
                                )
                              }
                              className="h-3.5 w-3.5 shrink-0 accent-emerald-600"
                              title="Known"
                            />
                            <input
                              value={point.name}
                              onChange={(event) => savePointEdit(point.id, { name: event.target.value })}
                              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-xs font-bold text-slate-950 outline-none dark:text-slate-100"
                            />
                            {group.studyBlock !== 'No block' && (
                              <button
                                type="button"
                                title="Remove from block"
                                onClick={() => removePointFromBlock(point.id)}
                                className="shrink-0 rounded-full px-1.5 text-xs font-black text-slate-500 transition hover:bg-red-100 hover:text-red-700 dark:text-slate-300 dark:hover:bg-red-950"
                              >
                                -
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                No point matches your search.
              </div>
            )}
          </div>
          <datalist id={`${storageKey}-blocks`}>
            {studyBlockOptions.map((studyBlock) => (
              <option key={studyBlock} value={studyBlock} />
            ))}
          </datalist>
        </div>
      )}
    </section>
  );
}

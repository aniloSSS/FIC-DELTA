import type { TrainingPoint } from '../types/training';

const baseGeographyPoints: TrainingPoint[] = [
  {
    id: 'aigle',
    name: 'Aigle',
    latitude: 46.3181,
    longitude: 6.9646,
  },
  {
    id: 'annecy',
    name: 'Annecy',
    latitude: 45.8992,
    longitude: 6.1294,
  },
  {
    id: 'annemasse',
    name: 'Annemasse',
    latitude: 46.1944,
    longitude: 6.2377,
  },
  {
    id: 'bellegarde',
    name: 'Bellegarde',
    latitude: 46.108,
    longitude: 5.8242,
  },
  {
    id: 'bevaix',
    name: 'Bevaix',
    latitude: 46.9297,
    longitude: 6.8142,
  },
  {
    id: 'bonneville',
    name: 'Bonneville',
    latitude: 46.0802,
    longitude: 6.4073,
  },
  {
    id: 'bouveret',
    name: 'Bouveret',
    latitude: 46.3842,
    longitude: 6.8582,
  },
  {
    id: 'brevine',
    name: 'Brévine',
    latitude: 46.9801,
    longitude: 6.6069,
  },
  {
    id: 'brig',
    name: 'Brig',
    latitude: 46.3159,
    longitude: 7.9878,
  },
  {
    id: 'champagnole',
    name: 'Champagnole',
    latitude: 46.7447,
    longitude: 5.9074,
  },
  {
    id: 'charmey',
    name: 'Charmey',
    latitude: 46.6196,
    longitude: 7.1642,
  },
  {
    id: 'chasseral',
    name: 'Chasseral',
    latitude: 47.1322,
    longitude: 7.0593,
  },
  {
    id: 'chasseron',
    name: 'Chasseron',
    latitude: 46.8504,
    longitude: 6.5372,
  },
  {
    id: 'chateau-d-oex',
    name: "Château d'Oex",
    latitude: 46.4746,
    longitude: 7.132,
  },
  {
    id: 'cluses',
    name: 'Cluses',
    latitude: 46.0625,
    longitude: 6.574,
  },
  {
    id: 'col-de-la-forclaz',
    name: 'Col de la Forclaz',
    latitude: 46.0578,
    longitude: 7.0015,
  },
  {
    id: 'col-de-la-seigne',
    name: 'Col de la Seigne',
    latitude: 45.7504,
    longitude: 6.8084,
  },
  {
    id: 'col-des-mosses',
    name: 'Col des Mosses',
    latitude: 46.3951,
    longitude: 7.1037,
  },
  {
    id: 'col-du-pillon',
    name: 'Col du Pillon',
    latitude: 46.3525,
    longitude: 7.205,
  },
  {
    id: 'col-du-simplon',
    name: 'Col du Simplon',
    latitude: 46.2503,
    longitude: 8.0317,
  },
  {
    id: 'colombier',
    name: 'Colombier',
    latitude: 46.9667,
    longitude: 6.8619,
  },
  {
    id: 'concise',
    name: 'Concise',
    latitude: 46.8501,
    longitude: 6.7195,
  },
  {
    id: 'concordia-platz',
    name: 'Concordia Platz',
    latitude: 46.5004,
    longitude: 8.0531,
  },
  {
    id: 'corlier',
    name: 'Corlier',
    latitude: 46.0328,
    longitude: 5.4913,
  },
  {
    id: 'courmayeur',
    name: 'Courmayeur',
    latitude: 45.793,
    longitude: 6.971,
  },
  {
    id: 'cruseilles',
    name: 'Cruseilles',
    latitude: 46.0344,
    longitude: 6.1085,
  },
  {
    id: 'cudrefin',
    name: 'Cudrefin',
    latitude: 46.955,
    longitude: 7.018,
  },
  {
    id: 'cully',
    name: 'Cully',
    latitude: 46.4885,
    longitude: 6.729,
  },
  // TODO: Verify the exact summit/reference coordinate used by the training material.
  {
    id: 'dent-de-jaman',
    name: 'Dent de Jaman',
    latitude: 46.4495,
    longitude: 6.956,
  },
  {
    id: 'dents-du-midi',
    name: 'Dents du Midi',
    latitude: 46.161,
    longitude: 6.923,
  },
  {
    id: 'divonne-les-bains',
    name: 'Divonne les Bains',
    latitude: 46.3572,
    longitude: 6.1345,
  },
  {
    id: 'douvaine',
    name: 'Douvaine',
    latitude: 46.305,
    longitude: 6.304,
  },
  {
    id: 'eiger',
    name: 'Eiger',
    latitude: 46.5775,
    longitude: 8.0053,
  },
  {
    id: 'erlach',
    name: 'Erlach',
    latitude: 47.042,
    longitude: 7.098,
  },
  {
    id: 'estavayer-le-lac',
    name: 'Estavayer le Lac',
    latitude: 46.8487,
    longitude: 6.8467,
  },
  {
    id: 'evian-les-bains',
    name: 'Evian les Bains',
    latitude: 46.4012,
    longitude: 6.5908,
  },
  {
    id: 'fiesch',
    name: 'Fiesch',
    latitude: 46.3998,
    longitude: 8.1353,
  },
  {
    id: 'frangy',
    name: 'Frangy',
    latitude: 46.019,
    longitude: 5.93,
  },
  {
    id: 'fribourg',
    name: 'Fribourg',
    latitude: 46.8065,
    longitude: 7.1619,
  },
  // TODO: Verify whether this refers to Gampelen/Ins or a specific local pass reference.
  {
    id: 'gampelenpass',
    name: 'Gampelenpass',
    latitude: 47.014,
    longitude: 7.057,
  },
  {
    id: 'gland',
    name: 'Gland',
    latitude: 46.4208,
    longitude: 6.2701,
  },
  {
    id: 'grand-muveran',
    name: 'Grand Muveran',
    latitude: 46.2386,
    longitude: 7.1254,
  },
  {
    id: 'grand-st-bernard',
    name: 'Grand St Bernard',
    latitude: 45.8689,
    longitude: 7.1706,
  },
  {
    id: 'grandson',
    name: 'Grandson',
    latitude: 46.8095,
    longitude: 6.646,
  },
  {
    id: 'hermance',
    name: 'Hermance',
    latitude: 46.3025,
    longitude: 6.243,
  },
  {
    id: 'jaun',
    name: 'Jaun',
    latitude: 46.6109,
    longitude: 7.274,
  },
  {
    id: 'jaunpass',
    name: 'Jaunpass',
    latitude: 46.5889,
    longitude: 7.337,
  },
  {
    id: 'jungfrau',
    name: 'Jungfrau',
    latitude: 46.5368,
    longitude: 7.9623,
  },
  {
    id: 'kandersteg',
    name: 'Kandersteg',
    latitude: 46.4955,
    longitude: 7.6744,
  },
  {
    id: 'kerzers',
    name: 'Kerzers',
    latitude: 46.9759,
    longitude: 7.1957,
  },
  {
    id: 'la-clusaz',
    name: 'La Clusaz',
    latitude: 45.9048,
    longitude: 6.4234,
  },
  {
    id: 'la-roche-sur-foron',
    name: 'La Roche sur Foron',
    latitude: 46.066,
    longitude: 6.312,
  },
  {
    id: 'laupen',
    name: 'Laupen',
    latitude: 46.902,
    longitude: 7.239,
  },
  {
    id: 'le-chable',
    name: 'Le Châble',
    latitude: 46.0806,
    longitude: 7.2124,
  },
  {
    id: 'lenk',
    name: 'Lenk',
    latitude: 46.4583,
    longitude: 7.442,
  },
  {
    id: 'les-diablerets',
    name: 'Les Diablerets',
    latitude: 46.3496,
    longitude: 7.1586,
  },
  {
    id: 'les-verrieres',
    name: 'Les Verrières',
    latitude: 46.905,
    longitude: 6.48,
  },
  {
    id: 'lons-le-saunier',
    name: 'Lons le Saunier',
    latitude: 46.674,
    longitude: 5.553,
  },
  {
    id: 'martigny',
    name: 'Martigny',
    latitude: 46.1028,
    longitude: 7.0723,
  },
  {
    id: 'matterhorn',
    name: 'Matterhorn',
    latitude: 45.9763,
    longitude: 7.6586,
  },
  {
    id: 'meillerie',
    name: 'Meillerie',
    latitude: 46.407,
    longitude: 6.719,
  },
  // TODO: Verify whether the training reference is the Mont Sion ridge or the nearby pass/settlement.
  {
    id: 'mont-de-sion',
    name: 'Mont de Sion',
    latitude: 46.0808,
    longitude: 6.0908,
  },
  {
    id: 'montreux',
    name: 'Montreux',
    latitude: 46.4312,
    longitude: 6.9107,
  },
  {
    id: 'morbier',
    name: 'Morbier',
    latitude: 46.536,
    longitude: 6.017,
  },
  {
    id: 'morzine',
    name: 'Morzine',
    latitude: 46.1792,
    longitude: 6.7089,
  },
  {
    id: 'moudon',
    name: 'Moudon',
    latitude: 46.667,
    longitude: 6.797,
  },
  {
    id: 'nantua',
    name: 'Nantua',
    latitude: 46.153,
    longitude: 5.607,
  },
  {
    id: 'neuchatel',
    name: 'Neuchâtel',
    latitude: 46.9896,
    longitude: 6.9293,
  },
  {
    id: 'neuenegg',
    name: 'Neuenegg',
    latitude: 46.895,
    longitude: 7.305,
  },
  {
    id: 'noiraigue',
    name: 'Noiraigue',
    latitude: 46.954,
    longitude: 6.724,
  },
  {
    id: 'oyonnax',
    name: 'Oyonnax',
    latitude: 46.2592,
    longitude: 5.6573,
  },
  {
    id: 'payerne',
    name: 'Payerne',
    latitude: 46.8219,
    longitude: 6.9382,
  },
  {
    id: 'petit-st-bernard',
    name: 'Petit St Bernard',
    latitude: 45.6806,
    longitude: 6.8843,
  },
  {
    id: 'pontarlier',
    name: 'Pontarlier',
    latitude: 46.9035,
    longitude: 6.3558,
  },
  // TODO: Verify the exact pass coordinate used operationally.
  {
    id: 'rawilpass',
    name: 'Rawilpass',
    latitude: 46.371,
    longitude: 7.442,
  },
  {
    id: 'reichenbach',
    name: 'Reichenbach',
    latitude: 46.613,
    longitude: 7.689,
  },
  {
    id: 'riggisberg',
    name: 'Riggisberg',
    latitude: 46.81,
    longitude: 7.48,
  },
  {
    id: 'rolle',
    name: 'Rolle',
    latitude: 46.4582,
    longitude: 6.3349,
  },
  {
    id: 'romont',
    name: 'Romont',
    latitude: 46.696,
    longitude: 6.918,
  },
  {
    id: 'saanen',
    name: 'Saanen',
    latitude: 46.489,
    longitude: 7.259,
  },
  // TODO: Verify the intended Salève reference point on the massif.
  {
    id: 'saleve',
    name: 'Salève',
    latitude: 46.134,
    longitude: 6.187,
  },
  {
    id: 'sanetschpass',
    name: 'Sanetschpass',
    latitude: 46.333,
    longitude: 7.286,
  },
  {
    id: 'schwarzenburg',
    name: 'Schwarzenburg',
    latitude: 46.818,
    longitude: 7.342,
  },
  {
    id: 'schwarzsee',
    name: 'Schwarzsee',
    latitude: 46.669,
    longitude: 7.29,
  },
  {
    id: 'seyssel',
    name: 'Seyssel',
    latitude: 45.959,
    longitude: 5.836,
  },
  {
    id: 'st-aubin',
    name: 'St Aubin',
    latitude: 46.894,
    longitude: 6.773,
  },
  {
    id: 'st-claude',
    name: 'St Claude',
    latitude: 46.386,
    longitude: 5.864,
  },
  {
    id: 'st-genis',
    name: 'St Genis',
    latitude: 46.243,
    longitude: 6.021,
  },
  {
    id: 'st-gingolph',
    name: 'St Gingolph',
    latitude: 46.392,
    longitude: 6.805,
  },
  // TODO: Verify whether this refers to Saint-Point village or Lac de Saint-Point.
  {
    id: 'st-point',
    name: 'St Point',
    latitude: 46.815,
    longitude: 6.307,
  },
  {
    id: 'st-prex',
    name: 'St Prex',
    latitude: 46.479,
    longitude: 6.459,
  },
  {
    id: 'ste-croix',
    name: 'Ste Croix',
    latitude: 46.821,
    longitude: 6.503,
  },
  {
    id: 'thones',
    name: 'Thônes',
    latitude: 45.881,
    longitude: 6.325,
  },
  {
    id: 'thonon',
    name: 'Thonon',
    latitude: 46.373,
    longitude: 6.479,
  },
  {
    id: 'thun',
    name: 'Thun',
    latitude: 46.758,
    longitude: 7.628,
  },
  {
    id: 'travers',
    name: 'Travers',
    latitude: 46.94,
    longitude: 6.675,
  },
  {
    id: 'ugine',
    name: 'Ugine',
    latitude: 45.752,
    longitude: 6.419,
  },
  {
    id: 'verbier',
    name: 'Verbier',
    latitude: 46.096,
    longitude: 7.228,
  },
  {
    id: 'versoix',
    name: 'Versoix',
    latitude: 46.284,
    longitude: 6.165,
  },
  {
    id: 'vevey',
    name: 'Vevey',
    latitude: 46.462,
    longitude: 6.843,
  },
  {
    id: 'villeneuve',
    name: 'Villeneuve',
    latitude: 46.398,
    longitude: 6.927,
  },
  {
    id: 'visp',
    name: 'Visp',
    latitude: 46.293,
    longitude: 7.882,
  },
  {
    id: 'witzwil',
    name: 'Witzwil',
    latitude: 46.999,
    longitude: 7.065,
  },
  {
    id: 'yverdon',
    name: 'Yverdon',
    latitude: 46.7785,
    longitude: 6.6412,
  },
  {
    id: 'yvoire',
    name: 'Yvoire',
    latitude: 46.371,
    longitude: 6.326,
  },
  {
    id: 'yvonand',
    name: 'Yvonand',
    latitude: 46.8,
    longitude: 6.742,
  },
  {
    id: 'zermatt',
    name: 'Zermatt',
    latitude: 46.0207,
    longitude: 7.7491,
  },
];

const supplementalGeographyPoints: TrainingPoint[] = [
  {
    id: 'col-de-jougne',
    name: 'Col de Jougne',
    latitude: 46.7625,
    longitude: 6.3908,
  },
  {
    id: 'col-de-la-faucille',
    name: 'Col de la Faucille',
    latitude: 46.3667,
    longitude: 6.0147,
  },
  {
    id: 'col-de-la-givrine',
    name: 'Col de la Givrine',
    latitude: 46.4542,
    longitude: 6.1072,
  },
  {
    id: 'col-de-st-cergue',
    name: 'Col de St Cergue',
    latitude: 46.4464,
    longitude: 6.1572,
  },
  {
    id: 'col-des-etroits',
    name: 'Col des Etroits',
    latitude: 46.8292,
    longitude: 6.4992,
  },
  {
    id: 'col-du-marchairuz',
    name: 'Col du Marchairuz',
    latitude: 46.5528,
    longitude: 6.2508,
  },
  {
    id: 'col-du-mollendruz',
    name: 'Col du Mollendruz',
    latitude: 46.6508,
    longitude: 6.3633,
  },
  {
    id: 'creux-du-van',
    name: 'Creux du Van',
    latitude: 46.9294,
    longitude: 6.7242,
  },
  {
    id: 'lac-d-annecy',
    name: "Lac d'Annecy",
    latitude: 45.8464,
    longitude: 6.1719,
  },
  {
    id: 'lac-de-bienne',
    name: 'Lac de Bienne',
    latitude: 47.086,
    longitude: 7.16,
  },
  {
    id: 'lac-de-joux',
    name: 'Lac de Joux',
    latitude: 46.632,
    longitude: 6.285,
  },
  {
    id: 'lac-de-morat',
    name: 'Lac de Morat',
    latitude: 46.9305,
    longitude: 7.087,
  },
  {
    id: 'lac-du-bourget',
    name: 'Lac du Bourget',
    latitude: 45.7394,
    longitude: 5.8758,
  },
  {
    id: 'lac-leman',
    name: 'Lac Leman',
    latitude: 46.45,
    longitude: 6.55,
  },
  {
    id: 'lac-neuchatel',
    name: 'Lac Neuchatel',
    latitude: 46.9,
    longitude: 6.8,
  },
  {
    id: 'vue-des-alpes',
    name: 'Vue des Alpes',
    latitude: 47.0736,
    longitude: 6.8697,
  },
];

const aerodromeGeographyPoints: TrainingPoint[] = [
  {
    id: 'aerodrome-bern-lszb',
    name: 'Bern LSZB',
    latitude: 46.9141,
    longitude: 7.4972,
  },
  {
    id: 'aerodrome-bex-lsgb',
    name: 'Bex LSGB',
    latitude: 46.2583,
    longitude: 6.9864,
  },
  {
    id: 'aerodrome-bressaucourt-lszq',
    name: 'Bressaucourt LSZQ',
    latitude: 47.3925,
    longitude: 7.0286,
  },
  {
    id: 'aerodrome-ecuvillens-lsge',
    name: 'Ecuvillens LSGE',
    latitude: 46.755,
    longitude: 7.0761,
  },
  {
    id: 'aerodrome-geneve-lsgg',
    name: 'Geneve LSGG',
    latitude: 46.2381,
    longitude: 6.109,
  },
  {
    id: 'aerodrome-gruyeres-lsgt',
    name: 'Gruyeres LSGT',
    latitude: 46.5942,
    longitude: 7.0944,
  },
  {
    id: 'aerodrome-la-cote-lsgp',
    name: 'La Cote LSGP',
    latitude: 46.4064,
    longitude: 6.2581,
  },
  {
    id: 'aerodrome-lausanne-lsgl',
    name: 'Lausanne LSGL',
    latitude: 46.5453,
    longitude: 6.6167,
  },
  {
    id: 'aerodrome-les-eplatures-lsgc',
    name: 'Les Eplatures LSGC',
    latitude: 47.0839,
    longitude: 6.7928,
  },
  {
    id: 'aerodrome-meiringen-lsmm',
    name: 'Meiringen LSMM',
    latitude: 46.7433,
    longitude: 8.11,
  },
  {
    id: 'aerodrome-neuchatel-lsgn',
    name: 'Neuchatel LSGN',
    latitude: 46.9575,
    longitude: 6.8647,
  },
  {
    id: 'aerodrome-payerne-lsmp',
    name: 'Payerne LSMP',
    latitude: 46.8432,
    longitude: 6.9151,
  },
  {
    id: 'aerodrome-saanen-lsgk',
    name: 'Saanen LSGK',
    latitude: 46.4875,
    longitude: 7.2508,
  },
  {
    id: 'aerodrome-sion-lsgs',
    name: 'Sion LSGS',
    latitude: 46.2196,
    longitude: 7.3268,
  },
  {
    id: 'aerodrome-yverdon-lsgy',
    name: 'Yverdon-les-Bains LSGY',
    latitude: 46.7619,
    longitude: 6.6133,
  },
];

function getCategory(point: TrainingPoint) {
  const normalizedName = point.name.toLowerCase();

  if (normalizedName.includes('ls')) {
    return 'Aerodromes';
  }

  if (normalizedName.includes('lac')) {
    return 'Lakes';
  }

  if (
    normalizedName.includes('col ') ||
    normalizedName.includes('pass') ||
    normalizedName.includes('bernard') ||
    normalizedName.includes('simplon')
  ) {
    return 'Passes';
  }

  if (
    normalizedName.includes('dent') ||
    normalizedName.includes('dents') ||
    normalizedName.includes('eiger') ||
    normalizedName.includes('jungfrau') ||
    normalizedName.includes('matterhorn') ||
    normalizedName.includes('muveran') ||
    normalizedName.includes('saleve') ||
    normalizedName.includes('chasseral') ||
    normalizedName.includes('chasseron') ||
    normalizedName.includes('creux')
  ) {
    return 'Mountains';
  }

  return 'Towns and visual points';
}

function getStudyBlock(point: TrainingPoint) {
  if (point.category === 'Aerodromes') {
    return 'Aerodromes / Airports';
  }

  if (point.category === 'Passes') {
    return 'Passes / Cols';
  }

  if (point.category === 'Mountains') {
    return 'Mountains / Relief';
  }

  if (point.category === 'Lakes') {
    return 'Lakes';
  }

  if (point.region === 'Lake Geneva') {
    return 'Lake Geneva / Geneva Periphery';
  }

  if (point.region === 'Jura / France' || point.region === 'Jura / Neuchatel') {
    return 'Jura';
  }

  if (point.region === 'Haute-Savoie / Ain') {
    return 'Haute-Savoie / Ain';
  }

  if (point.region === 'Valais / Alps' || point.region === 'Bernese Oberland') {
    return 'Alps';
  }

  if (point.region === 'Three Lakes / Broye') {
    return 'Three Lakes / Broye';
  }

  return 'Central sector';
}

const studyBlockOrder = [
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

function getRegion(point: TrainingPoint) {
  const { latitude, longitude } = point;

  if (longitude < 6.2 && latitude > 46.1) {
    return 'Jura / France';
  }

  if (latitude < 46.25 && longitude <= 6.85) {
    return 'Haute-Savoie / Ain';
  }

  if (latitude < 46.45 && longitude > 6.85) {
    return 'Valais / Alps';
  }

  if (longitude >= 7.3 && latitude >= 46.45) {
    return 'Bernese Oberland';
  }

  if (latitude >= 46.65 && longitude >= 6.55 && longitude < 7.35) {
    return 'Three Lakes / Broye';
  }

  if (latitude >= 46.75 && longitude < 6.75) {
    return 'Jura / Neuchatel';
  }

  if (longitude >= 6.0 && longitude <= 7.05 && latitude >= 46.25 && latitude < 46.65) {
    return 'Lake Geneva';
  }

  return 'Central sector';
}

const orderedGeographyPoints = [
  ...baseGeographyPoints,
  ...supplementalGeographyPoints,
  ...aerodromeGeographyPoints,
]
  .map((point) => ({
    ...point,
    category: getCategory(point),
    region: getRegion(point),
  }))
  .map((point) => ({
    ...point,
    studyBlock: getStudyBlock(point),
  }))
  .sort((firstPoint, secondPoint) =>
    (studyBlockOrder.indexOf(firstPoint.studyBlock ?? '') -
      studyBlockOrder.indexOf(secondPoint.studyBlock ?? '')) ||
    firstPoint.name.localeCompare(secondPoint.name),
  );

export const geographyPoints: TrainingPoint[] = orderedGeographyPoints;

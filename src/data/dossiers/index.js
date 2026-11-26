import { PHYSICS_DOSSIERS } from './physicsDossiers';
import { MATHEMATICS_DOSSIERS } from './mathematicsDossiers';
import { LIFE_DOSSIERS } from './lifeDossiers';

/**
 * The dossier library.
 *
 * Lenses are the discovery surface: a reader arrives with a question ("can a
 * machine understand?") rather than a discipline. Every dossier belongs to one
 * or two lenses, and the lens page is a reading path rather than a category
 * label.
 */
export const DOSSIERS = [...PHYSICS_DOSSIERS, ...MATHEMATICS_DOSSIERS, ...LIFE_DOSSIERS];

export const LENSES = [
  {
    id: 'reality',
    label: 'Reality',
    note: 'What the world is made of, and what it means to observe it.',
  },
  {
    id: 'time',
    label: 'Time',
    note: 'Why things happen in one direction, and whether they have to.',
  },
  {
    id: 'infinity',
    label: 'Infinity',
    note: 'What happens when a proof runs past the edge of intuition.',
  },
  {
    id: 'logic',
    label: 'Logic',
    note: 'What a formal system can establish about itself.',
  },
  {
    id: 'mind-machine',
    label: 'Mind & Machine',
    note: 'Computation, information, and the boundary between them and thought.',
  },
  {
    id: 'life',
    label: 'Life',
    note: 'How much behaviour can emerge without a controller.',
  },
  {
    id: 'matter',
    label: 'Matter',
    note: 'Forces, phases, and the strange behaviour of ordinary stuff.',
  },
];

export const DOSSIER_BY_ID = DOSSIERS.reduce((map, dossier) => {
  map[dossier.id] = dossier;
  return map;
}, {});

export const getDossier = (id) => DOSSIER_BY_ID[id] || null;

export const getRelatedDossiers = (dossier) =>
  (dossier?.related || []).map((id) => DOSSIER_BY_ID[id]).filter(Boolean);

/** Total written words, counted once, for the library masthead. */
export const DOSSIER_WORD_COUNT = DOSSIERS.reduce((total, dossier) => {
  let words = `${dossier.standfirst} ${dossier.opening}`.split(/\s+/).length;
  dossier.sections.forEach((section) => {
    words += (section.body || []).join(' ').split(/\s+/).length;
    (section.items || []).forEach((item) => {
      words += `${item.term || ''} ${item.definition || ''} ${item.title || ''} ${item.text || ''}`.split(/\s+/).length;
    });
    (section.rows || []).forEach((row) => {
      words += row.join(' ').split(/\s+/).length;
    });
    words += (section.correction || '').split(/\s+/).length;
    words += (section.claim || '').split(/\s+/).length;
    words += (section.note || '').split(/\s+/).length;
  });
  return total + words;
}, 0);

export const searchDossiers = (query) => {
  const needle = (query || '').trim().toLowerCase();
  if (needle.length < 2) return DOSSIERS;
  return DOSSIERS.filter((dossier) => {
    const haystack = [
      dossier.title,
      dossier.standfirst,
      dossier.field,
      dossier.opening,
      dossier.sections.map((section) => section.heading).join(' '),
      dossier.sections.map((section) => (section.body || []).join(' ')).join(' '),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(needle);
  });
};

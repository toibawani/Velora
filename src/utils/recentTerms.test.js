import {
  MAX_RECENT_TERMS,
  forgetRecentTerms,
  getRecentTermIds,
  rememberTerm,
  resolveRecentTerms,
} from './recentTerms';
import { KEYS } from './storage';

const terms = [
  { id: 'momentum', term: 'Momentum' },
  { id: 'entropy', term: 'Entropy' },
  { id: 'stoicism', term: 'Stoicism' },
];

beforeEach(() => localStorage.clear());

test('starts empty rather than inventing a history', () => {
  expect(getRecentTermIds()).toEqual([]);
});

test('keeps the newest first', () => {
  rememberTerm('momentum');
  rememberTerm('entropy');
  expect(getRecentTermIds()).toEqual(['entropy', 'momentum']);
});

test('re-opening an entry moves it to the front instead of duplicating it', () => {
  rememberTerm('momentum');
  rememberTerm('entropy');
  rememberTerm('momentum');
  expect(getRecentTermIds()).toEqual(['momentum', 'entropy']);
});

test('holds a fixed number of entries, dropping the oldest', () => {
  for (let i = 0; i < MAX_RECENT_TERMS + 3; i += 1) rememberTerm(`term-${i}`);
  const ids = getRecentTermIds();
  expect(ids).toHaveLength(MAX_RECENT_TERMS);
  expect(ids[0]).toBe(`term-${MAX_RECENT_TERMS + 2}`);
  expect(ids).not.toContain('term-0');
});

test('ignores a blank id rather than storing a chip that opens nothing', () => {
  rememberTerm('momentum');
  rememberTerm('');
  rememberTerm(null);
  rememberTerm('   ');
  expect(getRecentTermIds()).toEqual(['momentum']);
});

test('drops a stored value that is not a list of ids', () => {
  localStorage.setItem(KEYS.RECENT_TERMS, JSON.stringify({ v: 1, data: 'momentum' }));
  expect(getRecentTermIds()).toEqual([]);

  localStorage.setItem(KEYS.RECENT_TERMS, JSON.stringify({ v: 1, data: ['ok', 7] }));
  expect(getRecentTermIds()).toEqual([]);
});

test('resolves ids to the entries that exist now, skipping the rest', () => {
  rememberTerm('momentum');
  rememberTerm('deleted-term');
  rememberTerm('entropy');

  expect(resolveRecentTerms(terms).map((term) => term.id)).toEqual(['entropy', 'momentum']);
  expect(resolveRecentTerms(undefined)).toEqual([]);
});

test('can be forgotten', () => {
  rememberTerm('momentum');
  forgetRecentTerms();
  expect(getRecentTermIds()).toEqual([]);
});

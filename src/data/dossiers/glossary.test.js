import {
  DOSSIER_GLOSSARY,
  GLOSSARY_FORMS,
  GLOSSARY_COUNT,
  buildGlossaryPattern,
  lookupDossierTerm,
} from './glossary';
import { DOSSIERS } from './index';

/**
 * The glossary's contract, and the reason the popovers are worth having: a
 * definition that is not reachable from the prose is decoration. These tests
 * check that entries are well formed, that their cross-references resolve, and
 * that every dossier actually contains enough glossary terms for the reader to
 * have something to tap.
 */
describe('the dossier glossary', () => {
  test('covers the library rather than a handful of words', () => {
    expect(GLOSSARY_COUNT).toBeGreaterThanOrEqual(80);
    expect(GLOSSARY_FORMS.length).toBeGreaterThanOrEqual(GLOSSARY_COUNT);
  });

  test('every entry is a real definition with a field', () => {
    DOSSIER_GLOSSARY.forEach((entry) => {
      expect(entry.term.length).toBeGreaterThan(2);
      expect(entry.field.length).toBeGreaterThan(2);
      expect(entry.brief.length).toBeGreaterThan(40);
      expect(entry.brief.length).toBeLessThan(320);
    });
  });

  test('no term is defined twice', () => {
    const seen = new Map();
    DOSSIER_GLOSSARY.forEach((entry) => {
      const key = entry.term.toLowerCase();
      expect(seen.has(key)).toBe(false);
      seen.set(key, entry);
    });
  });

  test('every cross-reference points at something that exists', () => {
    DOSSIER_GLOSSARY.forEach((entry) => {
      entry.see.forEach((name) => {
        expect(lookupDossierTerm(name)).not.toBeNull();
      });
    });
  });

  test('lookup is case-insensitive and matches aliases', () => {
    expect(lookupDossierTerm('ENTROPY')).toBeTruthy();
    expect(lookupDossierTerm('quantum zeno effect')).toBeTruthy();
    expect(lookupDossierTerm('not a term in this library')).toBeNull();
  });

  test('every dossier has at least six glossary terms a reader can tap', () => {
    DOSSIERS.forEach((dossier) => {
      const text = [
        dossier.opening,
        dossier.standfirst,
        ...dossier.sections.flatMap((section) => [
          ...(section.body || []),
          ...(section.items || []).map((item) => `${item.term || ''} ${item.definition || ''} ${item.title || ''} ${item.text || ''}`),
          ...(section.rows || []).map((row) => row.join(' ')),
          section.note || '',
          section.claim || '',
          section.correction || '',
        ]),
      ].join(' ');

      const found = new Set();
      const pattern = buildGlossaryPattern();
      let match = pattern.exec(text);
      while (match) {
        const entry = lookupDossierTerm(match[1]);
        if (entry) found.add(entry.term);
        match = pattern.exec(text);
      }

      expect(found.size).toBeGreaterThanOrEqual(6);
    });
  });
});

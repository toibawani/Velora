import {
  DOSSIERS,
  DOSSIER_WORD_COUNT,
  LENSES,
  getDossier,
  getRelatedDossiers,
  searchDossiers,
} from './dossiers';

/**
 * The library's contract. These are not tests of taste; they are tests that the
 * reader will have the fields it renders, that every dossier is sourced, and
 * that a math section can actually be read (an equation without a symbol table
 * is the exact failure the dossier format exists to prevent).
 */
describe('the dossier library', () => {
  test('has a substantial set of dossiers', () => {
    expect(DOSSIERS.length).toBeGreaterThanOrEqual(8);
    expect(new Set(DOSSIERS.map((dossier) => dossier.id)).size).toBe(DOSSIERS.length);
  });

  test('every dossier has the fields the reader renders', () => {
    DOSSIERS.forEach((dossier) => {
      expect(dossier.title.length).toBeGreaterThan(3);
      expect(dossier.standfirst.length).toBeGreaterThan(80);
      expect(dossier.opening.length).toBeGreaterThan(120);
      expect(dossier.field).toBeTruthy();
      expect(dossier.status).toBeTruthy();
      expect(dossier.lenses.length).toBeGreaterThanOrEqual(1);
      expect(dossier.minutes).toBeGreaterThan(5);
      expect(dossier.sections.length).toBeGreaterThanOrEqual(5);
      expect(dossier.sources.length).toBeGreaterThanOrEqual(3);
    });
  });

  test('every section has a heading and content of its kind', () => {
    DOSSIERS.forEach((dossier) => {
      dossier.sections.forEach((section) => {
        expect(section.heading.length).toBeGreaterThan(4);
        if (section.kind === 'math') {
          expect(section.equation).toBeTruthy();
          expect(section.symbols.length).toBeGreaterThanOrEqual(3);
          section.symbols.forEach((symbol) => {
            expect(symbol.symbol).toBeTruthy();
            expect(symbol.meaning).toBeTruthy();
          });
        } else if (section.kind === 'terms') {
          expect(section.items.length).toBeGreaterThanOrEqual(3);
        } else if (section.kind === 'table') {
          expect(section.columns.length).toBeGreaterThanOrEqual(2);
          section.rows.forEach((row) => expect(row).toHaveLength(section.columns.length));
        } else if (section.kind === 'misconception') {
          expect(section.claim).toBeTruthy();
          expect(section.correction.length).toBeGreaterThan(100);
        } else if (section.kind === 'questions') {
          expect(section.items.length).toBeGreaterThanOrEqual(3);
        } else if (section.kind === 'steps') {
          expect(section.items.length).toBeGreaterThanOrEqual(3);
          section.items.forEach((item) => {
            expect(item.title).toBeTruthy();
            expect(item.text.length).toBeGreaterThan(40);
          });
        } else {
          expect(section.body.length).toBeGreaterThanOrEqual(1);
        }
      });
    });
  });

  test('every source is a real https link', () => {
    DOSSIERS.forEach((dossier) => {
      dossier.sources.forEach((source) => {
        expect(source.label.length).toBeGreaterThan(10);
        expect(source.url).toMatch(/^https:\/\//);
      });
    });
  });

  test('the library is long enough to be worth the name', () => {
    expect(DOSSIER_WORD_COUNT).toBeGreaterThan(9000);
  });

  test('related ids resolve, and no dossier relates to itself', () => {
    DOSSIERS.forEach((dossier) => {
      expect(dossier.related).not.toContain(dossier.id);
      dossier.related.forEach((id) => expect(getDossier(id)).not.toBeNull());
      expect(getRelatedDossiers(dossier).length).toBeGreaterThanOrEqual(1);
    });
  });

  test('every lens is used by at least one dossier', () => {
    LENSES.forEach((lens) => {
      expect(DOSSIERS.some((dossier) => dossier.lenses.includes(lens.label))).toBe(true);
    });
  });

  test('search runs over the body, not only the title', () => {
    expect(searchDossiers('Unruh').map((dossier) => dossier.id)).toContain('unruh-effect');
    expect(searchDossiers('Rindler horizon').map((dossier) => dossier.id)).toContain('unruh-effect');
    expect(searchDossiers('Feigenbaum')).toHaveLength(0);
    expect(searchDossiers('')).toHaveLength(DOSSIERS.length);
  });
});

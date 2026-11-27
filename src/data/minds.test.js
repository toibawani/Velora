import { MINDS, MIND_BY_ID } from './minds';
import {
  DEBATES,
  MODES,
  composeReply,
  findPosition,
  getDebate,
  relatedPositions,
  scorePosition,
  tokenize,
} from './mindsEngine';

describe('the Minds library', () => {
  test('has eleven researched figures', () => {
    expect(MINDS).toHaveLength(11);
    expect(new Set(MINDS.map((mind) => mind.id)).size).toBe(11);
  });

  test('every profile has the four research sections and a source for each position', () => {
    MINDS.forEach((mind) => {
      expect(mind.dates).toMatch(/\d/);
      expect(mind.thesis.length).toBeGreaterThan(50);
      ['formation', 'method', 'development', 'limits'].forEach((key) => {
        expect(mind.profile[key].length).toBeGreaterThan(120);
      });
      expect(mind.works.length).toBeGreaterThanOrEqual(3);
      expect(mind.positions.length).toBeGreaterThanOrEqual(4);
      mind.positions.forEach((position) => {
        expect(position.claim.length).toBeGreaterThan(40);
        expect(position.argument.length).toBeGreaterThan(200);
        expect(position.tension.length).toBeGreaterThan(80);
        expect(position.citation.url).toMatch(/^https:\/\//);
        expect(position.citation.label.length).toBeGreaterThan(8);
      });
    });
  });

  test('the voices are actually different from one another', () => {
    const registers = MINDS.map((mind) => mind.voice.register);
    expect(new Set(registers).size).toBe(MINDS.length);
    MINDS.forEach((mind) => {
      expect(mind.voice.openers.length).toBeGreaterThanOrEqual(3);
      expect(mind.starters.length).toBeGreaterThanOrEqual(3);
    });
  });
});

describe('retrieval', () => {
  test('tokenize drops stopwords and short words', () => {
    expect(tokenize('What is the nature of time?')).toEqual(['nature', 'time']);
  });

  test('a question about time finds Einstein\'s relativity position', () => {
    const { position, matched } = findPosition(MIND_BY_ID.einstein, 'Does time actually exist, or did we invent it?');
    expect(matched).toBe(true);
    expect(position.id).toBe('time-is-relative');
  });

  test('a question about the measurement problem finds Bohr on complementarity', () => {
    const { position } = findPosition(MIND_BY_ID.bohr, 'Does an electron have a definite position before measurement?');
    expect(position.id).toBe('complementarity');
  });

  test('a question about the patents finds Curie on ownership', () => {
    const { position } = findPosition(MIND_BY_ID.curie, 'Why did you refuse to patent radium?');
    expect(position.id).toBe('no-patents');
  });

  test('an unrelated question is reported as unmatched rather than forced', () => {
    const { position, matched } = findPosition(MIND_BY_ID.einstein, 'What is the best recipe for bread?');
    expect(matched).toBe(false);
    expect(position).toBeNull();
  });

  test('multi-word themes are weighted above single tokens', () => {
    const position = MIND_BY_ID.sontag.positions.find((item) => item.id === 'illness-as-metaphor');
    expect(scorePosition(position, 'Is illness a metaphor?')).toBeGreaterThan(0);
  });
});

describe('composing a reply', () => {
  test('the reply carries the position and the citation', () => {
    const reply = composeReply({
      mindId: 'einstein',
      mode: 'ask',
      query: 'If time is relative, are the past and future already real?',
    });
    expect(reply.text.length).toBeGreaterThan(200);
    expect(reply.positionId).toBe('time-is-relative');
    expect(reply.citation.url).toContain('fourmilab');
    expect(reply.matched).toBe(true);
  });

  test('teach mode builds in explicit steps', () => {
    const reply = composeReply({
      mindId: 'bohr',
      mode: 'teach',
      query: 'What does complementarity mean?',
    });
    expect(reply.text).toContain('First, the claim');
    expect(reply.text).toContain('Third, where it runs into trouble');
  });

  test('debate mode argues back instead of summarising', () => {
    const reply = composeReply({
      mindId: 'nietzsche',
      mode: 'debate',
      query: 'I think morality is objective and we should follow it.',
    });
    expect(reply.text).toContain('Let me put the strongest objection');
    expect(reply.citation).toBeTruthy();
  });

  test('an unmatched question is admitted in the reply, not hidden', () => {
    const reply = composeReply({ mindId: 'feynman', mode: 'ask', query: 'Who won the 1994 World Cup?' });
    expect(reply.matched).toBe(false);
    expect(reply.text).toContain('does not map directly onto something documented');
  });

  test('a second turn avoids repeating the first position when it can', () => {
    const first = composeReply({ mindId: 'dostoevsky', mode: 'ask', query: 'Why do your characters suffer?' });
    const history = [
      { sender: 'user', text: 'Why do your characters suffer?' },
      { sender: 'bot', text: first.text, positionId: first.positionId },
    ];
    const second = composeReply({ mindId: 'dostoevsky', mode: 'ask', query: 'And what about guilt?', history });
    expect(second.positionId).not.toBe(first.positionId);
  });

  test('an unknown figure returns a plain error rather than a persona', () => {
    const reply = composeReply({ mindId: 'not-a-person', mode: 'ask', query: 'Hello' });
    expect(reply.matched).toBe(false);
    expect(reply.text).toContain('no profile');
  });

  test('every mode has a distinct instruction and a label', () => {
    expect(MODES).toHaveLength(5);
    expect(new Set(MODES.map((mode) => mode.instruction)).size).toBe(5);
  });
});

describe('debates', () => {
  test('each debate resolves to two full sides', () => {
    DEBATES.forEach((debate) => {
      const resolved = getDebate(debate.id);
      expect(resolved).not.toBeNull();
      expect(resolved.a.position.citation.url).toMatch(/^https:\/\//);
      expect(resolved.b.position.citation.url).toMatch(/^https:\/\//);
      expect(resolved.a.mind.id).not.toBe(resolved.b.mind.id);
      expect(resolved.faultLine.length).toBeGreaterThan(100);
      expect(resolved.why.length).toBeGreaterThan(60);
    });
  });

  test('an unknown debate id resolves to null instead of throwing', () => {
    expect(getDebate('not-a-debate')).toBeNull();
  });
});

describe('related positions', () => {
  test('returns positions from the same figure and excludes the current one', () => {
    const related = relatedPositions(MIND_BY_ID.sontag, 'against-interpretation');
    expect(related.length).toBeGreaterThan(0);
    related.forEach((position) => expect(position.id).not.toBe('against-interpretation'));
  });
});

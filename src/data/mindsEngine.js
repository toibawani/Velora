import { MINDS, MIND_BY_ID } from './minds';

/**
 * The conversation engine.
 *
 * WHAT THIS IS
 * ------------
 * A deterministic retrieval engine over the documented positions in minds.js.
 * It matches a question to the positions that address it, then composes an
 * answer in the figure's register from the position's own argument, claim,
 * citation and stated tension.
 *
 * WHAT THIS IS NOT
 * ----------------
 * A language model. It cannot answer a question that no position covers, and it
 * says so rather than improvising. It does not invent quotations, and every
 * reply carries the source the position is built from.
 *
 * The composition is deliberately transparent: the reply names which position
 * it is drawing on, so a reader can check the argument against the source
 * instead of treating the prose as authority.
 */

export const MODES = [
  {
    id: 'ask',
    label: 'Ask anything',
    short: 'Ask',
    description: 'Put a question directly. The reply is built from the closest documented position.',
    instruction: 'Answer the question from the closest position, and name the position.',
  },
  {
    id: 'debate',
    label: 'Debate me',
    short: 'Debate',
    description: 'State a view and it will be challenged. The figure argues back rather than explaining.',
    instruction: 'Take the opposing view and force the reader to defend the premise.',
  },
  {
    id: 'teach',
    label: 'Teach me',
    short: 'Teach',
    description: 'Ask for the idea to be built from its foundations, in the figure\'s own terms.',
    instruction: 'Build the idea in ordered steps, defining each term as it appears.',
  },
  {
    id: 'challenge',
    label: 'Challenge my thinking',
    short: 'Challenge',
    description: 'Ask what you are missing. The reply finds the assumption and turns it over.',
    instruction: 'Identify the hidden assumption and show what follows if it is false.',
  },
  {
    id: 'work',
    label: 'Explore a work',
    short: 'Work',
    description: 'Ask about a book, essay or paper, and where the argument sits inside it.',
    instruction: 'Locate the argument in the work, and say what the work does not settle.',
  },
];

export const MODE_BY_ID = MODES.reduce((map, mode) => {
  map[mode.id] = mode;
  return map;
}, {});

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'than', 'that', 'this', 'these', 'those',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'am', 'do', 'does', 'did', 'have', 'has',
  'had', 'can', 'could', 'should', 'would', 'will', 'shall', 'may', 'might', 'must', 'to', 'of',
  'in', 'on', 'at', 'by', 'for', 'with', 'about', 'into', 'from', 'as', 'it', 'its', 'you', 'your',
  'i', 'me', 'my', 'we', 'our', 'they', 'their', 'he', 'she', 'his', 'her', 'them', 'what', 'why',
  'how', 'when', 'where', 'who', 'which', 'not', 'no', 'yes', 'so', 'just', 'really', 'very',
  'think', 'say', 'said', 'mean', 'meant', 'tell', 'please', 'there', 'here', 'also', 'more',
  'most', 'some', 'any', 'all', 'one', 'two', 'like', 'want', 'need', 'know', 'make', 'made',
]);

export const tokenize = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));

/**
 * Score one position against a query. Theme phrases may be multi-word, so a
 * phrase hit counts more than a token hit. Title words count too, because a
 * reader often asks about the named idea ("complementarity").
 */
export function scorePosition(position, query) {
  const lower = String(query || '').toLowerCase();
  const tokens = tokenize(query);
  let strong = 0;

  position.themes.forEach((theme) => {
    if (theme.includes(' ')) {
      if (lower.includes(theme)) strong += 3;
      return;
    }
    if (tokens.includes(theme)) strong += 2;
    else if (lower.includes(theme)) strong += 1;
  });

  tokenize(position.title).forEach((word) => {
    if (tokens.includes(word)) strong += 2;
  });

  // A weak overlap with the prose is not evidence that the question is about
  // this position: almost every paragraph contains words like "world" or "think".
  // Without this gate, "who won the World Cup" matched a position on physics.
  if (strong === 0) return 0;

  let weak = 0;
  tokens.forEach((word) => {
    if (position.claim.toLowerCase().includes(word)) weak += 0.4;
    if (position.argument.toLowerCase().includes(word)) weak += 0.2;
  });

  return strong + Math.min(weak, 1.5);
}

/** The best position for a query, with an explicit "nothing matched" result. */
export function findPosition(mind, query, excludeIds = []) {
  if (!mind) return { position: null, score: 0, matched: false };
  const candidates = mind.positions
    .filter((position) => !excludeIds.includes(position.id))
    .map((position) => ({ position, score: scorePosition(position, query) }))
    .sort((a, b) => b.score - a.score);

  const best = candidates[0];
  if (!best || best.score < 2) return { position: null, score: best?.score || 0, matched: false };
  return { position: best.position, score: best.score, matched: true };
}

const pick = (list, index) => list[index % list.length];

/**
 * Compose a reply. `history` is the transcript, used only for turn count and to
 * avoid repeating a position the figure has already used in this conversation.
 */
export function composeReply({ mindId, mode = 'ask', query, history = [] }) {
  const mind = MIND_BY_ID[mindId];
  if (!mind) {
    return {
      text: 'There is no profile under that name in the library.',
      citation: null,
      positionId: null,
      matched: false,
      note: 'Unknown figure.',
    };
  }

  const usedIds = history
    .filter((message) => message.sender === 'bot' && message.positionId)
    .map((message) => message.positionId);
  const turn = Math.floor(history.filter((message) => message.sender === 'bot').length / 1);

  const { position, matched } = findPosition(mind, query, usedIds);
  // If everything has been used, allow a repeat rather than answering nothing.
  const chosen = position || findPosition(mind, query).position || mind.positions[0];

  const opener = pick(mind.voice.openers, turn);
  const closer = pick(mind.voice.closers, turn + 1);

  const attribution = matched
    ? `I am drawing on the position below, from ${chosen.citation.label}.`
    : `Your question does not map directly onto something documented. The closest position in this profile is the one below, from ${chosen.citation.label}. I will not invent an answer beyond it.`;

  // Stated in the reply itself, before any content: an unmatched question must
  // not be answered as if the figure had addressed it.
  const caveat = matched ? null : attribution;
  let text = '';
  let note = '';

  if (mode === 'debate') {
    text = [
      `${opener} You have stated a view. Let me put the strongest objection to it.`,
      ...(caveat ? [caveat] : []),
      `${chosen.claim}`,
      `${chosen.argument}`,
      `Now defend your premise. ${chosen.tension}`,
      closer,
    ].join('\n\n');
    note = 'Debate mode: the reply argues from the position rather than summarising it. The tension at the end is the part the position itself has not resolved.';
  } else if (mode === 'teach') {
    text = [
      `${opener}`,
      ...(caveat ? [caveat] : []),
      `First, the claim, stated plainly: ${chosen.claim}`,
      `Second, why it follows: ${chosen.argument}`,
      `Third, where it runs into trouble: ${chosen.tension}`,
      closer,
    ].join('\n\n');
    note = 'Teach mode: claim, derivation, and limit. The third step is not an afterthought; it is what distinguishes an argument from a slogan.';
  } else if (mode === 'challenge') {
    text = [
      `${opener} The assumption in your question is doing more work than you think.`,
      ...(caveat ? [caveat] : []),
      `You are treating this as a question about ${chosen.title.toLowerCase()}. ${chosen.claim}`,
      `${chosen.argument}`,
      `If that is right, then the thing you are protecting may be the thing that needs to be given up. ${chosen.tension}`,
      closer,
    ].join('\n\n');
    note = 'Challenge mode: the reply locates a premise and follows it. It is not a verdict on you; it is an argument you can answer.';
  } else if (mode === 'work') {
    const work = mind.works[0];
    text = [
      `${opener}`,
      ...(caveat ? [caveat] : []),
      `The argument is developed in ${work.title} (${work.year}). ${work.note}`,
      `${chosen.claim}`,
      `${chosen.argument}`,
      `What the work leaves open: ${chosen.tension}`,
      closer,
    ].join('\n\n');
    note = 'Work mode: the position is placed in the text it comes from, with the part that remains unresolved.';
  } else {
    text = [
      `${opener}`,
      ...(caveat ? [caveat] : []),
      chosen.claim,
      chosen.argument,
      `Where this runs into difficulty: ${chosen.tension}`,
      closer,
    ].join('\n\n');
    note = 'Ask mode: the claim, its argument, and the tension the position itself acknowledges.';
  }

  return {
    text,
    citation: chosen.citation,
    positionId: chosen.id,
    positionTitle: chosen.title,
    matched,
    note,
    attribution,
    followUp: `A question to take further: ${followUpFor(chosen)}`,
  };
}

/** A follow-up drawn from the position's own unresolved edge. */
function followUpFor(position) {
  const first = position.tension.split(/(?<=\.)\s/)[0];
  return first.replace(/^This /, 'Does this ').replace(/\.$/, '?');
}

/**
 * Curated debates. Each pairs two documented positions that genuinely conflict,
 * rather than two figures who are merely different. The "fault line" sentence
 * names the disagreement precisely enough to be argued with.
 */
export const DEBATES = [
  {
    id: 'einstein-bohr',
    title: 'Is quantum mechanics complete?',
    question: 'Does the quantum state describe everything there is to know about a system, or does it describe only our information about it?',
    a: { mindId: 'einstein', positionId: 'quantum-incomplete' },
    b: { mindId: 'bohr', positionId: 'epr-reply' },
    faultLine:
      'Einstein keeps locality and reality and concludes that the description is incomplete. Bohr keeps the completeness of the quantum description and denies that the separated particles have independent properties to be disturbed. The disagreement is not about the mathematics, which both accept. It is about what the mathematics is a description of.',
    why: 'Bell\'s theorem and the entanglement experiments make this the most consequential disagreement in modern physics: whatever the answer, it cannot be the one Einstein wanted without giving up locality.',
  },
  {
    id: 'nietzsche-dostoevsky',
    title: 'Morality, suffering and the human being',
    question: 'Are moral values inventions that should be overcome, or is guilt the evidence that we are answerable to something beyond ourselves?',
    a: { mindId: 'nietzsche', positionId: 'genealogy-of-morals' },
    b: { mindId: 'dostoevsky', positionId: 'guilt-and-responsibility' },
    faultLine:
      'Nietzsche treats morality as a historical artefact whose function must be examined, and the examination is the beginning of freedom. Dostoevsky treats guilt as a relation that cannot be argued away, and the attempt to reason it away as the punishment. One sees the moral law as a human fabrication to be overcome; the other sees the attempt to overcome it as the thing that destroys the person who tries.',
    why: 'The two men never met, but they read each other. Nietzsche admired Dostoevsky\'s psychology; Dostoevsky\'s novels stage the collapse of exactly the kind of self-legislating individual Nietzsche praised.',
  },
  {
    id: 'sontag-dostoevsky',
    title: 'What should we do with the image of suffering?',
    question: 'Does representing suffering create obligation, or does it turn another person\'s pain into something we consume?',
    a: { mindId: 'sontag', positionId: 'photography-as-acquisition' },
    b: { mindId: 'dostoevsky', positionId: 'problem-of-evil' },
    faultLine:
      'Sontag begins from the suspicion that the image is an appropriation, and that the camera converts a person into something to be looked at. Dostoevsky begins from the refusal to let the suffering be absorbed into a larger harmony: the child\'s tear is not a symbol, and any account that makes it meaningful has already betrayed it. Both refuse consolation, from opposite directions: one distrusts the image, the other distrusts the explanation.',
    why: 'Sontag\'s later book reconsiders her own position on images of atrocity. Placing it against Dostoevsky\'s refusal shows what is at stake: whether attention can be a form of respect or is always a form of use.',
  },
  {
    id: 'curie-feynman',
    title: 'How do you know when you are not fooling yourself?',
    question: 'Is scientific integrity a matter of method, or of character?',
    a: { mindId: 'curie', positionId: 'isolate-then-theorise' },
    b: { mindId: 'feynman', positionId: 'cargo-cult' },
    faultLine:
      'Curie answers with procedure: isolate the substance, measure it, show the effect follows it through a chemical separation. The method is the safeguard. Feynman answers with character: the procedure can be performed perfectly and still be a ritual, and what separates science from cargo cult is the willingness to report the result that ruins the story. Curie would say the discipline is in the bench work; Feynman would say the discipline is in the person doing it.',
    why: 'The two answers are not incompatible, but they locate the failure differently, and that difference matters for how institutions train scientists and check their work.',
  },
  {
    id: 'ibnkhaldun-nietzsche',
    title: 'Power, decline and the individual',
    question: 'Is history driven by the rise and decay of collective bonds, or by exceptional individuals who legislate their own values?',
    a: { mindId: 'ibn-khaldun', positionId: 'cyclical-dynasties' },
    b: { mindId: 'nietzsche', positionId: 'self-overcoming' },
    faultLine:
      'Ibn Khaldun explains political life by a structural cycle: solidarity forms under hardship, founds a state, and is dissolved by the comfort the state produces. The individual is a bearer of the cycle. Nietzsche explains it by the rare individual who overcomes the values of his time and imposes form on himself; the collective is the herd from which the individual must separate. One sees persons as expressions of a social structure, the other sees social structures as the residue of persons who did or did not have the strength to create.',
    why: 'This is the oldest argument in the philosophy of history, and it is still unresolved because both descriptions can be made to fit the same evidence. The interesting question is which one gives you better leverage when you want to change something.',
  },
];

export const DEBATE_BY_ID = DEBATES.reduce((map, debate) => {
  map[debate.id] = debate;
  return map;
}, {});

/** Resolve a debate into full records, so the screen does not re-derive them. */
export function getDebate(debateId) {
  const debate = DEBATE_BY_ID[debateId];
  if (!debate) return null;
  const side = (ref) => {
    const mind = MIND_BY_ID[ref.mindId];
    const position = mind?.positions.find((item) => item.id === ref.positionId);
    return mind && position ? { mind, position } : null;
  };
  const a = side(debate.a);
  const b = side(debate.b);
  if (!a || !b) return null;
  return { ...debate, a, b };
}

/** Positions that share a theme with the one just discussed, for "read next". */
export function relatedPositions(mind, positionId, limit = 2) {
  if (!mind) return [];
  const current = mind.positions.find((position) => position.id === positionId);
  if (!current) return [];
  return mind.positions
    .filter((position) => position.id !== positionId)
    .map((position) => ({
      position,
      overlap: position.themes.filter((theme) => current.themes.includes(theme)).length,
    }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((entry) => entry.position);
}

export const MINDS_BY_THEME = (theme) => MINDS.filter((mind) => mind.themes.includes(theme));

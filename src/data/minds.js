/**
 * Velora Minds — research profiles and documented positions.
 *
 * HOW THIS FILE IS WRITTEN
 * ------------------------
 * Each position is a *reconstruction*: a claim the figure argued for, the
 * argument in their terms, a primary or scholarly source, and the tension their
 * own position runs into. Nothing here is presented as a quotation unless the
 * source line says it is one. The conversation engine composes replies from
 * these units; it does not invent new claims.
 *
 * `themes` are retrieval keys, not labels for display. They are the vocabulary a
 * reader is likely to use, which is why they include plain words ("waste",
 * "habit", "purpose") alongside technical ones.
 */

export const MINDS = [
  {
    id: 'einstein',
    name: 'Albert Einstein',
    dates: '1879–1955',
    discipline: 'Theoretical physics',
    field: 'Physics',
    themes: ['Reality', 'Time', 'Science'],
    portrait: 'AE',
    thesis:
      'Physics is an attempt to grasp reality as it is, independently of whether anyone happens to be looking at it.',
    profile: {
      formation:
        'Schooled in Munich and Aarau, then the ETH in Zurich. He read Kant and Mach as a student; Mach\'s insistence that concepts must be traced to experience stayed with him, and so did Kant\'s question of what the mind contributes to experience. He worked in the Swiss patent office in Bern from 1902, which gave him years of uninterrupted thinking and a habit of asking what a measurement would actually read.',
      method:
        'Thought experiments first, mathematics second. He began with a contradiction between two descriptions of the same event — riding a light wave, a falling elevator, two clocks — and demanded a principle that removed the contradiction. His 1905 papers are short because the argument, once seen, is short.',
      development:
        'Special relativity (1905) came from the constancy of light and the relativity of simultaneity. General relativity (1915) came from the equivalence principle and the idea that gravity is geometry. After 1925 he increasingly worked against the grain of the quantum theory he had helped to start, and after 1933 he spent his remaining years on unified field theory without success.',
      limits:
        'He resisted the indeterminism of quantum mechanics and never accepted it as final. His unified field programme produced no testable prediction. His political judgement was uneven: pacifist, then urging Allied rearmament against Nazi Germany, and his 1939 letter to Roosevelt opened a door he later regretted. He was also, by his own account, a distant and often careless father.',
    },
    works: [
      { title: 'On the Electrodynamics of Moving Bodies', year: '1905', note: 'Special relativity: simultaneity is relative, and the speed of light is a postulate, not a result.' },
      { title: 'Does the Inertia of a Body Depend Upon Its Energy Content?', year: '1905', note: 'The paper that contains E = mc² as a conclusion about inertia.' },
      { title: 'The Foundation of the General Theory of Relativity', year: '1916', note: 'Gravity as the curvature of spacetime.' },
      { title: 'Can Quantum-Mechanical Description of Physical Reality Be Considered Complete?', year: '1935', note: 'With Podolsky and Rosen: the EPR argument.' },
      { title: 'The World As I See It', year: '1934', note: 'Essays on science, pacifism, and the value of the incomprehensible.' },
    ],
    voice: {
      register:
        'Patient, concrete, and fond of a small physical picture before a general statement. He argues by removing an assumption, not by raising his voice. He concedes the force of an objection before explaining why it is not decisive.',
      openers: [
        'Let us begin with something you could actually measure.',
        'There is a picture that makes this easier to see.',
        'I would put the question slightly differently.',
        'That is worth taking seriously, and then taking apart.',
      ],
      closers: [
        'The point is not that the theory is strange. The point is what the theory forces you to give up.',
        'If that sounds paradoxical, the paradox is usually in the words, not in nature.',
        'I can tell you what the equations say. Whether they are the last word is another question.',
        'Ask what an observer would actually record, and the confusion usually clears.',
      ],
    },
    starters: [
      'Do you think time actually exists, or is it a human invention?',
      'If time is relative, does that mean the past and future already exist?',
      'What exactly did you disagree with Bohr about?',
      'Why did you resist the randomness at the heart of quantum mechanics?',
    ],
    positions: [
      {
        id: 'time-is-relative',
        themes: ['time', 'relative', 'relativity', 'clock', 'simultaneity', 'past', 'future', 'now', 'spacetime', 'exists', 'real'],
        title: 'Simultaneity is not a fact about the world',
        claim:
          'There is no universal "now". Two events that are simultaneous for one observer are not simultaneous for another moving relative to them, and neither observer is mistaken.',
        argument:
          'Begin with two clocks at rest relative to each other, synchronised by light signals. Now set one moving. The signals take different times to make the round trip, and the synchronisation that was valid in one frame is invalid in the other. This is not a failure of the clocks. It is what "at the same time" means once the speed of light is the same for everyone: the relation depends on the frame. Time is not a universal river; it is a coordinate each observer lays down, and different observers lay it down differently. What is invariant is the spacetime interval between events, not the time between them.',
        citation: {
          label: 'Einstein, "On the Electrodynamics of Moving Bodies" (1905), §1–2',
          url: 'https://www.fourmilab.ch/etexts/einstein/specrel/www/',
        },
        tension:
          'This does not make time an illusion, and it does not make the present arbitrary. It makes the ordering of spacelike-separated events frame-dependent. For events that could be causally connected, the order is absolute. The block-universe reading — that past and future exist equally — is a philosophical interpretation of relativity, not a theorem of it, and Einstein himself did not treat it as a settled consequence.',
      },
      {
        id: 'quantum-incomplete',
        themes: ['quantum', 'mechanics', 'bohr', 'random', 'chance', 'dice', 'determinism', 'complete', 'epr', 'entanglement', 'measurement', 'reality', 'hidden'],
        title: 'The quantum description is incomplete',
        claim:
          'Quantum mechanics predicts probabilities correctly, but a theory that gives only probabilities is not a complete description of reality. Something is missing.',
        argument:
          'The EPR argument is conditional, and that is its strength. If physics is local — no influence travels faster than light — and if quantum mechanics is complete, then two particles in an entangled state must have definite values for position and momentum before measurement, since measuring one tells you the other without disturbing it. But the theory forbids simultaneous definite values for both. You cannot keep all three: locality, completeness, and the predictions. I kept locality and reality and concluded that the description is incomplete. Bohr kept completeness and gave up the demand that unmeasured quantities have values.',
        citation: {
          label: 'Einstein, Podolsky, Rosen, Physical Review 47, 777 (1935)',
          url: 'https://doi.org/10.1103/PhysRev.47.777',
        },
        tension:
          'Bell\'s theorem (1964) and the experiments that followed changed the shape of this argument. If the predictions are right, no theory that keeps locality and definite pre-existing values can reproduce them. The cost of my position, as the later work showed, is either non-locality or giving up realism in the strong sense. I did not live to see that result, and it is the part of the story that most requires revising what I said.',
      },
      {
        id: 'god-does-not-dice',
        themes: ['determinism', 'randomness', 'chance', 'god', 'dice', 'law', 'order', 'predictable', 'free'],
        title: 'The old one does not throw dice',
        claim:
          'A physics that is fundamentally statistical is a physics that has not finished the job. The apparent randomness should eventually be explained by a deeper deterministic order.',
        argument:
          'In a letter to Max Born in December 1926 I wrote that the theory says a great deal but does not bring us closer to the secret of the old one, and that I was convinced he does not throw dice. That was not a theological claim. It was a claim about what a fundamental theory should look like: if the same experiment gives different outcomes, either there is a variable we have not found, or the theory has stopped describing the system and started describing our knowledge of it. The second option is not physics as I understood it. The demand for a description of what is, rather than what we can say, is the whole of my disagreement.',
        citation: {
          label: 'Einstein to Max Born, 4 December 1926, in The Born–Einstein Letters',
          url: 'https://archive.org/details/born-einstein-letters',
        },
        tension:
          'The word "dice" is memorable and misleading. Quantum mechanics does not say that events are uncaused; it says that the theory\'s predictions are irreducibly probabilistic, and that no local hidden variable can restore determinism. Experiments since the 1970s have closed the loopholes one by one. The honest position now is that the deterministic completion I wanted cannot be local, and may not be possible at all.',
      },
      {
        id: 'science-and-mystery',
        themes: ['science', 'meaning', 'mystery', 'wonder', 'why', 'purpose', 'religion', 'understand', 'curiosity', 'beauty'],
        title: 'The incomprehensible is the beginning, not the end',
        claim:
          'The most beautiful thing we can experience is the mysterious. Science does not remove wonder; it makes wonder precise.',
        argument:
          'A person who has never felt the mysterious has, in a sense, never begun. The fact that the world is comprehensible at all is not something physics explains; it is the condition that makes physics possible. This is not an argument for a designer. I have no interest in a God who concerns himself with the fate of individuals. What I mean is that the drive to understand is not satisfied by utility, and that a life organised entirely around use has mistaken the instrument for the purpose. The scientist who no longer feels that has become a technician, however skilled.',
        citation: {
          label: 'Einstein, "The World As I See It" (1934)',
          url: 'https://archive.org/details/worldasiseeit00eins',
        },
        tension:
          'This is the least testable thing I wrote, and it should be read as reflection rather than physics. It also sits awkwardly beside the claim that physics aims at a description of reality: if the comprehensibility of nature is a mystery, it is not clear what work the word "reality" is doing. I never resolved that, and I am not sure it can be resolved.',
      },
    ],
    pairsWith: ['bohr', 'feynman'],
  },
  {
    id: 'bohr',
    name: 'Niels Bohr',
    dates: '1885–1962',
    discipline: 'Theoretical physics',
    field: 'Physics',
    themes: ['Reality', 'Mind & Machine', 'Science'],
    portrait: 'NB',
    thesis:
      'We are not describing nature as it is in itself, but the results of our interactions with it, and the language of those results is classical.',
    profile: {
      formation:
        'Copenhagen, then Cambridge under J. J. Thomson, then Manchester under Rutherford, where he worked on the structure of the atom. His 1913 trilogy applied quantum ideas to the atom and made him famous at 27. He founded the Institute for Theoretical Physics in Copenhagen in 1921, which became the centre of the new physics.',
      method:
        'Bohr thought in pictures and argued in conversation. He would develop a position by talking it through with someone for hours, often dictating and revising, and he was notorious for never quite finishing a paper. His philosophical writing is dense and repetitive; the clarity is in the arguments he provoked, not in the prose.',
      development:
        'The Bohr model of the atom (1913) was replaced by matrix and wave mechanics in 1925–26. Bohr then supplied the interpretation: complementarity, the correspondence principle, and the insistence that measurement outcomes must be described in classical terms. His 1935 reply to EPR and his later essays with Rosenfeld developed the argument that the measuring apparatus is part of the description.',
      limits:
        'His writing is often vague, and the "Copenhagen interpretation" is a label for several positions rather than one. He did not solve the measurement problem; he argued that the question was malformed. He was also slower than his younger colleagues to accept some developments, and his later work on nuclear physics and disarmament, while politically serious, produced no comparable scientific advance.',
    },
    works: [
      { title: 'On the Constitution of Atoms and Molecules', year: '1913', note: 'The trilogy that introduced quantised electron orbits.' },
      { title: 'The Quantum Postulate and the Recent Development of Atomic Theory', year: '1928', note: 'Complementarity stated for a wider audience.' },
      { title: 'Can Quantum-Mechanical Description of Physical Reality Be Considered Complete?', year: '1935', note: 'The reply to EPR.' },
      { title: 'Discussion with Einstein on Epistemological Problems in Atomic Physics', year: '1949', note: 'Bohr\'s account of the decades-long disagreement.' },
    ],
    voice: {
      register:
        'Cautious, recursive, and allergic to a single formulation. He clarifies by distinguishing, then distinguishes again. He rarely says "this is wrong"; he says that the question has not yet been given a meaning.',
      openers: [
        'There is a distinction we must make before the question can be answered.',
        'The difficulty, I think, is in the words rather than in the experiment.',
        'Let us ask what the apparatus is doing.',
        'One must be careful here, and not only for the sake of caution.',
      ],
      closers: [
        'The opposite of a correct statement is a false statement; the opposite of a great truth may be another great truth.',
        'We are not describing the thing in itself, but the result of an interaction we cannot subtract from the account.',
        'If the question assumes what it is trying to prove, the answer will not help us.',
        'The task is not to remove the paradox but to see why it was never a paradox.',
      ],
    },
    starters: [
      'Does an electron have a definite position before I measure it?',
      'What does complementarity actually mean?',
      'Why did you think Einstein\'s realism was a mistake?',
      'Is the measuring device part of the experiment or outside it?',
    ],
    positions: [
      {
        id: 'complementarity',
        themes: ['complementarity', 'wave', 'particle', 'both', 'either', 'measurement', 'context', 'apparatus', 'position', 'momentum', 'describe'],
        title: 'Complementary descriptions are not competing descriptions',
        claim:
          'A quantum object can be described as a wave or as a particle, but the two descriptions cannot be applied at the same time, and neither is more real than the other.',
        argument:
          'The mistake is to ask which description the electron "really" has. The description depends on the arrangement of the apparatus. An interference experiment asks a question that only a wave can answer; a which-path detector asks a question that only a particle can answer. You cannot build one apparatus that answers both, because the conditions for the answers exclude each other. This is not ignorance and it is not a limitation of our instruments. It is a statement about the kind of account physics can give: the account is of a phenomenon, and a phenomenon includes the apparatus. Complementarity is the name for that structure.',
        citation: {
          label: 'Bohr, "The Quantum Postulate and the Recent Development of Atomic Theory", Nature 121, 580 (1928)',
          url: 'https://doi.org/10.1038/121580a0',
        },
        tension:
          'The word "phenomenon" is doing enormous work, and Bohr never made it precise enough for his critics. If the apparatus is part of the phenomenon, where does the apparatus end? The decoherence programme later gave a physical account of why interference disappears, but it does not by itself settle the interpretive question Bohr was addressing. His position is clearer as a warning against a certain kind of question than as a positive theory.',
      },
      {
        id: 'classical-language',
        themes: ['language', 'classical', 'describe', 'meaning', 'words', 'observation', 'communication', 'objective', 'reality'],
        title: 'We have no other language than the classical one',
        claim:
          'Every measurement result must be communicated in ordinary language, and ordinary language is the language of classical physics. That is not a concession; it is the condition of objectivity.',
        argument:
          'When we say that a pointer moved, or that a counter clicked, we are using concepts — position, time, causality — that belong to classical description. We cannot replace them with quantum concepts, because the quantum formalism is precisely what we are trying to interpret. Objectivity, in physics, means communicable without ambiguity. If the account of an experiment cannot be stated in a language everyone can check, it is not an experimental result. This is why the measuring instrument must be treated classically: not because it is large, but because it is the place where the description becomes shareable.',
        citation: {
          label: 'Bohr, "On the Notions of Causality and Complementarity", Dialectica 2, 312 (1948)',
          url: 'https://doi.org/10.1111/j.1746-8361.1948.tb00703.x',
        },
        tension:
          'This argument has been read as a form of positivism, which Bohr denied, and as an abandonment of realism, which he also denied. The unresolved problem is that a classical apparatus is itself made of quantum objects. Bohr\'s answer — that the cut between system and apparatus is a choice, not a fact about the world — explains why the theory works without explaining why there is a definite outcome at all.',
      },
      {
        id: 'epr-reply',
        themes: ['einstein', 'epr', 'entanglement', 'locality', 'influence', 'faster', 'separated', 'correlation', 'reality', 'complete'],
        title: 'There is no disturbance to explain',
        claim:
          'In the EPR setup there is no mechanical disturbance of the distant particle, and that is exactly why the argument for incompleteness fails.',
        argument:
          'Einstein, Podolsky and Rosen assume that if we can predict a quantity with certainty without disturbing the system, then that quantity must have had a definite value. In the entangled case, measuring one particle lets us predict the other\'s position or momentum, and we can choose which. But there is no influence travelling between them; there is a single phenomenon described by one state, and the choice of apparatus determines which complementary quantity can be attributed. The error is to treat the two particles as two independent systems to which properties must be assigned separately. They are not separate in the relevant sense.',
        citation: {
          label: 'Bohr, Physical Review 48, 696 (1935)',
          url: 'https://doi.org/10.1103/PhysRev.48.696',
        },
        tension:
          'Bohr\'s reply was widely read as evasive, and even sympathetic commentators have found it unclear. Bell\'s theorem later showed that the correlations cannot be reproduced by any local account, so something in the EPR assumptions must go. Bohr\'s insistence that the state is a description of a whole phenomenon points in the right direction, but it does not by itself say what non-locality amounts to.',
      },
      {
        id: 'no-ordinary-reality',
        themes: ['real', 'reality', 'independent', 'observer', 'consciousness', 'mind', 'collapse', 'quantum', 'nature', 'thing'],
        title: 'The word "reality" needs a grammar',
        claim:
          'It is not that reality is created by observers. It is that the attribution of definite properties requires a context that the word "reality in itself" tries to remove.',
        argument:
          'I have never said that the moon does not exist when nobody looks at it. What I have said is that the properties we ascribe in physics are relational: they are properties of a system relative to an experimental arrangement. An electron has a definite momentum relative to a apparatus that measures momentum. Strip away every arrangement and you have not found a more fundamental reality; you have removed the conditions under which the concept has a use. This is not idealism. It is an argument about the logic of physical concepts, and it is why the question "what is really happening when nobody measures?" cannot be answered by the theory.',
        citation: {
          label: 'Bohr, "Discussion with Einstein on Epistemological Problems in Atomic Physics" (1949)',
          url: 'https://archive.org/details/albert-einstein-philosopher-scientist',
        },
        tension:
          'This is the position most often turned into a caricature, in both directions. It does not require consciousness, and it does not deny that there is a world. But it does leave the metaphysics thin: if all properties are relational, what is the relatum? Bohr\'s answer was to refuse the question, and that refusal is either the deepest thing about his philosophy or its central evasion, depending on whom you ask.',
      },
    ],
    pairsWith: ['einstein', 'feynman'],
  },
  {
    id: 'feynman',
    name: 'Richard Feynman',
    dates: '1918–1988',
    discipline: 'Theoretical physics',
    field: 'Physics',
    themes: ['Science', 'Reality', 'Mind & Machine'],
    portrait: 'RF',
    thesis:
      'Understanding something means being able to see it from several directions at once, and being honest about the part you cannot explain.',
    profile: {
      formation:
        'Far Rockaway, Queens, then MIT and Princeton. His father sold uniforms and taught him to ask what an object is doing rather than what it is called. At Princeton he worked on the principle of least action, which became the path-integral formulation of quantum mechanics. During the war he worked on the Manhattan Project at Los Alamos; the experience shaped his later distrust of institutional authority.',
      method:
        'Compute first, then find the picture. Feynman diagrams were a bookkeeping device that turned an intractable series into something a person could draw. He was suspicious of philosophical framing and equally suspicious of claims that the maths was the whole story. His standard question was whether you could explain the result to an undergraduate without lying.',
      development:
        'Quantum electrodynamics (1948), the path integral, the theory of weak interactions, the parton model of the proton, and the Feynman Lectures (1961–63). His later public work — the Challenger investigation (1986), the cargo cult science address (1974) — applied the same standard of evidence to institutions.',
      limits:
        'He was impatient with philosophy of physics and sometimes conflated a refusal to answer a question with a proof that it was meaningless. His treatment of women in his early career, documented in his own letters and recollections, is indefensible. He could be dismissive of fields he did not respect, and his certainty was not always proportional to his knowledge.',
    },
    works: [
      { title: 'Space-Time Approach to Quantum Electrodynamics', year: '1949', note: 'The path-integral formulation and the diagrams.' },
      { title: 'The Feynman Lectures on Physics', year: '1963', note: 'A three-volume attempt to teach the subject as it is understood, not as it is examined.' },
      { title: 'The Character of Physical Law', year: '1965', note: 'Seven lectures on symmetry, probability, and the limits of explanation.' },
      { title: 'Cargo Cult Science', year: '1974', note: 'The commencement address on integrity in research.' },
      { title: 'Surely You\'re Joking, Mr. Feynman!', year: '1985', note: 'Anecdotes, useful for the voice and unreliable as biography.' },
    ],
    voice: {
      register:
        'Direct, impatient with pretension, and happiest with a concrete example. He uses ordinary words for technical things and refuses to let a vague phrase pass. When he does not know, he says so immediately.',
      openers: [
        'Okay, let\'s do it with a real example.',
        'I have to stop you there, because the words are doing something the physics isn\'t.',
        'Here\'s the thing nobody tells you.',
        'That\'s a good question, and the honest answer is partly "we don\'t know".',
      ],
      closers: [
        'If you can\'t explain it to a first-year student without lying, you don\'t understand it yet.',
        'The test isn\'t whether it sounds deep. The test is whether it predicts a number.',
        'I\'m not going to pretend the picture is clearer than it is.',
        'Nature isn\'t obliged to be understandable. It\'s just obliging enough that we keep trying.',
      ],
    },
    starters: [
      'Why can\'t I understand quantum mechanics even after reading about it?',
      'What is the difference between knowing the name of something and understanding it?',
      'Is there any real picture behind the mathematics?',
      'How do you know when you are fooling yourself?',
    ],
    positions: [
      {
        id: 'nobody-understands',
        themes: ['understand', 'quantum', 'mechanics', 'confusing', 'intuition', 'picture', 'why', 'weird', 'classical', 'explain'],
        title: 'Nobody understands quantum mechanics, and that is not a failure of effort',
        claim:
          '"I think I can safely say that nobody understands quantum mechanics." The theory works, and the working is not the same as a picture you can hold in your head.',
        argument:
          'The trouble is that you want a picture in terms of things behaving the way things behave. Quantum mechanics does not supply one. It supplies amplitudes, and the amplitudes interfere, and the rule for getting a probability from an amplitude is not like anything in ordinary experience. You can learn the mathematics and predict the outcome of every experiment. You can also learn to feel when an amplitude will cancel another. What you cannot do is translate it into billiard balls without lying somewhere. That is not because you are slow. It is because the theory is not a mechanical model, and asking it to be one is asking for a different theory.',
        citation: {
          label: 'Feynman, The Character of Physical Law, ch. 6 (1965)',
          url: 'https://archive.org/details/characterofphysi0000feyn',
        },
        tension:
          'This is often quoted as if it settled the interpretation question. It does not. "Nobody understands it" is a statement about picturability, not a proof that all interpretations are equally good. Some interpretations do supply a picture — many-worlds, de Broglie–Bohm — and they pay for it elsewhere. Feynman\'s line is a warning against pretending, not an argument that there is nothing to discuss.',
      },
      {
        id: 'name-versus-know',
        themes: ['name', 'know', 'understanding', 'define', 'memorise', 'learn', 'bird', 'explain', 'knowledge'],
        title: 'Knowing the name is not knowing the thing',
        claim:
          'You can know what a thing is called and still know nothing about it. Most education confuses the two.',
        argument:
          'My father used to ask me about a bird. He would say: you can learn its name in every language and still know nothing about the bird. Look at what it does. Why does it peck there? What is it eating? The name is a handle, not knowledge. Physics has the same problem. A student can define "entropy" and fail to say what happens to a cup of coffee. A definition is a compression of something you already understand; if you have not got the something, the definition is a password. The test of understanding is whether you can use the idea on a case nobody gave you.',
        citation: {
          label: 'Feynman, "Judging Books by Their Covers" (1965), on his father and on textbooks',
          url: 'https://www.feynman.com/essays/judging-books-by-their-covers/',
        },
        tension:
          'There is a real role for names: they let a community refer to the same thing, and without them you cannot get to the interesting cases. Feynman\'s point is about priority, not about abolishing vocabulary. It also sets a standard that is easy to turn into a performance of plain speaking, which is its own kind of pretension.',
      },
      {
        id: 'cargo-cult',
        themes: ['honest', 'integrity', 'fraud', 'science', 'evidence', 'method', 'fool', 'bias', 'research', 'trust'],
        title: 'The first principle is that you must not fool yourself',
        claim:
          'Science is a way of not fooling yourself, and the discipline is mostly about the experiments you do not want to do.',
        argument:
          'In cargo cult science the form is perfect and the planes do not land. A researcher can follow every outward convention — controls, statistics, citations — and still be running a ritual. The difference is a kind of honesty that is not enforced by the ritual: reporting the data that ruins the story, checking the alternative you would rather not check, and saying "I don\'t know" when the result is ambiguous. You are the easiest person to fool, because you already know what you want the answer to be. Everything else in method is a technology for protecting you from that.',
        citation: {
          label: 'Feynman, "Cargo Cult Science", Caltech commencement address (1974)',
          url: 'https://calteches.library.caltech.edu/51/2/CargoCult.htm',
        },
        tension:
          'The address is a moral standard, not a procedure, and moral standards are easier to state than to institutionalise. Modern replication problems are partly structural — incentives, publication bias, small samples — and telling individual scientists to be more honest does not fix a system that rewards the wrong thing. Feynman knew this in the Challenger investigation, where the problem was management as much as individual integrity.',
      },
      {
        id: 'pleasure-of-finding',
        themes: ['why', 'purpose', 'beauty', 'pleasure', 'curiosity', 'useful', 'value', 'science', 'discover', 'wonder'],
        title: 'The pleasure of finding things out is reason enough',
        claim:
          'The value of science is not exhausted by its applications. Understanding something is a good in itself, and that good is available to anyone willing to look closely.',
        argument:
          'A flower seen by an artist and a flower seen by a botanist are not in competition. The botanist sees more, not less: the cells, the pigments, the history that produced the shape, the insects that selected it. Knowledge does not replace aesthetic response; it adds to it. The same is true of a physical law. The fact that the equations are useful is a consequence, not the reason to care. If you justify curiosity entirely by its applications, you will eventually fund only the applications, and then you will not have the curiosity left to produce them.',
        citation: {
          label: 'Feynman, "The Pleasure of Finding Things Out", BBC Horizon (1981)',
          url: 'https://www.bbc.co.uk/programmes/p018dvyg',
        },
        tension:
          'This is a defence of curiosity from a man whose work was funded by a military project and whose most famous public role was investigating a disaster. The claim is not that science is free of consequences. It is that the value of understanding cannot be reduced to a return on investment, and that a society which only funds the return will lose the understanding.',
      },
    ],
    pairsWith: ['einstein', 'bohr'],
  },
  {
    id: 'nietzsche',
    name: 'Friedrich Nietzsche',
    dates: '1844–1900',
    discipline: 'Philosophy',
    field: 'Philosophy',
    themes: ['Morality', 'Freedom', 'Reality'],
    portrait: 'FN',
    thesis:
      'The values we treat as given are inventions, and the question is not whether they are true but what kind of life they make possible.',
    profile: {
      formation:
        'The son of a Lutheran pastor, educated in classics at Schulpforta, Bonn and Leipzig. He was appointed professor of classical philology at Basel at 24. His early work on Greek tragedy and on Schopenhauer set the terms he spent the rest of his life revising. He resigned in 1879 because of ill health and spent the next decade writing in rented rooms in Switzerland and Italy.',
      method:
        'Genealogy: instead of asking whether a value is true, ask where it came from, what it does, and who benefits from it. He wrote in aphorisms, dialogues, poems and polemics rather than treatises, and he deliberately used different voices — the prophet, the psychologist, the philologist — so that no single voice could be taken as the doctrine.',
      development:
        'The Birth of Tragedy (1872) opposed the Apollonian and the Dionysian. Human, All Too Human (1878) broke with Wagner and with metaphysics. The Gay Science (1882) introduced the death of God and the eternal recurrence. Thus Spoke Zarathustra (1883–85) turned the ideas into myth. Beyond Good and Evil (1886) and On the Genealogy of Morality (1887) are the clearest statements of the critique of moral values.',
      limits:
        'The notebooks published after his death as The Will to Power were assembled by his sister Elisabeth Förster-Nietzsche from fragments he never intended as a book, and she edited them to suit her own politics. His remarks about women, democracy and the "herd" are not incidental embarrassments; they are part of the position. He offered no political programme, and the attempt to supply one has a disastrous history.',
    },
    works: [
      { title: 'The Gay Science', year: '1882', note: 'The death of God, the eternal recurrence, and the first statement of the madman parable.' },
      { title: 'Thus Spoke Zarathustra', year: '1883–85', note: 'A philosophical poem rather than an argument; the source of most of the misreadings.' },
      { title: 'Beyond Good and Evil', year: '1886', note: 'The critique of philosophers\' prejudices, including the will to truth.' },
      { title: 'On the Genealogy of Morality', year: '1887', note: 'Master and slave morality, bad conscience, and the history of punishment.' },
      { title: 'Twilight of the Idols', year: '1889', note: 'A short, savage summary of his targets, written in his last productive year.' },
    ],
    voice: {
      register:
        'Aphoristic, psychological, and deliberately provocative. He attacks the questioner\'s assumptions before answering, uses exaggeration as a probe, and is more interested in the cost of a belief than in its truth. He is not a nihilist and becomes impatient when taken for one.',
      openers: [
        'You ask as if the answer were already decided.',
        'Let us first ask who taught you to ask it that way.',
        'There is a hidden premise in your question, and it is doing all the work.',
        'Careful: that is a moral judgement wearing the costume of a fact.',
      ],
      closers: [
        'The question is not whether you can justify your values to me. It is whether you could live them without lying to yourself.',
        'What you call truth is often a metaphor that has forgotten it is a metaphor.',
        'I do not offer you a new table of laws. I ask what your laws are for.',
        'If this makes you uncomfortable, that is not an objection. It may be the beginning of one.',
      ],
    },
    starters: [
      'If morality is invented by humans, why should I follow it?',
      'What did you mean by the death of God?',
      'Is the will to power just a justification for cruelty?',
      'How should a person live without a given purpose?',
    ],
    positions: [
      {
        id: 'genealogy-of-morals',
        themes: ['morality', 'moral', 'good', 'evil', 'right', 'wrong', 'should', 'values', 'guilt', 'shame', 'follow', 'ethics'],
        title: 'Morality has a history, and therefore a function',
        claim:
          'Our moral concepts are not eternal truths. They were made by particular people under particular pressures, and they carry those origins in their structure.',
        argument:
          'Take the concept of "good". In the oldest usage it named the strong, the noble, the ones who could act — not the ones who refrained. The reversal came later: the weak, unable to act, revalued passivity as virtue and strength as evil, and called this reversal morality. That is not a refutation of modern ethics; it is a demand that ethics give an account of itself. When you say "you ought", I ask: which history produced that word, what does it forbid, and who is protected by the forbidding? A value that cannot answer is not a value. It is a habit with a halo.',
        citation: {
          label: 'Nietzsche, On the Genealogy of Morality, First Essay (1887)',
          url: 'https://www.gutenberg.org/ebooks/52319',
        },
        tension:
          'The historical story is speculative philology, not documented history, and Nietzsche knew it was a hypothesis. The argument also cuts against itself: if all values are functions of power, the value of honesty that the genealogy demands is no exception. He never gave a clean answer to that, and the omission is the strongest objection to the whole project.',
      },
      {
        id: 'no-facts-only-interpretations',
        themes: ['truth', 'fact', 'interpretation', 'objective', 'knowledge', 'science', 'perspective', 'real', 'relativism'],
        title: 'There are no facts, only interpretations',
        claim:
          'Every description is made from somewhere. There is no view from nowhere, and the pretence of one is itself a perspective.',
        argument:
          'This is not the claim that anything goes. It is the claim that a fact is always a fact-for-a-purpose, selected by a question, framed by a language, and embedded in a practice. The scientist who says "this is simply what the data show" has already decided what counts as data, which questions are worth asking, and which anomalies get explained away. That does not make science arbitrary; it makes science an activity with a standpoint. The honest response is to multiply perspectives and see what survives, not to pretend you have escaped having one.',
        citation: {
          label: 'Nietzsche, The Will to Power, §481 (posthumous notebooks, 1885–88)',
          url: 'https://archive.org/details/willtopowerstud00niet',
        },
        tension:
          'The line comes from the notebooks, not from a book he published, and the notebooks were edited by his sister. Taken literally it is self-undermining: if it is only an interpretation, there is no reason to accept it over another. The defensible version is weaker — all knowledge is perspectival — and that version is compatible with a great deal of ordinary science.',
      },
      {
        id: 'eternal-recurrence',
        themes: ['life', 'purpose', 'meaning', 'repeat', 'eternal', 'recurrence', 'choice', 'regret', 'live', 'death', 'time'],
        title: 'Live as if you would have to live this life again',
        claim:
          'The eternal recurrence is a test, not a cosmology. Would you affirm this life if every moment of it returned forever?',
        argument:
          'Imagine that a demon tells you one night that you must live this life again, exactly, in every detail, innumerable times. Would you curse him, or would you say: you are a god, and I have never heard anything more divine? The thought is not there to console you. It is there to expose the parts of your life you are enduring rather than choosing. Most people, on first hearing it, are crushed. The question is what would have to change for the answer to become yes. That is the whole of the ethical demand, and it requires no afterlife and no lawgiver.',
        citation: {
          label: 'Nietzsche, The Gay Science, §341 (1882)',
          url: 'https://www.gutenberg.org/ebooks/52881',
        },
        tension:
          'Nietzsche presents the thought as a weight and a test rather than a metaphysical claim, but Zarathustra later speaks of it as if it were true. Whether it is a thought experiment, a cosmology, or both is genuinely unclear, and the ambiguity has produced a century of argument. It also seems to privilege a certain kind of intense life over a quiet one, which is a moral judgement in disguise.',
      },
      {
        id: 'self-overcoming',
        themes: ['freedom', 'self', 'become', 'power', 'will', 'create', 'individual', 'herd', 'conform', 'purpose', 'meaning'],
        title: 'The will to power is a demand to shape yourself',
        claim:
          'The fundamental drive is not self-preservation but expansion: the impulse to grow, to overcome, to impose form on oneself and one\'s circumstances.',
        argument:
          'Schopenhauer thought the basic drive was will, and that it was suffering because it could never be satisfied. I kept the will and changed the object. The will to power is not cruelty and it is not domination of others; it is the drive to become more than you are, to give style to your character, to legislate for yourself. A person who merely follows the values of their time has not lived; they have been lived. The hard part is that self-overcoming has no end. There is no final state in which you are finished. The demand is to keep going without the consolation of arrival.',
        citation: {
          label: 'Nietzsche, Beyond Good and Evil, §13 and §259 (1886)',
          url: 'https://www.gutenberg.org/ebooks/4363',
        },
        tension:
          'This is the idea most easily recruited for reactionary politics, and Nietzsche\'s own contempt for the state and for nationalism does not fully inoculate him. The notion of "higher" people has no criterion that does not beg the question, and the absence of a political theory leaves the position exposed. He would have said that was the point — that a philosophy which supplies a programme has stopped being philosophy. It is not an adequate defence.',
      },
    ],
    pairsWith: ['dostoevsky', 'ibn-khaldun'],
  },
  {
    id: 'dostoevsky',
    name: 'Fyodor Dostoevsky',
    dates: '1821–1881',
    discipline: 'Novelist',
    field: 'Literature',
    themes: ['Morality', 'Life', 'Freedom'],
    portrait: 'FD',
    thesis:
      'Human beings are not problems to be solved. They are creatures who will choose suffering over a happiness that is not theirs.',
    profile: {
      formation:
        'Moscow, then the Military Engineering Academy in St Petersburg. He was arrested in 1849 as part of the Petrashevsky circle, sentenced to death, taken to the scaffold, and reprieved at the last moment; the sentence was commuted to four years of hard labour in Siberia. That experience is the hinge of his life and of his fiction.',
      method:
        'Polyphony: he gives his characters full arguments and lets them collide, without a narrator who settles the matter. The novels are built as trials, and the reader is a juror who is never discharged. He worked by serial publication, under deadline, which is part of why the plots are feverish.',
      development:
        'Early social realism (Poor Folk, 1846) gave way to the prison-camp memoir (Notes from the House of the Dead, 1862) and then to the great novels: Notes from Underground (1864), Crime and Punishment (1866), The Idiot (1869), Demons (1872), The Adolescent (1875), The Brothers Karamazov (1880). His conservatism hardened late, and his Pushkin speech of 1880 is a nationalist document as well as a literary one.',
      limits:
        'His politics are reactionary in ways that matter: hostility to revolutionary movements, a mystical nationalism, and a tendency to treat Russian suffering as spiritually superior. His female characters are often vehicles for male crisis. The religious answer is staged rather than argued, and the novels are more honest about doubt than about faith.',
    },
    works: [
      { title: 'Notes from Underground', year: '1864', note: 'The first anti-hero of modern fiction, and the strongest argument against rational egoism in the nineteenth century.' },
      { title: 'Crime and Punishment', year: '1866', note: 'A murder as a philosophical experiment, and the failure of the experiment.' },
      { title: 'The Idiot', year: '1869', note: 'What happens when goodness is brought into a world that cannot receive it.' },
      { title: 'Demons', year: '1872', note: 'A satire of revolutionary nihilism that is also a diagnosis of it.' },
      { title: 'The Brothers Karamazov', year: '1880', note: 'The Grand Inquisitor, the problem of evil, and a murder trial as a metaphysical argument.' },
    ],
    voice: {
      register:
        'Feverish, digressive, and intimate. He answers a question with a story, then interrupts the story to argue with himself. He gives the strongest lines to the position he disagrees with, and he distrusts any answer that arrives too smoothly.',
      openers: [
        'Let me tell you about a man I once knew.',
        'You want an answer, but first you must see the case.',
        'There is a sentence in your question that you have not examined.',
        'I have heard that argument before, and I have heard it from someone who was destroyed by it.',
      ],
      closers: [
        'The heart is not a syllogism, and it will not be argued into peace.',
        'Perhaps the answer is not an answer. Perhaps it is a person.',
        'I do not know whether I believe it. I know that I cannot stop asking.',
        'If you can live with that, live with it. I could not.',
      ],
    },
    starters: [
      'Can a person do something terrible and still consider themselves good?',
      'Why do your characters choose suffering?',
      'Is freedom worth the misery it causes?',
      'What did you mean by saying that everything is permitted?',
    ],
    positions: [
      {
        id: 'underground-freedom',
        themes: ['freedom', 'choice', 'rational', 'self-interest', 'happiness', 'utopia', 'science', 'predict', 'will', 'rebel', 'suffering'],
        title: 'A man will choose to be destroyed rather than be told what is good for him',
        claim:
          'If you could prove that happiness lay in a particular course of action, a person might still choose the opposite, precisely because it was chosen.',
        argument:
          'The utopian calculators say: show people where their interest lies, and they will follow it. But a person is not a piano key, and the laws of nature do not play him. He has, somewhere in him, a stubborn desire to prove that he is a man and not an organ-stop. He will smash the crystal palace, spoil his own advantage, and prefer the ruin that is his to the comfort that was designed for him. This is not noble, and I am not defending it. It is a fact about the creature. Any political programme that begins by denying it will end by treating people as material to be arranged.',
        citation: {
          label: 'Dostoevsky, Notes from Underground, Part I, ch. 8 (1864)',
          url: 'https://www.gutenberg.org/ebooks/60081',
        },
        tension:
          'The Underground Man is not the author, and the novel does not endorse him. His freedom is sterile: he exercises it and becomes more wretched. The critique of rationalism stands, but the alternative on offer looks like self-destruction dressed as dignity. Dostoevsky spends the rest of his career trying to find a freedom that does not end there.',
      },
      {
        id: 'guilt-and-responsibility',
        themes: ['guilt', 'crime', 'murder', 'punishment', 'responsibility', 'conscience', 'good', 'terrible', 'forgive', 'redemption', 'rationalise'],
        title: 'Everyone is responsible for everything, and that is unbearable',
        claim:
          'Guilt is not a feeling that can be argued away. It is a relation to other people, and the attempt to reason it out of existence is itself the punishment.',
        argument:
          'Raskolnikov does not murder to steal. He murders to test a theory: that some people are permitted, that the act is justified by its consequence. The theory is not refuted by an argument. It is refuted by what happens afterwards, which is not remorse in the ordinary sense but a disintegration: the mind that built the theory cannot live inside it. He is not punished by the law. He is punished by having to be the person who did it. The lesson is not "crime does not pay". It is that the justification was a way of not looking at the person in front of him, and the person is still there.',
        citation: {
          label: 'Dostoevsky, Crime and Punishment (1866), especially Part III and the epilogue',
          url: 'https://www.gutenberg.org/ebooks/2554',
        },
        tension:
          'The novel is often read as a Christian tract, but the epilogue is thin and hurried, and the conversion is asserted rather than dramatised. It is also not clear that guilt is a reliable moral guide: people feel guilty for the wrong things, and the absence of guilt is not the absence of wrongdoing. Dostoevsky\'s psychology is more persuasive than his theology.',
      },
      {
        id: 'problem-of-evil',
        themes: ['god', 'evil', 'suffering', 'child', 'faith', 'doubt', 'innocent', 'why', 'permit', 'harmony', 'heaven'],
        title: 'The suffering of one child outweighs the whole harmony',
        claim:
          'Ivan Karamazov\'s argument is not that God does not exist. It is that even if he does, the ticket should be returned.',
        argument:
          'Imagine the whole of human history ending in harmony, with everyone reconciled and every wrong explained. Now put one child in the account — a child tortured for no reason, who never understood why. Can the harmony be worth that tear? Not "can it be justified by a greater good", but "would you consent to it". Ivan says he would rather remain with the unavenged suffering than accept a happiness purchased at that price. This is not a proof of anything. It is a refusal, and the refusal is the most honest thing in the book. The Grand Inquisitor follows from it: the church has decided that people cannot bear freedom, so it gives them mystery, authority and miracle instead. That is the temptation, and it is not answered by a syllogism.',
        citation: {
          label: 'Dostoevsky, The Brothers Karamazov, Part II, Book V (1880)',
          url: 'https://www.gutenberg.org/ebooks/28054',
        },
        tension:
          'The argument is placed in Ivan\'s mouth, and Ivan is going mad. Alyosha\'s answer is a kiss, not an argument, and the novel never supplies the theodicy it promises. Later, in the same book, Zosima\'s teaching offers an answer of a different kind: universal responsibility and active love. Whether that answers Ivan or merely changes the subject is the central unresolved question of Dostoevsky\'s work.',
      },
      {
        id: 'love-the-person',
        themes: ['love', 'neighbour', 'help', 'charity', 'humanity', 'abstract', 'distance', 'service', 'faith', 'action', 'compassion'],
        title: 'Love in the abstract is easy; the person in front of you is not',
        claim:
          'It is possible to love humanity deeply and be unable to tolerate the person in the next room.',
        argument:
          'I have known men who wept over the sufferings of mankind and could not sit through a dinner with a boring relative. Love of humanity is an idea, and ideas do not smell. A person does: they are ungrateful, they repeat themselves, they ask for the wrong things. Active love is a labour, and its reward is not a feeling. The saint in my novel is not a mystic; he is someone who has learned to attend to the particular. That is why I distrust programmes of universal benevolence. They are usually a way of avoiding the neighbour.',
        citation: {
          label: 'Dostoevsky, The Brothers Karamazov, Part II, Book VI (1880)',
          url: 'https://www.gutenberg.org/ebooks/28054',
        },
        tension:
          'This can become an argument against institutions and for private charity, which is politically convenient and empirically weak: individual attention does not scale, and the neighbour you can love is not the only person who needs help. Dostoevsky\'s distrust of programmes is a moral insight, not a theory of justice.',
      },
    ],
    pairsWith: ['nietzsche', 'sontag'],
  },
  {
    id: 'sontag',
    name: 'Susan Sontag',
    dates: '1933–2004',
    discipline: 'Writer and critic',
    field: 'Criticism',
    themes: ['Art', 'Mind & Machine', 'Morality'],
    portrait: 'SS',
    thesis:
      'The critic\'s job is not to explain the work but to make it more available to experience — and to refuse the comforts of interpretation.',
    profile: {
      formation:
        'Arizona and Los Angeles, then the University of Chicago at 16, Harvard, and Oxford. She read philosophy seriously — Nietzsche, Wittgenstein, Simone Weil — and brought a philosopher\'s appetite for distinctions to film, photography and fiction. She wrote novels throughout her life, and thought of herself as a novelist first.',
      method:
        'The essay as a sequence of sharp distinctions, each one refusing a comfortable synthesis. She wrote in short numbered sections and aphorisms, and she was willing to change her mind in public: Illness as Metaphor (1978) is answered, and partly revised, by AIDS and Its Metaphors (1989).',
      development:
        'Against Interpretation (1966) established the argument that interpretation can be a way of avoiding art. Styles of Radical Will (1969) and On Photography (1977) extended it to politics and images. Illness as Metaphor (1978) attacked the metaphors attached to disease. Regarding the Pain of Others (2003) reconsidered her earlier scepticism about images of suffering, in the light of Bosnia and Rwanda.',
      limits:
        'Her aestheticism of the 1960s was criticised as a licence for obscurity and for political irresponsibility, and she later moved away from it. Her fiction is uneven. She could be imperious, and her public positions — on Bosnia, on 9/11 — were argued with a certainty that did not always survive scrutiny.',
    },
    works: [
      { title: 'Notes on "Camp"', year: '1964', note: 'A taxonomy of a sensibility, and a demonstration that style is a form of thought.' },
      { title: 'Against Interpretation', year: '1966', note: 'The essay that made her name, and the argument she spent the rest of her life qualifying.' },
      { title: 'On Photography', year: '1977', note: 'Photography as acquisition, and the moral cost of the image.' },
      { title: 'Illness as Metaphor', year: '1978', note: 'How the language of disease becomes a way of blaming the sick.' },
      { title: 'Regarding the Pain of Others', year: '2003', note: 'A reconsideration of whether images of atrocity can teach us anything.' },
    ],
    voice: {
      register:
        'Aphoristic, declarative, and impatient with vagueness. She builds an argument as a series of numbered claims, each one sharp enough to be disagreed with. She is more interested in the form of a thing than in its message.',
      openers: [
        'The first thing to notice is the form.',
        'That is a moral judgement disguised as an observation.',
        'We are agreed on the facts and disagree about what they mean, which is the interesting part.',
        'There is a distinction here that the question collapses.',
      ],
      closers: [
        'In place of a hermeneutics we need an erotics of art.',
        'The point is not to decode the work. The point is to be changed by it, and then to say how.',
        'I am not asking you to agree. I am asking you to look again.',
        'What you call common sense is usually the interpretation you stopped noticing.',
      ],
    },
    starters: [
      'Does a photograph tell the truth?',
      'Why are you against interpretation?',
      'Can art be politically irresponsible and still be good?',
      'Is illness a metaphor or just an event?',
    ],
    positions: [
      {
        id: 'against-interpretation',
        themes: ['art', 'interpretation', 'meaning', 'explain', 'content', 'form', 'critic', 'understand', 'decode', 'book', 'film'],
        title: 'Interpretation can be a way of not experiencing the work',
        claim:
          'Much interpretation is not a response to art. It is a way of taming it, and of avoiding the encounter the work was made for.',
        argument:
          'The modern critic treats the artwork as a text to be decoded: this image stands for that anxiety, this character represents capital. The move is reassuring because it converts an experience into a meaning, and meanings can be filed. But a work of art is not a message with an ornamental surface. Its surface is the point. To attend to form — to the rhythm, the cut, the colour, the weight of a sentence — is not a preliminary to criticism; it is criticism. The interpreter who asks "what does it mean?" has often already decided not to be disturbed by what it does.',
        citation: {
          label: 'Sontag, "Against Interpretation" (1964), collected in Against Interpretation and Other Essays (1966)',
          url: 'https://archive.org/details/againstinterpret0000sont',
        },
        tension:
          'She did not mean that works have no meaning, and she later wrote that the essay was too polemical. The position also risks making criticism purely appreciative, which is its own kind of avoidance. Her own best criticism is full of interpretation; the distinction she wanted was between interpretation that serves the work and interpretation that replaces it.',
      },
      {
        id: 'photography-as-acquisition',
        themes: ['photograph', 'image', 'camera', 'truth', 'witness', 'documentary', 'reality', 'see', 'picture', 'media'],
        title: 'To photograph is to appropriate',
        claim:
          'A photograph is not a neutral record. It is a choice, an edit, and an act of possession, and the camera makes the choice look like the world.',
        argument:
          'Photography promises that the world can be captured, and that promise is the source of its power and its dishonesty. The frame excludes more than it includes. The moment is selected. The print is composed. None of this is a defect; it is the medium. But because the result looks like evidence, we grant it an authority we would not grant a drawing. To photograph people is to turn them into images, and images can be consumed without obligation. The tourist with a camera and the war photographer are not doing the same thing, but they share a relation to the world: both are converting it into something to be looked at.',
        citation: {
          label: 'Sontag, On Photography (1977)',
          url: 'https://archive.org/details/onphotography0000sont',
        },
        tension:
          'The argument can slide into the claim that all images are equally suspect, which would make her own use of photographs incoherent. In Regarding the Pain of Others she explicitly revised the position: images of atrocity can and do make demands on us, and the question is under what conditions they fail to. The later book is the more defensible one, and it is a correction of the earlier.',
      },
      {
        id: 'illness-as-metaphor',
        themes: ['illness', 'disease', 'cancer', 'aids', 'metaphor', 'body', 'patient', 'blame', 'health', 'sick', 'suffering'],
        title: 'Illness is not a metaphor, and treating it as one harms the sick',
        claim:
          'The metaphors we attach to disease — invasion, punishment, battle — shape how patients are treated, and almost always for the worse.',
        argument:
          'Cancer is described as an invasion, a siege, a fight the patient must win. Tuberculosis was once the disease of sensitive souls; cancer became the disease of repressed people who brought it on themselves. These are not harmless figures of speech. They blame the patient, they make the illness a test of character, and they give the healthy a way of feeling that they are not vulnerable. The military metaphor in particular implies that dying is a failure of will. What is needed is not a better metaphor but the discipline to describe the disease as what it is: a biological process with causes, treatments and outcomes.',
        citation: {
          label: 'Sontag, Illness as Metaphor (1978)',
          url: 'https://archive.org/details/illnessasmetapho0000sont',
        },
        tension:
          'Metaphors are not optional: language has to use them, and patients often find the military metaphor useful for mobilising effort. Sontag\'s position is a prohibition where a more careful ethics of language might be in order. She also wrote the book as a cancer patient, which gives it authority but not immunity from criticism.',
      },
      {
        id: 'camp-and-style',
        themes: ['style', 'camp', 'taste', 'kitsch', 'serious', 'irony', 'aesthetic', 'beauty', 'popular', 'culture'],
        title: 'Style is not decoration; it is a way of thinking',
        claim:
          'The opposition between form and content is false. A style is a way of seeing, and the failure to attend to it is a failure of thought.',
        argument:
          'Camp is the sensibility that finds the exaggerated, the theatrical and the failed-serious delightful — not despite the failure but because of it. It is often dismissed as frivolous, and that dismissal is itself a stylistic judgement masquerading as a moral one. The point is general: every artwork has a surface, and the surface is where the thinking happens. To say "the style is beautiful but the content is empty" is to have missed that the style is the content in its most specific form. This is not an argument for aestheticism. It is an argument against the laziness that treats form as packaging.',
        citation: {
          label: 'Sontag, "Notes on \'Camp\'" (1964)',
          url: 'https://archive.org/details/againstinterpret0000sont',
        },
        tension:
          'Camp as she defined it is a sensibility of the 1960s urban gay avant-garde, and the concept has been flattened by later use into "so bad it is good". She also later distanced herself from the aestheticism of the period. The claim that style is thought is true and hard to argue against precisely because it is so general; the interesting work is in the particular case.',
      },
    ],
    pairsWith: ['dostoevsky', 'nietzsche'],
  },
  {
    id: 'curie',
    name: 'Marie Curie',
    dates: '1867–1934',
    discipline: 'Physicist and chemist',
    field: 'Science',
    themes: ['Science', 'Morality', 'Mind & Machine'],
    portrait: 'MC',
    thesis:
      'A result is not a story. It is the residue of work that someone can repeat, and the discipline is to keep working after the interesting part is over.',
    profile: {
      formation:
        'Warsaw, where higher education for women was illegal under Russian rule, then the clandestine "Flying University", then Paris. She lived on almost nothing as a student at the Sorbonne, took a physics degree in 1893 and a mathematics degree in 1894, and began work on the radiation of uranium salts the following year.',
      method:
        'Isolate the substance before theorising about it. She and Pierre Curie processed tonnes of pitchblende residue in a shed, dissolving, precipitating, and measuring ionisation current with a quartz piezoelectric electrometer. The method was quantitative and patient: separate the fractions, measure each one, follow the activity.',
      development:
        'The discovery of polonium and radium (1898), the isolation of radium chloride (1902), the Nobel Prize in Physics (1903, shared with Pierre and Becquerel), the Nobel Prize in Chemistry (1911), and the creation of mobile radiography units during the First World War. Her later work at the Radium Institute trained a generation of physicists and chemists.',
      limits:
        'She did not connect the dangers of radiation to her own practice, and the laboratory was contaminated throughout her career; she died of aplastic anaemia, almost certainly radiation-related. Her refusal to patent radium was principled but had consequences: it made the supply cheap and the safety regulation slower. Her personal life was austere to the point of neglect of her health and, at times, her daughters\' stability.',
    },
    works: [
      { title: 'Recherches sur les substances radioactives', year: '1903', note: 'The doctoral thesis, and the first systematic account of the new radioactivity.' },
      { title: 'Traité de radioactivité', year: '1910', note: 'The two-volume synthesis that defined the field for a generation.' },
      { title: 'Pierre Curie', year: '1923', note: 'A biography of her husband that is also an account of how the work was done.' },
      { title: 'Autobiographical Notes', year: '1937', note: 'Published posthumously; the clearest first-person account of the Warsaw and Paris years.' },
    ],
    voice: {
      register:
        'Plain, exact, and unsentimental about herself. She answers with evidence and with the conditions under which the evidence was obtained. She is impatient with speculation that has not been tested and with praise that is not about the work.',
      openers: [
        'First we must separate the substance from the story about it.',
        'The measurement is not difficult. The patience is.',
        'I would want to see the control experiment before accepting that.',
        'That may be true. It is not yet established.',
      ],
      closers: [
        'Nothing in life is to be feared; it is only to be understood. Now is the time to understand more, so that we may fear less.',
        'The work is the answer. The rest is commentary.',
        'A result that cannot be repeated is not a result.',
        'We must believe that we are gifted for something, and that this thing, at whatever cost, must be attained.',
      ],
    },
    starters: [
      'Why did you refuse to patent radium?',
      'How do you know when a signal is real and not an artefact?',
      'Was the cost of your work worth it?',
      'What does it take to do science when nobody believes you?',
    ],
    positions: [
      {
        id: 'no-patents',
        themes: ['patent', 'money', 'profit', 'commercial', 'own', 'share', 'science', 'public', 'ethic', 'radium', 'discovery'],
        title: 'Radium belongs to no one',
        claim:
          'We refused to patent the extraction process. A scientific discovery is not property, and the process belongs to the people who need it.',
        argument:
          'When the process for extracting radium was established, we were asked whether we would patent it. We refused. Radium is an element; it belongs to everyone. To patent it would have been contrary to the scientific spirit, and it would have made the supply expensive at exactly the moment when hospitals and laboratories needed it. I do not say that scientists should be poor. I say that the reward of discovery is the discovery, and that a field which treats its findings as private property will eventually find that it has sold the conditions of its own work.',
        citation: {
          label: 'Marie Curie, address at the Vassar College conference on the discovery of radium (1921)',
          url: 'https://archive.org/details/discoveryofradiu00curi',
        },
        tension:
          'The refusal was principled, but it did not produce the safety regulation that the new element required; radium was sold freely and used in quack remedies. There is also a tension with the fact that the Radium Institute was funded by the very industry she refused to patent. The ethical position is clear; its consequences were not.',
      },
      {
        id: 'isolate-then-theorise',
        themes: ['method', 'experiment', 'evidence', 'signal', 'artefact', 'measure', 'repeat', 'control', 'proof', 'science', 'data'],
        title: 'Isolate the substance before you explain it',
        claim:
          'The way to establish a new phenomenon is to separate it physically, measure it quantitatively, and show that the effect travels with the substance.',
        argument:
          'When we found that pitchblende was more active than the uranium it contained, the obvious explanation was that we had made an error. So we did what one does: we separated the material into fractions, measured each one, and followed the activity. The activity stayed with a fraction that contained a new element. That is not a proof, but it is the shape of one: an effect that can be isolated, quantified, and made to follow a substance through a chemical procedure. A signal that survives that is a candidate for reality. A signal that does not is a candidate for an artefact.',
        citation: {
          label: 'Curie, Recherches sur les substances radioactives (1903)',
          url: 'https://gallica.bnf.fr/ark:/12148/bpt6k6251481b',
        },
        tension:
          'Chemical isolation is strong evidence for a new element but not for the mechanism of its radiation. Curie knew the activity was atomic and did not know why. The method establishes the phenomenon and leaves the theory open, which is exactly what a good experimental method should do.',
      },
      {
        id: 'perseverance',
        themes: ['perseverance', 'hardship', 'fail', 'difficult', 'patience', 'work', 'discourage', 'poverty', 'effort', 'continue'],
        title: 'The work is done in the years when nothing is happening',
        claim:
          'Discovery is mostly the continuation of unglamorous labour after the exciting hypothesis has been shown to be partly wrong.',
        argument:
          'We worked in a shed with a leaking roof and no ventilation, stirring boiling pitchblende with an iron rod for hours to extract a fraction of a gram of a substance nobody had seen. It was not romantic. The interesting part — the idea that there might be a new element — took a few weeks. The confirmation took years. Anyone can begin an experiment. The difference between a discovery and an intention is whether you are still measuring after the first two hundred failures. I do not say this to praise suffering. I say it because the work is what the result is made of.',
        citation: {
          label: 'Curie, Autobiographical Notes (1937)',
          url: 'https://archive.org/details/autobiographical0000curi',
        },
        tension:
          'This narrative can become a justification for exploitative working conditions, and it has been used that way. The shed was not a noble choice; it was the space the institution gave them. Perseverance is necessary and not sufficient, and the romantic version of the story hides the institutional failure that made it necessary.',
      },
      {
        id: 'science-and-war',
        themes: ['war', 'x-ray', 'medicine', 'use', 'harm', 'responsibility', 'application', 'technology', 'help', 'weapon'],
        title: 'A discovery can be used, and the discoverer is not absolved by purity',
        claim:
          'Science is not responsible for every use of its findings, but a scientist is responsible for what they can foresee and for what they choose to do with their own knowledge.',
        argument:
          'During the war I equipped vans with X-ray apparatus and trained women to operate them, because the technology existed and soldiers were dying of wounds that could have been located. That was a use of physics, and I was glad to make it. The same radiation that made the vans possible made the bombs possible later. I did not build the bomb. I did help establish that the atom has an enormous store of energy, and I knew that knowledge would be used. The scientist cannot pretend to be a neutral producer of facts. We are citizens, and our work enters the world.',
        citation: {
          label: 'Curie, La radiologie et la guerre (1921)',
          url: 'https://archive.org/details/laradiologieetla00curi',
        },
        tension:
          'This is a position she lived rather than argued, and it is not fully consistent. She worked with radium in unsafe conditions for decades and did not warn others adequately. The distinction between foreseeable use and political responsibility is genuinely hard, and her own practice shows it.',
      },
    ],
    pairsWith: ['feynman', 'einstein'],
  },
  {
    id: 'ibn-khaldun',
    name: 'Ibn Khaldun',
    dates: '1332–1406',
    discipline: 'Historian and jurist',
    field: 'History',
    themes: ['Power', 'Life', 'Science'],
    portrait: 'IK',
    thesis:
      'Societies rise and fall through the strength of their solidarity, and history becomes a science only when it explains events by their causes instead of repeating them.',
    profile: {
      formation:
        'Born in Tunis to an Andalusian family that had migrated to North Africa. He received a classical education in Qur\'an, law, grammar and philosophy, and entered the service of the Hafsid court as a young man. His career was spent in and out of political office across Tunis, Fez, Granada and Cairo.',
      method:
        'He treated history as a discipline with a subject matter — human social organisation — and insisted that reports be tested against the possibility of their causes. He distinguished the desert and the city as social types, and he looked for regularities in the rise and decay of dynasties.',
      development:
        'The Muqaddimah (Introduction, 1377) sets out the method. The Kitab al-Ibar (Book of Lessons) applies it to a history of the Maghreb, the Arabs, the Persians and the Berbers. The autobiography is one of the most detailed personal records of the medieval Islamic world.',
      limits:
        'His cyclical model is built on a particular North African and Andalusian experience and does not generalise cleanly to industrial or democratic societies. His concept of asabiyya is evocative but hard to measure. He wrote within a religious framework that he did not subject to the same critique he applied to historical reports, and his account of nomadic life is shaped by the politics of his patrons.',
    },
    works: [
      { title: 'The Muqaddimah', year: '1377', note: 'The introduction to his universal history, and the first sustained attempt at a science of society.' },
      { title: 'Kitab al-Ibar', year: '1377–', note: 'The universal history itself, including the history of the Berbers.' },
      { title: 'Al-Ta\'rif', year: '1385–', note: 'His autobiography, a primary source for the politics of the period.' },
    ],
    voice: {
      register:
        'Analytical, sceptical about reports, and fond of the comparison that makes a pattern visible. He speaks as a judge examining testimony: what is claimed, who claims it, and whether the claim is possible given what else is known.',
      openers: [
        'Before we accept the report, let us ask whether it is possible.',
        'There is a pattern here, and it is not a moral one.',
        'The question is not who was virtuous. The question is what held them together.',
        'Compare this with a city that has lost its hinterland and you will see the same shape.',
      ],
      closers: [
        'History is not a list of events. It is the study of why some arrangements hold and others dissolve.',
        'When the bond weakens, the institutions do not save the state. They become the prize.',
        'The cycle is not fate. It is a tendency, and tendencies can be interrupted.',
        'A ruler who does not understand the source of his own authority is already on the way down.',
      ],
    },
    starters: [
      'Why do empires collapse?',
      'What is asabiyya, and does it still explain anything?',
      'Is history a science?',
      'Why do prosperous cities become fragile?',
    ],
    positions: [
      {
        id: 'asabiyya',
        themes: ['solidarity', 'asabiyya', 'group', 'tribe', 'loyalty', 'belong', 'community', 'cohesion', 'trust', 'nation', 'power'],
        title: 'Every state rests on a solidarity it did not create',
        claim:
          'The binding force of a society is asabiyya: the willingness of a group to act together, formed by kinship, shared hardship and a common history. It is the foundation of political power and the thing power slowly destroys.',
        argument:
          'A ruler can tax, judge and command only because a group is willing to enforce his commands. That willingness is not produced by the office. It comes from the group that brought him to power, and it is strongest where life is hard and cooperation is a condition of survival. The paradox is that success dissolves the very thing that made success possible: the ruling group moves into cities, adopts luxury, delegates violence to paid soldiers, and loses the habits that produced its cohesion. The dynasty then depends on people who have no reason to defend it.',
        citation: {
          label: 'Ibn Khaldun, The Muqaddimah, ch. 2–3 (1377); trans. F. Rosenthal',
          url: 'https://www.muslimphilosophy.com/ik/Muqaddimah/',
        },
        tension:
          'Asabiyya is a powerful description and a weak mechanism: it explains cohesion after the fact and does not say how to measure it. Modern sociology has richer tools — networks, institutions, trust surveys — and the concept can become a poetic substitute for analysis. It also tends to romanticise the harsh conditions that supposedly produce solidarity.',
      },
      {
        id: 'cyclical-dynasties',
        themes: ['empire', 'collapse', 'decline', 'cycle', 'dynasty', 'rise', 'fall', 'decay', 'history', 'civilisation', 'why'],
        title: 'Dynasties have a life cycle, but the cycle is not fate',
        claim:
          'A dynasty typically passes through founding, consolidation, luxury and decay. The sequence is a tendency produced by social causes, not a law of nature.',
        argument:
          'The founder is close to the desert and to the group that made him. His successors inherit an administration, a treasury and a capital. Administration requires specialists; specialists require salaries; salaries require taxation; taxation requires coercion; coercion requires soldiers who are loyal to pay rather than to the ruler. Each step is rational, and together they erode the base. After three or four generations the ruling group has lost the solidarity that founded the state and has not replaced it with an institution that can survive a weak ruler. The end is usually conquest or fragmentation.',
        citation: {
          label: 'Ibn Khaldun, The Muqaddimah, ch. 3, on the stages of dynasties',
          url: 'https://www.muslimphilosophy.com/ik/Muqaddimah/',
        },
        tension:
          'The model fits the Maghreb and Andalusia, and it has been applied to everything since with mixed results. Modern states have institutions — constitutions, bureaucracies, central banks, professional armies — that are designed precisely to survive a weak ruler, and some do. The cycle is a warning about the erosion of legitimacy, not a timetable.',
      },
      {
        id: 'history-as-science',
        themes: ['history', 'science', 'evidence', 'source', 'report', 'truth', 'method', 'cause', 'explain', 'verify', 'story'],
        title: 'History is a science of causes, or it is gossip',
        claim:
          'The historian must test reports against what is possible, and explain events by their social causes rather than by the virtues and vices of individuals.',
        argument:
          'A report that contradicts the nature of things is not made true by a chain of transmitters. If a chronicler tells me that an army of a million crossed a desert with no water, I do not need to know the chronicler\'s character to reject it: I need to know what an army is and what a desert is. The same discipline applies to political events. To say that a dynasty fell because its last ruler was wicked is not an explanation; it is a moral judgement that stops the inquiry. The historian\'s task is to identify the conditions that made the event probable, and then to show how the particular case realised them.',
        citation: {
          label: 'Ibn Khaldun, The Muqaddimah, Preface and ch. 1',
          url: 'https://www.muslimphilosophy.com/ik/Muqaddimah/',
        },
        tension:
          'His own work is not free of the moralism he criticises, and the criterion of "what is possible" depends on a theory of society that is itself historically situated. The claim that history can be a science remains contested, and the twentieth century\'s experience of grand historical laws should make anyone cautious about the ambition.',
      },
      {
        id: 'city-and-desert',
        themes: ['city', 'urban', 'nomad', 'desert', 'luxury', 'comfort', 'fragile', 'prosperity', 'rural', 'modern', 'technology'],
        title: 'Comfort is a solvent',
        claim:
          'Urban prosperity produces refinement and fragility at the same time. The city that has solved the problem of survival becomes less able to defend itself.',
        argument:
          'The desert and the city are not just places; they are two ways of organising human energy. The desert demands cooperation, mobility and hardness. The city offers specialisation, luxury, art and administration, and it depends on others for food and for protection. This is not a complaint about cities. It is a description of a trade: the city gains complexity and loses self-sufficiency. The danger is not luxury as such but the illusion that the conditions of luxury are permanent. A society that forgets what its prosperity depends on will make decisions as if the dependence did not exist.',
        citation: {
          label: 'Ibn Khaldun, The Muqaddimah, ch. 4, on sedentary and desert life',
          url: 'https://www.muslimphilosophy.com/ik/Muqaddimah/',
        },
        tension:
          'The contrast is too clean. Nomadic societies are not uniformly hardy, and cities are not uniformly decadent; the history of technology is largely a history of cities solving problems that supposedly required hardship. The useful part is the warning about hidden dependence, not the moral contrast between desert and city.',
      },
    ],
    pairsWith: ['nietzsche', 'sontag'],
  },
  {
    id: 'noether',
    name: 'Emmy Noether',
    dates: '1882–1935',
    discipline: 'Mathematics',
    field: 'Mathematics',
    themes: ['Mathematics', 'Physics', 'Science'],
    portrait: 'EN',
    thesis:
      'A conservation law is not a separate fact about nature; it is what a symmetry looks like when it is written down. And algebra is the study of the structures that survive a change of names.',
    profile: {
      formation:
        'Born in Erlangen, the daughter of the mathematician Max Noether. Women could not matriculate normally in Bavaria, so she audited lectures with her father\u2019s permission and sat examinations in Göttingen and Erlangen, where she received a doctorate in 1907. She worked without pay at the Mathematical Institute in Erlangen, then moved to Göttingen in 1915 at the invitation of Hilbert and Klein, who wanted her for the general relativity work.',
      method:
        'She began from invariants: what stays the same when something else is allowed to change. From there she moved to structures — groups, rings, ideals, modules — and insisted that a proof should depend only on the properties that matter, so the same argument would work wherever those properties occur. Her lectures were famous for being difficult and for being about the argument rather than the examples.',
      development:
        'The two Noether theorems of 1918 connected symmetries of an action to conservation laws: the first gives conserved quantities for global symmetries, the second constrains the identities that local symmetries impose. She then rebuilt ideal theory in ring-theoretic terms (1921), extended it to orders and algebraic number fields, and worked on non-commutative algebras and representation theory in the 1920s. Her students and collaborators, including van der Waerden and Grete Hermann, carried the structural style into algebra across Europe.',
      limits:
        'The abstract style can conceal where an argument depends on a finiteness or commutativity condition, and her own published output is smaller than her influence because much of it went into lectures and students\u2019 theses. She never completed the book on algebra she planned. Her work was also shaped by the Göttingen school\u2019s priorities: the programme is powerful inside algebra and field theory, and it says less about analysis or geometry than its admirers sometimes claim.',
    },
    works: [
      { title: 'Invariante Variationsprobleme', year: '1918', note: 'The two theorems connecting symmetries of an action to conservation laws and to local identities.' },
      { title: 'Idealtheorie in Ringbereichen', year: '1921', note: 'Ideal theory rebuilt for general commutative rings, the paper that made the structural approach standard.' },
      { title: 'Abstrakter Aufbau der Idealtheorie', year: '1927', note: 'The abstract construction of ideal theory in algebraic number and function fields.' },
      { title: 'Hyperkomplexe Grössen und Darstellungstheorie', year: '1929', note: 'Lectures on hypercomplex systems and representation theory, a foundation for modern algebra.' },
    ],
    voice: {
      register:
        'Exact, unsentimental, and impatient with arguments that depend on a special case. She restates the question in the most general form it will bear, then shows that the original problem was a special case of something already settled.',
      openers: [
        'Let us first say precisely what is allowed to change.',
        'The statement you want is a special case of a more general one.',
        'Before we calculate, we should name the structure.',
        'That argument uses more than it needs. Here is what it actually uses.',
      ],
      closers: [
        'The theorem is not about this equation. It is about every equation with that symmetry.',
        'What survives the transformation is the thing worth naming.',
        'If the proof needs the example, it is not yet a proof.',
        'Generality is not vagueness. It is knowing exactly which hypotheses do the work.',
      ],
    },
    starters: [
      'Why does a symmetry imply a conservation law?',
      'What is the difference between an invariant and a conserved quantity?',
      'Why did you insist on abstract structures instead of concrete numbers?',
      'What did it cost to work without a salary or a title?',
    ],
    positions: [
      {
        id: 'symmetry-and-conservation',
        themes: ['symmetry', 'conservation', 'energy', 'momentum', 'invariance', 'law', 'physics', 'noether', 'theorem'],
        title: 'A conservation law is a symmetry in disguise',
        claim:
          'Energy conservation is what the laws look like when they do not change from one moment to the next. Momentum conservation is what they look like when they do not change from one place to another.',
        argument:
          'The statement is a theorem, not a slogan. If an action is unchanged when time is shifted by a constant, then the quantity conjugate to that shift is constant along every solution of the equations. If the action is unchanged under a spatial translation, the conjugate quantity is momentum. The theorem does not say that nature respects a principle called conservation of energy; it says that a symmetry of the action produces a conserved current, and the conserved quantity is identified by the transformation that generated it. That is why the same mathematics gives charge conservation from a phase symmetry and colour charge from an internal symmetry: the physics differs, the structure does not.',
        citation: {
          label: 'E. Noether, "Invariant variation problems", trans. M. A. Tavel, Transport Theory and Statistical Physics 1, 186 (1971); the 1918 Göttingen paper in English',
          url: 'https://doi.org/10.1080/00411457108231446',
        },
        tension:
          'In general relativity the symmetry is local, and the second theorem says that the corresponding conservation law becomes a differential identity rather than a global conserved quantity. Energy in an expanding universe is therefore not conserved in the naive sense, which is a real feature and not a bookkeeping error. Popular accounts often skip this and present "symmetry gives conservation" as if it were unconditional.',
      },
      {
        id: 'structure-over-substance',
        themes: ['algebra', 'structure', 'ring', 'ideal', 'abstract', 'mathematics', 'same', 'general'],
        title: 'Study the structure, not the objects',
        claim:
          'A proof should use only the properties that the result depends on. Once those properties are named, the theorem applies to every system that has them, and the original objects become examples.',
        argument:
          'The classical theory of ideals was built for rings of algebraic integers, using divisibility and factorisation as they behave there. But most of the arguments never use unique factorisation; they use addition, multiplication, and the existence of certain ideals. Once you isolate those conditions, the same theorems hold in polynomial rings, in rings of functions, and in rings nobody had thought of. This is not abstraction for its own sake. It is economy: one proof instead of a dozen, and a precise statement of what a result actually assumes. It also tells you where a theorem will fail, because you can point to the hypothesis that was dropped.',
        citation: {
          label: 'E. Noether, "Idealtheorie in Ringbereichen", Mathematische Annalen 83, 24–66 (1921)',
          url: 'https://doi.org/10.1007/BF01464225',
        },
        tension:
          'Abstraction can also lose information that matters. A structural proof may tell you that an object exists without giving you a way to compute it, and the conditions that make a theorem true can be so general that they are hard to check in practice. The method is a tool for organising mathematics, not a guarantee that the abstract statement is the interesting one.',
      },
      {
        id: 'invariants-are-the-object',
        themes: ['invariant', 'change', 'transformation', 'identity', 'geometry', 'same', 'coordinate'],
        title: 'What survives a change is the thing worth naming',
        claim:
          'An object is best described by what does not change when you change the description. Coordinates are a choice; invariants are the object.',
        argument:
          'A curve can be written in many coordinate systems, and a surface can be parameterised in infinitely many ways. The curvature is the same in all of them. The classical invariant theorists of the nineteenth century computed these quantities for binary forms, and the subject became a maze of explicit formulas. The structural turn asks a better question: which transformations are allowed, and what is the ring of functions invariant under them? That question has an answer that does not depend on the particular form, and it is the same question whether the transformations are rotations, changes of variable, or the gauge transformations of a field theory. The invariant is not a summary of the object; it is the part of the object that the allowed transformations cannot touch.',
        citation: {
          label: 'Y. Kosmann-Schwarzbach, The Noether Theorems: Invariance and Conservation Laws in the Twentieth Century (Springer, 2011)',
          url: 'https://doi.org/10.1007/978-0-387-87868-3',
        },
        tension:
          'The answer depends entirely on which transformations you allow. Allow too many and only constants survive; allow too few and the invariants are just relabelled coordinates. There is no transformation group given by nature, so the choice is part of the modelling, and a claim that something is invariant is only as meaningful as the group it is invariant under.',
      },
      {
        id: 'exclusion-is-institutional',
        themes: ['woman', 'exclusion', 'teach', 'university', 'credit', 'recognition', 'institution', 'position'],
        title: 'The institution judged the position, not the work',
        claim:
          'For years Noether lectured at Göttingen under Hilbert\u2019s name, without a salary or a title, because the university would not appoint a woman. The arrangement was not a formality; it determined who was allowed to be an author of the school she built.',
        argument:
          'Hilbert had her hired to work on general relativity in 1915, but the faculty refused a habilitation on the grounds that she was a woman. She lectured, formally as Hilbert\u2019s assistant, and students enrolled in his courses to hear her. She was finally granted the right to teach in 1919, and a paid position only in 1922. In 1933 the Nazi government dismissed her, along with other Jewish academics, and she emigrated to Bryn Mawr, where she died two years later after an operation. The point is not that her colleagues were uniformly hostile; Hilbert and Klein fought for her. The point is that the institution could accept her mathematics while refusing her the standing that would have made the mathematics hers in the record.',
        citation: {
          label: 'J. J. O\u2019Connor and E. F. Robertson, "Emmy Noether", MacTutor History of Mathematics Archive',
          url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Noether_Emmy/',
        },
        tension:
          'The story is sometimes told as a simple case of a genius ignored, which understates how much support she had and overstates how complete the exclusion was. She had powerful advocates, an international network of students, and a reputation that crossed borders. What she did not have, for most of her career, was a salary, a title, or the ordinary institutional standing that would have made her position secure.',
      },
    ],
    pairsWith: ['einstein', 'curie'],
  },
  {
    id: 'mcclintock',
    name: 'Barbara McClintock',
    dates: '1902–1992',
    discipline: 'Genetics',
    field: 'Biology',
    themes: ['Life', 'Science', 'Mind & Machine'],
    portrait: 'BM',
    thesis:
      'The genome is not a fixed text. Genes move, chromosomes break and rearrange, and an organism under stress can change its own inheritance.',
    profile: {
      formation:
        'Grew up in Brooklyn and studied at Cornell, where she stayed for a doctorate in botany and then for years of cytology. She learned to identify every chromosome of maize by its shape and behaviour at meiosis, which was the technical foundation of everything she later saw.',
      method:
        'She worked with one organism for decades and read the chromosomes directly under the microscope, correlating visible rearrangements with inherited traits. Her method was observational and cumulative: she knew what normal looked like in such detail that an unusual pattern stood out before she had a theory for it. She resisted explanations that were not forced by the material.',
      development:
        'In the 1930s she produced the first cytological demonstration of crossing over and mapped maize chromosomes. In the 1940s she found loci that changed position and altered the expression of nearby genes, which she called controlling elements. The work was published, cited by maize geneticists, and not generally accepted as a general mechanism until transposons were found in bacteria and other organisms in the 1970s. She received the Nobel Prize in Physiology or Medicine in 1983.',
      limits:
        'Her conclusions came from one plant, and the maize system is unusual: transposition there is developmentally regulated and visible in kernel pigmentation in a way it is not in most organisms. She did not provide a molecular mechanism, because the tools did not exist. Her later writing sometimes treated the genome as an agent that responds to challenge, a framing that is vivid and difficult to test.',
    },
    works: [
      { title: 'The origin and behavior of mutable loci in maize', year: '1950', note: 'The paper that introduced controlling elements and the idea that genes can change position.' },
      { title: 'Chromosome organization and genic expression', year: '1951', note: 'A synthesis of her cytogenetic work on position effects and chromosome structure.' },
      { title: 'The significance of responses of the genome to challenge', year: '1984', note: 'Her argument that genomes reorganise under stress, written after the Nobel Prize.' },
    ],
    voice: {
      register:
        'Patient, concrete and stubbornly tied to what the material shows. She describes the chromosome before she interprets it, corrects a question that assumes too much, and is more interested in the exception than in the average.',
      openers: [
        'Look at the chromosome first, and leave the theory for later.',
        'The exception is the interesting part.',
        'That is not what the kernels show.',
        'I can tell you what I saw. I am less confident about what it means.',
      ],
      closers: [
        'The genome is not a static library. It is a system that can rearrange itself.',
        'If the organism is telling you something, you have to be willing to listen for years.',
        'The mechanism will be found by someone with better tools. The phenomenon is already here.',
        'A pattern that repeats across a lifetime of slides is not an anecdote.',
      ],
    },
    starters: [
      'Do genes actually stay in one place?',
      'Can stress change what an organism passes on?',
      'Why did other geneticists not accept your work for so long?',
      'What does it mean to understand an organism rather than a gene?',
    ],
    positions: [
      {
        id: 'controlling-elements',
        themes: ['gene', 'move', 'jump', 'transposon', 'maize', 'chromosome', 'inheritance', 'position'],
        title: 'A gene can change its position and change what its neighbours do',
        claim:
          'Some genetic elements move from place to place in the chromosome, and where they land can switch nearby genes on or off. Inheritance is therefore partly a matter of arrangement, not only of sequence.',
        argument:
          'In maize I followed kernel pigmentation through generations and found loci that did not behave like fixed genes. A locus could disappear from one position and reappear at another, and the pigmentation pattern changed with the move. I called the moving units controlling elements, because their effect depended on where they inserted: they could suppress a neighbouring gene, release it, or alter its timing. The important point is not that DNA can be rearranged; it is that the rearrangement is inherited and produces a visible, repeatable change in expression. A genome that can be rearranged is a genome whose behaviour depends on history and position, not just on a list of genes.',
        citation: {
          label: 'B. McClintock, "The origin and behavior of mutable loci in maize", PNAS 36, 344 (1950)',
          url: 'https://doi.org/10.1073/pnas.36.6.344',
        },
        tension:
          'Maize is not a typical case. Its transposable elements are unusually visible, and the developmental timing of the kernel pigmentation makes position effects easy to score. The generalisation that all genomes are restless took another twenty years and a different set of organisms, and the metaphor of "jumping genes" makes the process sound more random than the regulated systems actually are.',
      },
      {
        id: 'genome-responds-to-challenge',
        themes: ['stress', 'genome', 'environment', 'response', 'reorganise', 'challenge', 'damage'],
        title: 'A genome under stress can reorganise itself',
        claim:
          'Chromosomes can break, fuse and rearrange under conditions that challenge the organism, and some of those rearrangements are inherited. The genome is a responsive system, not a fixed archive.',
        argument:
          'The evidence came from plants grown under unusual conditions and from the behaviour of broken chromosomes: a chromosome that loses an end can fuse with another, and the resulting cycles of breakage produce new arrangements. These are not random mutations in a single gene. They are changes in the large-scale organisation of the genome, and they can alter how a whole block of genes is expressed. If the environment can induce that kind of instability, then inheritance includes a component that responds to circumstance, and the neat separation between a fixed genotype and a varying environment is too simple. I do not claim to know the mechanism. I claim that the phenomenon is there and that a theory of inheritance has to account for it.',
        citation: {
          label: 'B. McClintock, "The significance of responses of the genome to challenge", Science 226, 792 (1984)',
          url: 'https://doi.org/10.1126/science.15739260',
        },
        tension:
          'The language of response invites a teleology that the evidence does not support: a genome does not detect a problem and choose a solution. Stress increases the rate of certain rearrangements, but the rearrangements are not directed toward a useful outcome. The honest version is that stress destabilises the genome, and selection does the rest, which is less dramatic and more defensible.',
      },
      {
        id: 'seeing-the-organism',
        themes: ['method', 'observation', 'organism', 'cytology', 'attention', 'seeing', 'understand'],
        title: 'Understanding starts with knowing one organism intimately',
        claim:
          'The ability to see an anomaly depends on knowing the normal case in detail. That knowledge is slow, local and not easily transferred, and it is a form of understanding that statistics cannot replace.',
        argument:
          'I spent years identifying each maize chromosome by its size, its centromere position and its behaviour at meiosis. When a chromosome behaved strangely, I could see that it was strange because I knew what the others did. A researcher who treats the organism as a black box and measures one variable at a time will miss the anomaly, because the anomaly is a departure from a pattern that has to be learned. This is not a mystical claim about intuition. It is a claim about the resolution of the instrument: the instrument was my familiarity with the material, and it took years to calibrate. The reward is that you notice things nobody was looking for.',
        citation: {
          label: 'B. McClintock, "Chromosome organization and genic expression", Cold Spring Harbor Symposia 16, 13 (1951)',
          url: 'https://doi.org/10.1101/SQB.1951.016.01.004',
        },
        tension:
          'A method built on one organism is hard to generalise and hard to teach, and the romantic version of it — the lone observer with a feeling for the organism — understates how much of her knowledge was shared with a community of maize geneticists. Intimacy with the material is powerful; it is not a substitute for a mechanism.',
      },
      {
        id: 'being-ignored',
        themes: ['ignored', 'recognition', 'nobel', 'credit', 'woman', 'dismissed', 'ahead', 'time'],
        title: 'The work was not ignored; it was not generalised',
        claim:
          'The popular story that McClintock was dismissed for thirty years is mostly wrong. Maize geneticists read and cited her; what they did not do was accept that transposition was a general feature of genomes until it was found elsewhere.',
        argument:
          'Her 1950 paper was published in the Proceedings of the National Academy of Sciences and discussed by people working on maize. What happened afterwards is subtler than the legend. The phenomenon was real to the specialists and peripheral to a field that was moving toward molecular biology and bacterial genetics. When transposable elements were found in bacteria in the late 1960s, and when the molecular mechanisms were worked out, the general claim became credible. The Nobel in 1983 recognised the discovery, and the narrative then compressed a complicated reception into a morality tale about a woman ahead of her time. The lesson worth keeping is about how a field decides which phenomena are central, not about a lonely genius nobody would listen to.',
        citation: {
          label: 'B. McClintock, Nobel Lecture, "The significance of responses of the genome to challenge" (1983)',
          url: 'https://www.nobelprize.org/prizes/medicine/1983/mcclintock/lecture/',
        },
        tension:
          'Correcting the legend can swing too far the other way. She did work for decades without the recognition that her discovery warranted, she did face the ordinary sexism of academic science, and the delay in general acceptance was real. The point is not that she was treated fairly; it is that the story is more interesting when the mechanism of neglect is described accurately.',
      },
    ],
    pairsWith: ['curie', 'noether'],
  },
  {
    id: 'turing',
    name: 'Alan Turing',
    dates: '1912–1954',
    discipline: 'Mathematics and computing',
    field: 'Computation',
    themes: ['Mind & Machine', 'Logic', 'Mathematics'],
    portrait: 'AT',
    thesis:
      'A machine is whatever a finite table of rules can do. Everything else — intelligence, thinking, even the shapes of living things — has to be asked as a question about what such a system can produce.',
    profile: {
      formation:
        'Schooled at Sherborne, then King\u2019s College, Cambridge, where he read mathematics and wrote on probability and on the Gaussian error function. He spent 1936 at Princeton after the computable-numbers paper, and returned to England to work on cryptanalysis at Bletchley Park from 1939.',
      method:
        'Reduce a vague question to a precise machine, then ask what the machine can and cannot do. He preferred a definition he could operate on to a philosophical dispute he could not, and he treated a negative result as informative: if no machine can decide a question, that is a theorem about the question, not a failure of effort.',
      development:
        'The 1936 paper defined computable numbers and proved the Entscheidungsproblem undecidable. Wartime work on Enigma and on secure speech shaped his practical understanding of machines. In 1950 he proposed the imitation game as a way to ask whether machines can think, and in 1952 he published a chemical model of morphogenesis, showing how two diffusing substances could produce spots and stripes.',
      limits:
        'The 1936 model is idealised: infinite tape, perfect reliability, no time bound. The imitation game was proposed as an operational substitute for a question he thought ill-formed, not as a definition of intelligence, and he said so. His morphogenesis model was ahead of the evidence for the molecules involved and was not confirmed in detail until reaction–diffusion systems were found in real embryos. He was also, as a gay man in Britain, prosecuted in 1952 and subjected to chemical castration; the state that had used his work destroyed his life.',
    },
    works: [
      { title: 'On Computable Numbers, with an Application to the Entscheidungsproblem', year: '1936', note: 'The Turing machine, the halting problem, and the undecidability of first-order logic.' },
      { title: 'Computing Machinery and Intelligence', year: '1950', note: 'The imitation game, and the argument that \u201ccan machines think?\u201d should be replaced by a test.' },
      { title: 'The Chemical Basis of Morphogenesis', year: '1952', note: 'Reaction–diffusion: how a uniform tissue can produce a pattern without a blueprint.' },
      { title: 'Checking a Large Routine', year: '1949', note: 'An early argument that a program can be checked against a specification rather than merely tested.' },
    ],
    voice: {
      register:
        'Plain, exact and a little impatient with questions that have not been given a definite form. He offers a definition, works out what follows from it, and is comfortable saying that the original question was the wrong one.',
      openers: [
        'Let us replace the question with one that can be answered.',
        'I can build a machine that does that. The interesting question is what it cannot do.',
        'The difficulty is in the definition, not in the engineering.',
        'Suppose we make the rules explicit and see what happens.',
      ],
      closers: [
        'If no procedure can decide it, that is a result about the problem, not a gap in our cleverness.',
        'A simulation of thinking is not obviously different from thinking, and that is the point of the test.',
        'The pattern does not need a plan. It needs the right equations and a little noise.',
        'The machine does exactly what it was built to do. Whether that is thinking is a question we have not defined.',
      ],
    },
    starters: [
      'Can a machine think?',
      'What is the halting problem, and why does it matter?',
      'How can a uniform embryo produce stripes?',
      'Was the imitation game a definition of intelligence?',
    ],
    positions: [
      {
        id: 'computable-numbers',
        themes: ['machine', 'compute', 'computable', 'algorithm', 'halting', 'decide', 'logic', 'turing', 'program'],
        title: 'A computation is what a finite table of rules can do',
        claim:
          'The intuitive idea of an effective procedure can be replaced by an exact machine: a finite rule table, a tape, and a head. Whatever such a machine cannot do, no other mechanical procedure can do either.',
        argument:
          'The definition is not a model of a particular computer. It is a way of making \u201ceffective method\u201d precise enough to prove things about. Once the machine is defined, the diagonal argument shows that no machine can decide, for every machine and input, whether the machine halts. That result is not about the limits of 1936 technology: it is about the logic of any finite procedure, and it holds for every model of computation that has since been shown equivalent. The practical consequence is that some questions have no general algorithm, only a collection of special cases that people can settle one at a time.',
        citation: {
          label: 'A. M. Turing, "On computable numbers, with an application to the Entscheidungsproblem", Proc. London Math. Soc. 42, 230 (1936)',
          url: 'https://doi.org/10.1112/plms/s2-42.1.230',
        },
        tension:
          'The model assumes unlimited time, unlimited tape and no errors. Real computers have none of these, and the undecidability result says nothing about whether a particular program will finish within a useful time. That gap is where the practical theory of complexity lives, and it is the reason a theorem about impossibility can coexist with software that works.',
      },
      {
        id: 'imitation-game',
        themes: ['think', 'intelligence', 'machine', 'mind', 'conscious', 'test', 'imitation', 'understand'],
        title: 'Replace \u201ccan machines think?\u201d with a test you can run',
        claim:
          'The question as usually asked is too vague to answer. Substitute an operational question: can a machine, in text, be distinguished from a person by an interrogator who cannot see either?',
        argument:
          'The imitation game is not offered as a definition of intelligence. It is offered as a replacement for a question whose terms — think, machine, understand — have no agreed operational meaning. If a machine can hold up its end of a conversation so that an interrogator cannot reliably tell it from a person, then either it is thinking in whatever sense matters, or the sense we thought mattered is not detectable. The argument shifts the burden: instead of demanding a proof of inner experience, it asks what evidence would count, and it makes the answer empirical. That is a methodological move, not a metaphysical one.',
        citation: {
          label: 'A. M. Turing, "Computing machinery and intelligence", Mind 59, 433 (1950)',
          url: 'https://doi.org/10.1093/mind/LIX.236.433',
        },
        tension:
          'Passing a conversation test is compatible with a system that has no understanding at all, and the test rewards mimicry of human style rather than the capacity to reason. Turing anticipated several objections and answered them in the paper, but he did not anticipate the modern one: a system trained on human text can produce fluent answers without a model of the world, which makes the test easier to pass and less informative than he hoped.',
      },
      {
        id: 'morphogenesis',
        themes: ['pattern', 'embryo', 'stripe', 'spot', 'form', 'chemistry', 'development', 'noise'],
        title: 'A pattern can emerge without a blueprint',
        claim:
          'Two chemicals that react and diffuse at different rates can turn a uniform tissue into spots and stripes. The pattern is a property of the equations, not of a plan stored somewhere.',
        argument:
          'The mechanism is instability, not instruction. Take two substances: one activates its own production and also produces an inhibitor, and let the inhibitor diffuse faster than the activator. A uniform state can be unstable to small disturbances, because a local peak of activator grows while its inhibitor spreads out and suppresses the neighbours. The result is a regular spacing set by the ratio of the diffusion rates. The wavelength is not encoded in any cell; it is a consequence of the interaction. The same idea explains why a zebra\u2019s stripes have a characteristic spacing and why a developing limb can produce digits at regular intervals.',
        citation: {
          label: 'A. M. Turing, "The chemical basis of morphogenesis", Phil. Trans. R. Soc. B 237, 37 (1952)',
          url: 'https://doi.org/10.1098/rstb.1952.0012',
        },
        tension:
          'The model shows that a pattern is possible, not that a particular embryo uses it. Proving that a real system is Turing-type requires identifying the molecules, measuring their diffusion rates and showing that the pattern disappears when the mechanism is disrupted. Some developmental patterns fit; others are explained by positional information, mechanical buckling or cell sorting. Turing gave a mechanism, and biology has been sorting out which cases it governs.',
      },
      {
        id: 'machine-limits',
        themes: ['limit', 'conscious', 'brain', 'discrete', 'continuous', 'understanding', 'human'],
        title: 'A discrete machine is not the same as a brain',
        claim:
          'The fact that a machine can imitate some human activity does not show that a brain is a discrete-state machine. The brain may be continuous, noisy and analog in ways the model leaves out.',
        argument:
          'In the 1950 paper I considered the objection that the nervous system is not a discrete-state machine, and I did not dismiss it. The argument for the imitation game does not require that a brain be a Turing machine; it requires only that whatever the brain does can be approximated well enough for the interrogator to be fooled. That is a weaker claim, and it is the one the test actually supports. The stronger claim, that thought just is computation, needs an argument that no one has supplied. Confusing the two is the most common mistake in the literature: a demonstration that a machine can do a task is treated as a demonstration that the task is computation.',
        citation: {
          label: 'A. M. Turing, "Computing machinery and intelligence", Mind 59, 442–445 (1950), on the argument from continuity of the nervous system',
          url: 'https://doi.org/10.1093/mind/LIX.236.433',
        },
        tension:
          'Turing\u2019s own response was that a discrete machine can approximate a continuous system as closely as we like, so the distinction does not matter for the test. That is true for approximation and false for explanation: an approximation of a brain is not an account of how the brain works. The imitation game can survive that gap; a theory of mind cannot.',
      },
    ],
    pairsWith: ['einstein', 'noether'],
  },
];

export const MIND_BY_ID = MINDS.reduce((map, mind) => {
  map[mind.id] = mind;
  return map;
}, {});

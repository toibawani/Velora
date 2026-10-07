/**
 * Every difficult word in the computer science levels, defined once.
 *
 * Same file, same shape and same contract as the physics, philosophy and history
 * glossaries, because the brief asked for one tooltip system rather than a
 * fourth one bolted on for this subject. <GlossaryTerm> reads all four files
 * through a single lookup, and computerscience.test.ts asserts that no term is
 * defined in two of them - so one word can only ever show a reader one meaning,
 * whichever subject they are reading.
 *
 * The selection here is the vocabulary this subject genuinely forces on a
 * reader, not a general computing wordlist. "Compiler" and "algorithm" are in
 * it because a reader meets them as the load-bearing parts of a mechanism, and
 * "latency" and "idempotent" are in it because most of the ways a reader is
 * misled about software are ways of not knowing what those words mean precisely.
 * Words that would read the same in any subject - "model", "system", "network" -
 * are deliberately absent, because defining those four times would be the drift
 * the one-glossary rule exists to prevent.
 *
 * `see` chains a term to a simpler one, so reading "network partition" does not
 * require having already read "consensus". Chains are followed one level deep at
 * display time, and a chain that loops or points at nothing fails a test.
 */

export interface GlossaryEntry {
  /** Matches what is written inside {{double braces}} in the level data. */
  term: string;
  definition: string;
  /** A simpler term to point at, when this one rests on another. */
  see?: string;
}

const TERMS: GlossaryEntry[] = [
  // --- The cost vocabulary, which is what makes this subject distinct ------
  {
    term: 'asymptotic',
    definition:
      'Describing how something grows as the input gets bigger, ignoring the constant factor. "Sorting is O(n log n)" means the work grows a little faster than n times the logarithm, but says nothing about whether your run took 2 seconds or 20.',
  },
  {
    term: 'latency',
    definition:
      'The wait before something arrives. Disk, network and memory all have a floor below which they cannot go faster: reading from RAM is about a hundred times slower than reading from a CPU cache, and no amount of cleverness closes that gap.',
    see: 'cache miss',
  },
  {
    term: 'bandwidth',
    definition:
      'How much data can move per second. Bandwidth and latency are different problems, and improving one often makes the other worse: a wider pipe holding more in flight is exactly what creates the queue that adds waiting.',
    see: 'latency',
  },
  {
    term: 'cache miss',
    definition:
      'Asking for something the CPU cache does not already hold, so it has to go out to slower memory. A missed fetch costs hundreds of cycles rather than a handful, which is why two programs doing identical arithmetic can differ by an order of magnitude purely from the order they touch memory in.',
    see: 'latency',
  },
  {
    term: 'cache line',
    definition:
      'The small block of memory a CPU cache actually fetches, typically 64 bytes, containing the bytes you asked for plus their neighbours. It is why reading one byte out of a large array can cost a whole line, and why walking an array in order is fast while chasing pointers is slow.',
    see: 'cache miss',
  },
  {
    term: 'virtual memory',
    definition:
      'The trick that lets each program believe it has all of memory to itself. The machine maps the addresses your program uses onto real physical locations, so two programs can both use address 1000 without colliding, and one crashing does not take the other down.',
  },

  // --- Correctness, which is the other half of the subject ----------------
  {
    term: 'algorithm',
    definition:
      'A procedure that turns input into output and, crucially, does so correctly every time. A fast program that is sometimes wrong is not a fast algorithm; it is a bug with a good average case.',
  },
  {
    term: 'data structure',
    definition:
      'A way of laying out data so that the operations you do most often are cheap. The same information stored as a sorted list or a hash table answers "is this in here?" in milliseconds or microseconds respectively, and each pays for that with something else.',
    see: 'algorithm',
  },
  {
    term: 'hash table',
    definition:
      'A data structure that computes a number from your key and jumps straight to where the value should be, instead of looking at every entry. It is only fast if that number spreads keys out evenly - an attacker who controls the keys can aim them all at one bucket and turn an instant lookup into a full scan.',
    see: 'data structure',
  },
  {
    term: 'worst case',
    definition:
      'The slowest the operation can ever be, as opposed to the typical case. Most speed claims in this subject are average-case, which is why a system can be reliably fast for years and then turn out to be unusable by someone who found the input that does not fit the pattern.',
    see: 'asymptotic',
  },
  {
    term: 'concurrency',
    definition:
      'Having several things in progress at once. Concurrency is not the same as parallelism - two tasks can be interleaved on a single core - and the gap between the two is where most reasoning errors in concurrent code live.',
  },
  {
    term: 'race condition',
    definition:
      'A bug that depends on two things happening in an order nobody specified. It can reproduce a thousand times and then not appear for a month, because the outcome turned on a gap of a few nanoseconds between one part of a program finishing and another starting.',
    see: 'concurrency',
  },
  {
    term: 'serializable',
    definition:
      'A guarantee that the result of several transactions looks as though they had run one after another, even though they actually overlapped. It sounds safe and is, but it costs: the easiest way to get it is to stop letting transactions overlap at all.',
    see: 'concurrency',
  },
  {
    term: 'idempotent',
    definition:
      'Safe to do twice. Doing something twice has the same effect as doing it once, so a retry after a failure changes nothing. This is the property that decides whether an operation over a network can be blindly repeated when you are not sure whether it already arrived.',
  },

  // --- What the machine is allowed to do to you ---------------------------
  {
    term: 'compiler',
    definition:
      'The program that translates your source code into machine instructions. Because it knows what your program is guaranteed never to do, it is allowed to remove anything that could only happen if you broke those guarantees - including code you wrote and can see.',
    see: 'undefined behaviour',
  },
  {
    term: 'undefined behaviour',
    definition:
      'Code whose result your language does not specify at all, for example reading past the end of an array. The compiler is permitted to assume your program never does this, so it may delete the check you wrote to guard against it - and the program still looks correct in the source.',
    see: 'compiler',
  },
  {
    term: 'garbage collector',
    definition:
      'The part of a runtime that notices memory no longer reachable from your program and reclaims it. The appeal is that you stop having to free things by hand; the cost is a pause at a moment the runtime chooses, which is why the same program can be fast in one setting and stutter in another.',
  },

  // --- Learning from data, where the evidence is weakest ------------------
  {
    term: 'overfitting',
    definition:
      'Learning the training examples so exactly that the model also reproduces their noise - the specific wrong answers, the specific camera angle - and so performs badly on anything new. The model is not failing to learn; it has learned the wrong thing at higher fidelity than intended.',
    see: 'generalization',
  },
  {
    term: 'generalization',
    definition:
      'How well a model does on data it has never seen. This is the only number anyone actually cares about, and it is the hardest to measure honestly, because any time you tune choices using the test set, the test set quietly stops being a test set.',
  },
  {
    term: 'gradient descent',
    definition:
      'The standard way to fit a model: measure how wrong it is, walk a little downhill in that direction, repeat. It works because the error surface usually slopes downhill toward a valley, and the only real questions are how big a step to take and when to stop.',
  },
  {
    term: 'backpropagation',
    definition:
      'The bookkeeping that makes gradient descent possible on a deep network: working backwards from the error to compute, for every weight, which direction would have reduced it. It is what makes depth useful, and the reason a large model is expensive to train rather than merely to run.',
    see: 'gradient descent',
  },
  {
    term: 'neural network',
    definition:
      'A stack of layers of simple weighted sums, trained by gradient descent. Calling it a brain model has done real damage: it is a function that maps numbers to numbers, and an honest description of what happens inside it is still argued over.',
    see: 'gradient descent',
  },
  {
    term: 'hyperparameter',
    definition:
      'A setting you choose before training rather than one the data learns - learning rate, depth, batch size. They are not fitted by gradient descent, they dominate whether the model works at all, and tuning them is the least principled and most expensive part of the process.',
    see: 'gradient descent',
  },
  {
    term: 'benchmark',
    definition:
      'A standard task with a published score, used so two systems can be compared. It works until somebody optimises for the benchmark instead of the task, at which point the number keeps climbing and the capability does not.',
    see: 'generalization',
  },

  // --- Networks, and what happens when a message cannot be trusted --------
  {
    term: 'packet',
    definition:
      'One chunk of a message on its way across a network, carrying a header with where it came from and where it is going. Because they travel independently and take different routes, they can arrive out of order, or not at all, or twice.',
    see: 'latency',
  },
  {
    term: 'round trip',
    definition:
      'The time for a message to reach the far end and for the answer to come back. On a real network that is dominated by waiting rather than by distance: light covers the Atlantic in roughly 30 milliseconds, and a typical server responds in tens of milliseconds.',
    see: 'latency',
  },
  {
    term: 'network partition',
    definition:
      'When two machines that need to talk cannot. Not a crash and not slowness - healthy on both sides, with no way to tell a dead peer from a silent one. It is the reason distributed systems theory is mostly about what you have to give up.',
    see: 'consensus',
  },
  {
    term: 'consensus',
    definition:
      'Getting independent machines to agree on one value when some may fail or be cut off. Two thirds of the machines agreeing is enough to be safe, which is why you see 2f+1 machines mentioned for f failures - the extra one exists so a minority cannot be mistaken for a majority.',
    see: 'network partition',
  },
  {
    term: 'throughput',
    definition:
      'How much work finishes per unit of time, regardless of how long any single item took. Raising throughput and cutting latency pull against each other, so quoting one without the other is how a system comes to look good on a slide and feel bad in use.',
    see: 'bandwidth',
  },

  // --- Security, where a correct program is still the wrong target -------
  {
    term: 'buffer overflow',
    definition:
      'Writing past the end of a fixed-size region of memory. It is still the mechanism behind a large share of serious vulnerabilities because a language that checks every write adds a cost, and paying that cost was long judged optional.',
    see: 'memory safety',
  },
  {
    term: 'memory safety',
    definition:
      'The property that a program can only read and write memory it actually owns, with no route from bad input to an arbitrary address. Languages that guarantee it move the most dangerous class of bug from a runtime question to a compile-time one.',
    see: 'buffer overflow',
  },
  {
    term: 'privilege',
    definition:
      'The right to do something, checked on every operation rather than assumed once at the start. The design question is never whether to check but where: checking everywhere is slow and complicated, checking nowhere means any bug is also a breach.',
  },

  // --- Quantum, in the vocabulary the papers actually used ----------------
  {
    term: 'qubit',
    definition:
      'The unit of quantum information. Unlike a bit it can be in a superposition of 0 and 1, but reading one gives you 0 or 1 and destroys the superposition - so the information has to be sampled many times to be recovered.',
  },
  {
    term: 'superposition',
    definition:
      'A quantum system being in a weighted combination of its possible states at once, rather than in one of them. It is not "trying every answer at once": you cannot read the combination, which is why an algorithm has to be arranged so the right answer is the likely one you measure.',
    see: 'qubit',
  },
  {
    term: 'decoherence',
    definition:
      "The loss of a quantum system's superposition through contact with its surroundings. It happens continuously and cannot be engineered away, only bought back with more physical qubits - which is why quantum advantage claims are stated as estimates of a simulation cost rather than as measurements of one.",
    see: 'qubit',
  },
];

export const GLOSSARY: Record<string, GlossaryEntry> = TERMS.reduce(
  (acc, entry) => {
    // Throwing here rather than overwriting means a duplicate is caught at import
    // time, in every subject, not only when a test happens to run.
    if (acc[entry.term]) {
      throw new Error(`computerscience glossary: "${entry.term}" is defined twice`);
    }
    acc[entry.term] = entry;
    return acc;
  },
  {} as Record<string, GlossaryEntry>
);

export const GLOSSARY_TERMS = TERMS.map((entry) => entry.term);

/**
 * Look up one term. Returns undefined for a term this subject has not defined,
 * which is how <GlossaryTerm> degrades an unknown {{term}} to plain text rather
 * than rendering a button that opens nothing.
 */
export const lookupTerm = (term: string): GlossaryEntry | undefined =>
  GLOSSARY[String(term).trim().toLowerCase()];
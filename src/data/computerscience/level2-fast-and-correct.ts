import { CsLevel } from './schema';

/**
 * Level 2: choosing what to do, and knowing whether it was right.
 *
 * This is the level that carries the subject's one named open problem. P versus
 * NP is not decoration here: it is the reason the rest of the level is written
 * the way it is, because every entry on this level is a statement about what can
 * be computed quickly, and that is exactly the class of question the open
 * problem asks about.
 */
const LEVEL_2: CsLevel = {
  id: 'fast-and-correct',
  number: 2,
  title: 'Fast, and correct',
  blurb: 'Data structures, the limits of computation, and transactions.',
  intro:
    'Level 1 was about one machine doing what it was told. This level is about the two questions that survive regardless of hardware: what is the cheapest way to do this, and how do you know the result is right when several things are happening at once. Both have limits, and the limits are the interesting part.',
  entries: [
    {
      id: 'algorithms-and-data-structures',
      name: 'Algorithms & Data Structures',
      simple:
        'How fast something is depends on how the data is arranged, not only on how many steps the work takes. A {{hash table}} finds an item in constant time - unless someone chooses the keys to make it slow, which is a real attack, not a hypothetical one.',
      deeper:
        'The arrangement is the whole subject. A hash table computes a number from your key and jumps straight to the right bucket, so lookup is O(1) on average. But the guarantee is on the average, and anyone who controls the keys can aim them all at one bucket - which turns an instant lookup into a full scan of every colliding entry, making a request that should take microseconds take seconds. This is the HashDoS problem, and Java\'s response is a specific and checkable set of constants: JEP 180, delivered in JDK 8, makes a bucket switch from a linked list to a balanced tree once it grows past a threshold set at 8, dropping the {{worst case}} from O(n) to O(log n). The threshold sits above a second constant, set to 6, so a bucket that shrinks is converted back, and there is a floor below which the table is resized instead of treeified - set to 64 in current OpenJDK, where you can read all three in the HashMap source. Those three numbers are the whole defence, and they are version-specific, which is why this entry is labelled machine-dependent rather than proved. The same logic runs underneath every fast program: appending to an array is O(1) and inserting at the front is O(n), because every element has to move, and that difference stays invisible until the array is a hundred thousand rows long.',
      matters:
        'It changes the question you ask when code is slow. "How many operations?" is the question that matters one level up and the wrong one at this level; the useful question is how the data is laid out, because that is what decides the multiplier. It is also why an average-case guarantee quoted without its conditions is not a guarantee, which is a habit this subject needs well before the open problem below.',
      status: 'machine-dependent',
      source:
        'JEP 180, "Handle Frequent HashMap Collisions with Balanced Trees" (JDK 8). TREEIFY_THRESHOLD = 8, UNTREEIFY_THRESHOLD = 6, MIN_TREEIFY_CAPACITY = 64: current OpenJDK java.util.HashMap source.',
      sourceUrl: 'https://openjdk.org/jeps/180',
    },
    {
      id: 'p-versus-np',
      name: 'P vs NP',
      simple:
        'Is there a problem where finding the answer is enormously hard but checking it is quick? Almost everyone thinks yes. Whether that is true, and what follows either way, is unsolved, has been since 2000, and carries one million dollars.',
      deeper:
        'The formulation is short enough to state exactly, which is why it has survived decades of being misstated. P is the class of problems where the answer can be found in time proportional to some power of the size of the input. NP is the class where a proposed answer can be checked in that time. The Hamiltonian path problem - visit every city exactly once - is the standard example: handed a route, verifying it visits each city once is fast; finding that route is not, and no method is known that is. P vs NP asks whether those two classes are the same. If they are, then anything with a quickly checkable answer also has a quick way to find it, and almost every hard planning, scheduling, cryptanalysis and combinatorial problem becomes tractable, which would break most encryption in use today. If they are not, then a category of problems exists where checking is easy and finding is genuinely hard, permanently. Clay Mathematics Institute put a one million dollar prize on it in May 2000, as one of seven Millennium Prize Problems, and it remains unsolved. Notably it is unsolved in the direction almost nobody expects to win: the majority of researchers believe P does not equal NP, and proving that would be less surprising than proving the opposite, but no proof in either direction exists.',
      matters:
        'It is the reason the word "hard" is used carefully throughout this level. A problem being in NP means we can recognise a correct answer quickly; it says nothing about finding one, and the gap between those two is the entire subject. It is also a live reminder that a field can hold a consensus belief for forty years without it being a result, and that "nobody has found an algorithm" is a statement about the search, not about the possibility.',
      status: 'open',
      source:
        'Clay Mathematics Institute, Millennium Prize Problems: seven problems announced at the Collège de France, Paris, 24 May 2000; $1 million per problem; P vs NP listed under "Unsolved problems".',
      sourceUrl: 'https://www.claymath.org/millennium-problems/',
    },
    {
      id: 'databases',
      name: 'Databases',
      simple:
        'When several transactions run at once, a database can promise each one sees a clean, consistent snapshot - and still let two of them together do something neither would have done alone. The guarantee and the bug are not in tension; they are the same design.',
      deeper:
        'Snapshot isolation is the guarantee most modern databases ship by default - it is in PostgreSQL, MySQL, Oracle, SQL Server and MongoDB - and its strength is also its hole. Each transaction reads the database as it was when the transaction began, and commits unless another transaction has written the exact rows it wrote. So write-write conflicts are caught. But two transactions can read overlapping data, write disjoint data, and both commit, neither having seen the other\'s update. The standard example is a doctor on call who reads the roster, sees nobody else is available, and goes to bed. Two doctors do this simultaneously, both read the same roster, each writes their own row saying they are off, both commit, and no patient has a doctor. Under {{serializable}}, one transaction would have had to go first and the other would have seen it, so one of the two would have stayed awake. Snapshot isolation permits this because it is not serializable - and Oracle, for historical reasons, calls its version of snapshot isolation "serializable", which is a naming problem this field has argued about for decades. The fix is real and has a price: serializable isolation means detecting and aborting transactions that would have interleaved badly, which is the difference between high concurrency and lower {{throughput}}.',
      matters:
        'It shows that "the database guaranteed it" and "the data was consistent" are different sentences. A reader who has only met atomicity and durability will assume those are the whole story, and the bug above is invisible to someone reasoning that way - it lives entirely in the isolation level nobody configured. It is also the cleanest example in the subject of a guarantee that is genuinely valuable and genuinely incomplete at the same time.',
      status: 'proved',
      source:
        'Snapshot isolation and the write-skew class of anomaly: Wikipedia, "Snapshot isolation". Adopted by InterBase, Firebird, Oracle, MySQL, PostgreSQL, SQL Anywhere, MongoDB and SQL Server 2005+. Fixes: Cahill, Röhm and Fekete, "Serializable isolation for snapshot databases", SIGMOD 2008.',
      sourceUrl: 'https://en.wikipedia.org/wiki/Snapshot_isolation',
    },
  ],
};

export default LEVEL_2;
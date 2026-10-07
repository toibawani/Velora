import { CsLevel } from './schema';

/**
 * Level 1: the machine underneath.
 *
 * The three entries here are the ones where "the software is slow" and "the
 * hardware is slow" are genuinely different diagnoses, and where the honest
 * answer usually is not the one a reader arrives with. Each is about a mechanism
 * you can follow step by step, because that is the only way a claim like
 * "memory is slow" becomes usable rather than merely memorable.
 *
 * Programming is here rather than in a level of its own because it is the level
 * 1 claim in its most literal form: the code you wrote is not the code that
 * runs.
 */
const LEVEL_1: CsLevel = {
  id: 'the-machine',
  number: 1,
  title: 'The machine underneath',
  blurb: 'Cache, compilation, and the rules the CPU obeys without telling you.',
  intro:
    'Everything above this level runs on the arrangements described here. The three are chosen because they are the points where an intuition built from everyday experience is actively wrong, and where knowing the mechanism changes a decision you would otherwise make by habit.',
  entries: [
    {
      id: 'computer-architecture',
      name: 'Computer Architecture',
      simple:
        'A CPU is far faster than its memory, so it keeps small copies of recent data next to itself in {{cache line}}s and only goes out to RAM when the copy it has is not the copy it needs. Almost every surprise in performance comes from that gap.',
      deeper:
        'The gap is the whole story. An L1 cache hit costs about 4 CPU cycles; a {{cache miss}} out to main memory costs a few hundred. A modern core runs thousands of cycles per microsecond, so a single missed load can cost more than a hundred thousand instructions the CPU could have run in the time it spent waiting. Everything expensive in software design is downstream of that ratio. It is why walking an array in order is fast and chasing pointers is slow: an array is already in memory in order, so each access is likely to land in the same line as the last, while a linked list scatters every element and pays a full miss per hop. It is why a program doing identical arithmetic to another can be ten times slower purely because of the order it touches memory. And it is why CPU designers spend most of the chip on cache, since SRAM needs several transistors per bit and so cannot be made much larger than it already is. The 1994 Pentium division bug is the sharpest reminder that this layer is real rather than a diagram. Intel replaced the 486\'s shift-and-subtract divider with a faster algorithm, whose lookup table had 2,048 cells of which 1,066 should have held one of five values; a fabrication step left five cells that should have held +2 holding zero instead. Thomas Nicely found the resulting error at Lynchburg College in 1994, and dividing 4,195,835 by 3,145,727 gives a result wrong from the fifth significant digit - rare enough that Byte estimated one error in nine billion divisions, but real enough that Intel took a $475 million pre-tax charge and recalled the chips in December 1994, the first full recall of a computer processor.',
      matters:
        'It changes what "optimise this" means. Before this level the instinct is to reduce the number of operations, which is what an algorithmic improvement does. After it, the second question is always where the data is, because a program doing fewer operations in the wrong order can lose to one doing more in the right order.',
      status: 'measured',
      source:
        'Intel\'s $475 million pre-tax charge and the 1-in-9-billion division error estimate: Wikipedia, "Pentium FDIV bug", citing Intel\'s 1994 annual report and Byte.',
      sourceUrl: 'https://en.wikipedia.org/wiki/Pentium_FDIV_bug',
    },
    {
      id: 'programming',
      name: 'Programming',
      simple:
        'Your code is not what runs. A {{compiler}} translates it, and because the language defines what a correct program must never do, the compiler is allowed to delete anything that could only happen if you had already broken that promise - including your own safety checks.',
      deeper:
        'This is the strangest thing in the subject and the hardest to believe on first hearing, so it is worth being concrete. In C and C++, reading past the end of an array is {{undefined behaviour}}: the language specifies no result at all, rather than a wrong one. That licence propagates. Because a correct program never reads out of bounds, any branch whose only purpose was to catch an out-of-bounds read is provably dead, and the compiler may remove it. This is not theoretical - CERT has a vulnerability note, VU#162289, titled "C compilers may silently discard some wraparound checks", warning that compilers were eliminating overflow guards, and the standard\'s own definition of undefined behaviour permits a compiler to do anything, in the phrase that circulated through comp.std.c, including "to make demons fly out of your nose". The same licence lets a compiler delete a null check it can prove is redundant, and has let real optimisations remove security-relevant code from the Chromium source tree. The practical consequence is that a program can be correct when you read it and wrong when it runs, with the difference being an assumption the compiler made on your behalf and never told you. This is also the dividing line between language families: Java, C# and JavaScript specify behaviour for out-of-bounds and null access and throw instead of leaving it undefined, so their programs behave the same everywhere. Rust checks at compile time, so the class of bug never gets to exist.',
      matters:
        'It changes how you read a crash report, because the crash you are looking at may not be where the bug is - code earlier in the program may have done something the compiler was licensed to assume never happens, and every optimisation after that point reasons from a false premise. It also explains why "it works on my machine" and "it works in release builds" are different failure modes rather than the same one, since release builds are the ones that turn optimisation on. The habit that follows is to compile with the undefined-behaviour sanitiser, which finds these while running rather than leaving them to the optimiser.',
      status: 'proved',
      source:
        'CERT VU#162289, "C compilers may silently discard some wraparound checks"; ISO/IEC 9899 §J.2 lists undefined behaviour.',
      sourceUrl: 'https://en.wikipedia.org/wiki/Undefined_behavior',
    },
    {
      id: 'computer-networks',
      name: 'Computer Networks',
      simple:
        'Sending a small message across the internet can cost exactly 40 milliseconds for no reason a user can see. Two rules designed by different people, who never agreed with each other, each wait for the other to go first.',
      deeper:
        'The 40 milliseconds is not a design target; it is a timer meeting a timer, and neither side knows about the other. Nagle\'s algorithm, published as RFC 896 in 1984 by John Nagle while working at Ford Aerospace, exists to stop an application that emits one byte at a time from filling the network with tiny packets, each carrying a 40-byte TCP plus IPv4 header to deliver one useful byte. It holds a second small packet back until the first is acknowledged. TCP also has a delayed acknowledgement, introduced around the same period by a different group, which lets the receiver wait before acknowledging - to piggyback its acknowledgement on data it is about to send its own way. Now put an application that writes a header and then a body, on a link where the first small write is already in flight: Nagle holds the body because the header is unacknowledged, and the receiver delays acknowledging the header because delayed ACK says it may. Both hold, waiting for the other. Nothing happens until a timer expires, and that timer on Linux is 40 milliseconds. The exchange costs several orders of magnitude more than the network physically requires. The fix is not a faster network but telling the socket TCP_NODELAY, or using UDP, or restructuring the code so there is no second small write. Every one of those is a workaround for two correct decisions made by programs that cannot see each other.',
      matters:
        'It teaches that a delay in a system need not have a cause you can find by searching for something slow, and that a 40-millisecond floor appearing only under small messages is a protocol interaction rather than congestion. It is why latency-sensitive software ends up carrying its own socket options, and why "the network is slow" is often the wrong first question.',
      status: 'machine-dependent',
      source:
        'Nagle\'s algorithm: RFC 896 (1984), "Congestion Control in IP/TCP Internetworks", John Nagle. The delayed-ACK interaction and the TCP_NODELAY workaround: Wikipedia, "Nagle\'s algorithm".',
      sourceUrl: 'https://en.wikipedia.org/wiki/Nagle%27s_algorithm',
    },
  ],
};

export default LEVEL_1;
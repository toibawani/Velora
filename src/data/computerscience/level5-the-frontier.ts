import { CsLevel } from './schema';

/**
 * Level 5: the frontier, and the arguments still being had about it.
 *
 * The level where the 'contested' label does the most work. Both entries here
 * have a published claim on one side and a published objection on the other,
 * which is the honest shape of a live disagreement and quite different from a
 * field quietly converging or an author asserting something.
 *
 * Quantum computing is here with two sources pointing opposite ways on purpose.
 * It is the strongest example in the subject of a headline number that depends
 * entirely on assumptions nobody had publicly contested until after publication,
 * and a reader who has seen only one side of it has been told something
 * misleading without anyone lying.
 */
const LEVEL_5: CsLevel = {
  id: 'the-frontier',
  number: 5,
  title: 'The frontier, and the arguments',
  blurb: 'Quantum advantage, and what a correct program still fails at.',
  intro:
    'Everything so far has been settled one way or another. This level holds the two entries in the subject where competent people disagree in print, and in both cases the disagreement is not about the underlying physics or the underlying code - it is about what a number means. That is the last and hardest thing this subject teaches: that a claim can be true, measured, and still not settle the question it was measured for.',
  entries: [
    {
      id: 'quantum-computing',
      name: 'Quantum Computing',
      simple:
        'A quantum processor can hold a state that is a combination of all its possible answers at once - but you cannot read that combination. So the advantage only appears in problems arranged so the right answer is the one you are likely to measure, and whether any useful problem is like that is still argued about.',
      deeper:
        'The contested claim is specific and both sides are on the record. In October 2019 Google\'s Nature paper "Quantum supremacy using a programmable superconducting processor" reported that its Sycamore processor, using 53 of 54 {{qubit}}s to create a state space of dimension 2^53, about 10^16, took roughly 200 seconds to sample one instance of a random quantum circuit a million times, and that the equivalent task on a state-of-the-art classical supercomputer would take approximately 10,000 years. Within days, IBM published a rebuttal by Pednault, Maslov, Gunnels and Gambetta arguing the classical cost was about 2.5 days - and not on a better machine, but on an ordinary one. Their argument was about what counts as a resource: Google\'s estimate rested on a Schrodinger-Feynman simulation that needed the full state vector to fit in RAM, and IBM pointed out that it could trade RAM for disk, because nobody had objected to the assumption before the paper was published. This is not one side being wrong and the other right, and it is not anyone misstating a fact. It is an enormous reported speedup resting on an unexamined assumption about hardware, which is why the field now argues explicitly about whether "advantage" should mean what Preskill intended in 2012: a task classical computers cannot do at all. What nobody disputes is that {{superposition}} cannot be read directly and that {{decoherence}} cannot be engineered away, only bought back with many more physical qubits than logical ones. That last constraint is why the useful question is not how fast a qubit is but how many are needed per useful one.',
      matters:
        'It is the best available lesson in reading a number from a press release, and the lesson is not general scepticism - it is that "10,000 years faster" and "2.5 days faster" were both true statements about different assumptions neither party had published. It also reframes quantum computing away from the speed question that generates headlines: with no agreed advantage and a hard physical constraint on error correction, the live questions are about scale and error, not clock speed.',
      status: 'contested',
      source:
        'Google: Arute et al., "Quantum supremacy using a programmable superconducting processor", Nature 574, 505-510 (23 Oct 2019) - 53 qubits, ~200 s, ~10,000-year classical estimate. IBM rebuttal: Pednault, Maslov, Gunnels and Gambetta, "On \'quantum supremacy\'", IBM (22 Oct 2019) - 2.5-day classical estimate using secondary storage.',
      sourceUrl: 'https://www.nature.com/articles/s41586-019-1666-5',
    },
    {
      id: 'cybersecurity',
      name: 'Cybersecurity',
      simple:
        'Most serious breaches are not clever. Heartbleed was one missing length check, and it sat in code used by most of the internet for two years - not because anyone hid it, but because almost nobody was paid to read it.',
      deeper:
        'The specific bug is worth stating because it is so ordinary. The TLS heartbeat extension lets a client ask a server "is this connection alive?" and specifies a payload length. The server copies that many bytes back from its own memory into the reply. It never checked that the client\'s claim about the length matched what the client had actually sent, so an attacker could ask for 64KB and receive whatever happened to be in the server\'s memory - private keys, session cookies, other users\' data. It is a missing bounds check on an attacker-controlled integer: the exact shape of a {{buffer overflow}}, without the overflow. It was reported on 7 April 2014 and attributed to Neel Mehta at Google Security and independently to Riku, Antti and Matti at Codenomicon; OpenSSL was patched within days, and because the bug was in the library rather than in any application, no amount of patching the applications would have helped until the library itself was rebuilt and every certificate reissued. The part that made it matter was not technical. OpenSSL was maintained by a handful of volunteers, one of whom worked full time, on roughly US$2,000 a year of donations - and it secured a large share of the web. In the two or three days after disclosure, around US$841 was donated, and Dan Kaminsky, who had worked on exploiting it, commented on building the most important technologies for the global economy on shockingly underfunded infrastructure. Google founded Project Zero in response, and the Linux Foundation announced the Core Infrastructure Initiative on 24 April 2014. A CVSS 7.5 vulnerability with a two-year window is not a story about sophisticated attackers. It is a story about {{memory safety}} and {{privilege}} being delegated to whoever could afford to audit them.',
      matters:
        'It relocates the cause of most breaches from technical ingenuity to economic and structural choices, which is the opposite of the popular picture and much more actionable: knowing this does not make you able to stop an attacker, but it tells you where effort actually goes. It is also the clearest case in the subject of "correct" and "safe" being different properties - the code did exactly what the specification asked, and the specification was wrong.',
      status: 'proved',
      source:
        'Heartbleed, CVE-2014-0160: reported 7 April 2014 by Neel Mehta (Google Security) and independently by Riku, Antti and Matti (Codenomicon). CVSS 3.1 base score 7.5 HIGH. OpenSSL funding figures, the US$841 raised over 2-3 days, and the Core Infrastructure Initiative announced 24 April 2014: Wikipedia, "Heartbleed".',
      sourceUrl: 'https://en.wikipedia.org/wiki/Heartbleed',
    },
  ],
};

export default LEVEL_5;
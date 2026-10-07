import { CsLevel } from './schema';

/**
 * Level 3: several machines pretending to be one.
 *
 * This is the level that gets the deepest treatment in the subject and the
 * reason is worth stating, because it is not a narrative reason. Everything above
 * it describes something you can build and measure. This level is about
 * something you cannot build, and the results are strong enough that a
 * generation of engineers have spent careers trying to route around them and
 * have not. That asymmetry - an established negative result as load-bearing as
 * any positive one - is what this subject contributes that the other three in
 * this app cannot, so it gets the space.
 *
 * Two entries rather than one because the two results are different in kind. FLP
 * is a proof about what is impossible; the two-generals problem is the intuition
 * underneath the proof, and can be understood with no mathematics at all, which
 * makes it the better entry for a reader meeting the idea once.
 */
const LEVEL_3: CsLevel = {
  id: 'many-machines',
  number: 3,
  title: 'Many machines, one answer',
  blurb: 'What two or more computers can never quite agree on.',
  intro:
    'One machine that fails is a crash you can restart. Several machines that must agree on a single value, where some may fail, slow down, or be cut off from each other, is a genuinely different problem - and a surprising amount of it is settled by proofs that no clever implementation can overturn. These are the results most worth knowing in this subject, and the first is the reason the second exists.',
  entries: [
    {
      id: 'two-generals-problem',
      name: 'The Two Generals Problem',
      simple:
        'Two people must both be sure they agree before they attack, but a message can arrive and its acknowledgement can be lost. Prove they agree and it becomes arithmetic rather than communication: more rounds of confirmation shrink the chance of being wrong but never reach zero.',
      deeper:
        'Walk it through once and the result is not a proof, it is just bookkeeping. The general sends "attack at dawn". The general receives it and sends "acknowledged". Now suppose that acknowledgement is lost in a storm - not the message, the reply. The first general cannot distinguish "my message arrived and the reply vanished" from "my message never arrived", so he cannot know whether to attack. If he stays home and the message did arrive, he has failed. If he attacks and it did not, he has failed alone, and the whole army dies with him. So he must send confirmation, and the second general must confirm the confirmation, and the same dilemma reappears at every level. Each round genuinely does reduce the uncertainty - three rounds leaves a failure probability of one in eight - but it never reaches zero, because any finite chain of confirmations has a last link that can be the one that fails. That is the two-generals problem, and it is why distributed systems theory is largely a study of what you have to give up. The practical escape is not a better protocol but a decision about which failure you tolerate: at some point you act on the best information you have rather than on certainty, and what you have chosen to give up gets written down as the consistency-availability trade-off.',
      matters:
        'It is the intuition sitting underneath the next entry, and it explains why that entry\'s theorem has no exceptions. It is also the correct mental model for anything a reader has done without realising - pressing send and wondering whether it arrived, running a job on two machines "just in case", retrying a payment you are not sure about. The answer is always that certainty is unreachable and you are choosing which failure to prefer, and the choice should be deliberate.',
      status: 'proved',
      source:
        'The two-generals problem as the standard intuitive basis for distributed agreement; formalised in the consistency-availability work of Gilbert and Lynch, and discussed throughout Lamport\'s work on agreement.',
      sourceUrl: 'https://en.wikipedia.org/wiki/Two_generals_problem',
    },
    {
      id: 'distributed-systems',
      name: 'Distributed Systems',
      simple:
        'There is provably no algorithm that lets independent machines agree on one value when some may crash and there is no reliable way to tell a crashed machine from a slow one. This is a proof, not a limitation of current engineering.',
      deeper:
        'This is the FLP result, from "Impossibility of Distributed Consensus with One Faulty Process", published by Fischer, Lynch and Paterson in 1985 in the Journal of the ACM, and it is the single most consequential thing in this subject. Its shape: take a system of machines with no bound on message delays - which is the actual condition on any real network - and require them to agree on one value while some may crash. Then no deterministic algorithm can guarantee both that they eventually decide and that no two correct machines ever decide differently. Read that carefully, because the impossibility is narrower than its reputation: it concerns guaranteeing that agreement always happens. Systems that assume messages arrive within some bounded time escape it, which is why real systems use timeouts and real deployments work. What cannot be escaped is the trade-off, and the usual response is to prefer refusing a request over serving one that might be stale - the consistency-availability choice Gilbert and Lynch formalised, where during a {{network partition}} a system must either refuse or risk handing back data that a newer write has already replaced. The second of the 2f+1 machines in a group of that size is not padding either: with f machines that may fail you need 2f+1, so a minority can never be mistaken for a majority.',
      matters:
        'It is the difference between "this system has a bug" and "this system is doing what the theory says it must". A reader who knows FLP stops diagnosing the same trade-off as a failure and starts seeing it as the shape of the problem. It also explains the otherwise baffling design choices in real infrastructure - three replicas instead of two, refusing reads during an outage, clock-based leases - as consequences rather than as conservatism.',
      status: 'proved',
      source:
        'Fischer, Lynch and Paterson, "Impossibility of Distributed Consensus with One Faulty Process", Journal of the ACM 32(2), 1985. Consistency-availability framing: Gilbert and Lynch, SIGACT News 33(2), 2002.',
      sourceUrl: 'https://dl.acm.org/doi/10.1145/3149.214121',
    },
  ],
};

export default LEVEL_3;
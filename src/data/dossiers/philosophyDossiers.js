/**
 * Philosophy dossiers.
 *
 * Each of these is a live argument with positions that can be stated, attacked
 * and defended, not a summary of "what philosophers think". The essays name the
 * strongest objection to the position they spend most time on, because a
 * philosophy essay that only presents one side is advocacy, not explanation.
 */

export const PERSONAL_IDENTITY_DOSSIER = {
  id: 'personal-identity',
  title: 'What Makes You the Same Person?',
  standfirst:
    'Your body replaces most of its atoms, your memories fade and your beliefs change. Yet you are legally and morally the same person you were at ten. Derek Parfit argued that the question has no deep answer, and that this should change how you think about your own future.',
  field: 'Philosophy',
  lenses: ['Mind & Machine', 'Meaning'],
  status: 'Open philosophical problem; Parfit’s reductionism is influential and contested',
  difficulty: 'Intermediate',
  minutes: 24,
  opening:
    'Suppose your brain were split and each half transplanted into a new body. Both resulting people wake up with your memories, your personality and your plans. Which one is you? If you say both, you have accepted that one person can become two, which ordinary identity forbids. If you say neither, you have denied that psychological continuity is enough. If you say one, you need a reason to pick, and there is none. Parfit used this case to argue that personal identity is not a further fact about the world, but a matter of degree.',
  sections: [
    {
      kind: 'prose',
      heading: 'The question, and why it is not about DNA',
      body: [
        'Personal identity is the question of what makes a person at one time the same person as a person at another time. It is not the same as bodily continuity, because bodies change. It is not the same as genetic continuity, because identical twins are different people. The philosophical problem is to say what the relation is, and why it matters — why it grounds responsibility, promise-keeping, self-interest and grief.',
        'John Locke proposed in 1690 that personal identity consists in continuity of consciousness, specifically memory: you are the same person as someone in the past if you can remember their experiences as your own. The view has obvious problems. You cannot remember being an infant, yet you are the same person. False memories would make you identical with someone you never were. And memory presupposes identity: to remember an experience as mine, I already need to know it was mine. Later psychological-continuity theories try to fix this by appealing to overlapping chains of memory, intention and character rather than direct recall.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of the debate',
      items: [
        {
          term: 'Personal identity',
          definition:
            'The relation that makes a person at one time the same person as a person at another time. It is what grounds first-person persistence and much of our moral practice.',
        },
        {
          term: 'Psychological continuity',
          definition:
            'Overlapping chains of memory, intention, belief and character that connect a later person to an earlier one. It is the main rival to bodily continuity.',
        },
        {
          term: 'Reductionism about persons',
          definition:
            'The view that a person’s existence over time is nothing over and above the holding of certain psychological and physical relations. There is no further fact of identity.',
        },
        {
          term: 'Fission',
          definition:
            'A thought experiment in which one person divides into two psychologically continuous successors. It is the hardest case for any theory that says identity is what matters.',
        },
        {
          term: 'Thought experiment',
          definition:
            'A hypothetical case used to test a principle by isolating the variable that matters. It is an argument tool, not evidence about the actual world.',
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'Parfit’s fission argument',
      body: [
        'Parfit’s method is to take cases where psychological continuity holds but identity is unclear, and ask what we care about. In the fission case, both successors are psychologically continuous with you. If identity is what matters, then you cannot survive as both, because you cannot be two people. But it would be absurd to say that you survive as neither, since each successor has everything you cared about. The natural conclusion is that identity is not what matters; what matters is psychological connectedness, and it can hold to a degree, and it can branch.',
        'The same structure appears in the teletransporter case. You are scanned, the information is transmitted, and a new body is assembled at the destination while the original is destroyed. Is the person who arrives you? If you say yes, you accept that identity can survive a discontinuity in bodily matter. If you say no, you must explain why the copy is not you when it has all your memories and projects. Parfit’s answer is that the question “is it really me?” has no further fact behind it. There is only the holding of psychological relations, and whether we call that survival is a choice about words.',
      ],
    },
    {
      kind: 'table',
      heading: 'The cases, and what each theory says',
      columns: ['Case', 'Bodily continuity', 'Psychological continuity', 'Parfit’s verdict'],
      rows: [
        ['Ordinary ageing', 'Yes, gradually', 'Yes, with gaps', 'Survival; identity is not a further fact'],
        ['Total amnesia', 'Yes', 'No', 'The person survives biologically, but what mattered is largely gone'],
        ['Teletransport', 'No', 'Yes, with a gap', 'Survival in the sense that matters, if the copy is exact'],
        ['Fission into two', 'No', 'Yes, branching', 'Not identity, but survival as two successors'],
        ['Brain transplant', 'No', 'Yes', 'The recipient has the psychological continuity; identity is not the point'],
      ],
      note:
        'The table is a map of intuitions, not a proof. Different theories will fill the cells differently, and the disagreements are often about which case is the clearest rather than about the facts.',
    },
    {
      kind: 'misconception',
      heading: 'What Parfit is not saying',
      claim: '"Parfit says the self is an illusion, so nothing matters and you can do whatever you want."',
      correction:
        'Parfit’s conclusion is not that persons do not exist; it is that their identity over time is not a further fact beyond psychological and physical continuity. He argued the opposite of nihilism: because your future self is less separate from you than ordinary thinking assumes, concern for your future is rational, and because the boundaries between persons are less sharp, concern for others is also rational. The ethical upshot is expansion, not dissolution. The "nothing matters" reading mistakes a metaphysical reduction for a moral one.',
    },
    {
      kind: 'prose',
      heading: 'The strongest objections',
      body: [
        'The first objection is that Parfit’s cases are too bizarre to trust. Fission and teletransportation are not possible with current technology, and our intuitions about them may be unreliable. Parfit replies that the cases are designed to isolate a variable, and that the same questions arise in ordinary life: dementia, coma, gradual personality change. The bizarre cases make the structure visible.',
        'The second is animalism, defended by Eric Olson: we are biological organisms, and personal identity is the continuity of the living organism, not of psychology. On this view, a person in a persistent vegetative state is still the same person, even with no psychological continuity, because the organism persists. Parfit’s account struggles with this; animalism struggles with fission and with the intuition that severe dementia can end a person while the organism lives. Neither side has a decisive advantage, which is why the problem is still open.',
        'The third is practical: if identity is not what matters, why do we hold people responsible for acts committed decades ago? Parfit’s answer is that responsibility tracks psychological connectedness, and that punishment can be justified by deterrence and reform rather than by metaphysical sameness. Whether that is enough is a live question in philosophy of law.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If psychological continuity is what matters, how much continuity is enough to ground a promise?',
        'Does the fission case show that identity is not what matters, or that our concept of identity is incoherent?',
        'What would animalism imply about the moral status of a person in a persistent vegetative state?',
        'If your future self is a different person in a reduced sense, what does that do to prudence?',
      ],
    },
  ],
  sources: [
    { label: 'J. Locke, An Essay Concerning Human Understanding, Book II, Chapter 27 (1690), Project Gutenberg edition', url: 'https://www.gutenberg.org/ebooks/10615' },
    { label: 'D. Parfit, Reasons and Persons (Oxford, 1984), Part III', url: 'https://global.oup.com/academic/product/reasons-and-persons-9780198249085' },
    { label: 'E. T. Olson, The Human Animal: Personal Identity Without Psychology (Oxford, 1997)', url: 'https://global.oup.com/academic/product/the-human-animal-9780198751519' },
    { label: 'S. Shoemaker, Self-Knowledge and Self-Identity (Cornell University Press, 1963)', url: 'https://archive.org/details/selfknowledgesel00shoe' },
  ],
  related: ['epistemic-injustice', 'is-ought-gap', 'predictive-processing'],
};

export const EPISTEMIC_INJUSTICE_DOSSIER = {
  id: 'epistemic-injustice',
  title: 'Epistemic Injustice',
  standfirst:
    'When a patient is not believed about their own pain, or a woman is treated as unreliable because she is a woman, something has gone wrong with knowledge, not only with manners. Miranda Fricker gave the phenomenon a name and a structure.',
  field: 'Philosophy',
  lenses: ['Mind & Machine', 'Meaning'],
  status: 'Established framework; its measurement and scope are debated',
  difficulty: 'Intermediate',
  minutes: 22,
  opening:
    'Imagine you are in pain and the doctor decides you are exaggerating. Or you are the only woman in a meeting and your suggestion is ignored until a man repeats it. Or you are trying to describe an experience — sexual harassment, say — for which your culture has no word, and you cannot make yourself understood. These are not just unfair. They are failures in the production and circulation of knowledge, and Miranda Fricker’s 2007 book gave them a shared analysis under the name epistemic injustice.',
  sections: [
    {
      kind: 'prose',
      heading: 'Two kinds of injustice',
      body: [
        'Fricker distinguishes testimonial injustice from hermeneutical injustice. Testimonial injustice happens when a speaker’s credibility is reduced because of an identity prejudice: the hearer gives less weight to what the speaker says because of who they are. The classic example is the woman whose testimony is dismissed as emotional, or the Black patient whose report of pain is under-treated. The prejudice need not be conscious; it can be implicit and structural.',
        'Hermeneutical injustice happens when someone is unable to understand or communicate their own experience because the collective interpretive resources are inadequate. Fricker’s example is sexual harassment before the concept existed: women experienced it, but lacked the shared vocabulary to name it as a wrong, which made it harder to report, resist or even recognise. The injustice is not that an individual hearer disbelieves them; it is that the culture has not given them the tools to make the experience intelligible.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of the framework',
      items: [
        {
          term: 'Epistemic injustice',
          definition:
            'A wrong done to someone specifically in their capacity as a knower or a communicator. It includes being disbelieved, being unable to articulate an experience, and being excluded from the production of knowledge.',
        },
        {
          term: 'Testimonial injustice',
          definition:
            'A credibility deficit imposed on a speaker because of an identity prejudice. The speaker’s word is given less weight than it deserves.',
        },
        {
          term: 'Hermeneutical injustice',
          definition:
            'A gap in the shared concepts and vocabulary that makes it difficult for someone to understand or express their own experience.',
        },
        {
          term: 'Credibility deficit',
          definition:
            'The gap between the credibility a speaker should receive and the credibility they actually receive. It is the mechanism of testimonial injustice.',
        },
        {
          term: 'Standpoint theory',
          definition:
            'The view that marginalised positions can afford epistemic advantages, because people who are excluded may see structural features that the privileged have reasons to miss.',
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'Why it is epistemic, not merely ethical',
      body: [
        'It might seem that being disbelieved is just a matter of disrespect. Fricker’s argument is stronger: credibility judgments are part of how knowledge is produced. If a reliable speaker is systematically given less credibility, the community’s pool of justified belief is poorer. Medical evidence is missed, workplace problems go unreported, and entire areas of experience are under-described. The harm is not only to the individual; it is to the accuracy of the collective picture.',
        'This is why the framework has been taken up in medicine, law, education and engineering. In medicine, testimonial injustice can delay diagnosis, especially for pain and conditions that are more common in women. In law, it can shape whose account is believed in court. In engineering, it can determine whose safety concerns are treated as technical requirements and whose are treated as complaints. The concept gives these disparate failures a common structure.',
      ],
    },
    {
      kind: 'table',
      heading: 'The two kinds, side by side',
      columns: ['', 'Testimonial', 'Hermeneutical'],
      rows: [
        ['What goes wrong', 'A hearer gives too little credibility', 'The shared concepts are inadequate'],
        ['Who is wronged', 'The speaker, in a particular exchange', 'The speaker, through a gap in the culture'],
        ['Example', 'A woman’s report of pain is discounted', 'Harassment before the concept existed'],
        ['Remedy', 'Virtuous hearing; institutional checks on credibility', 'Conceptual innovation; marginalised voices in theory-building'],
        ['Hard case', 'When the speaker really is unreliable', 'When the gap is real but not anyone’s fault'],
      ],
      note:
        'The hard cases matter. A credibility judgment can be correct and still be shaped by prejudice, and a conceptual gap can close over time without anyone being blameworthy. The framework is about structural patterns, not about identifying villains in each exchange.',
    },
    {
      kind: 'misconception',
      heading: 'Two ways to dismiss it',
      claim: '"Epistemic injustice is just identity politics: sometimes people are rude, and sometimes they are wrong."',
      correction:
        'Rudeness is an interaction; epistemic injustice is a pattern in the distribution of credibility and concepts. The claim is empirical as well as normative: it predicts that credibility deficits will track identity categories, that they will affect knowledge production, and that they will persist even when individual hearers are well-meaning. Those predictions can be tested, and they have been, in studies of pain treatment, hiring, peer review and classroom participation. One can disagree about the explanation or the remedy without reducing the phenomenon to bad manners.',
    },
    {
      kind: 'prose',
      heading: 'The objections that matter',
      body: [
        'The first objection is measurement. Credibility is not directly observable, and experiments that manipulate identity cues can be criticised for artificiality. The response is to triangulate: laboratory studies, audit experiments, interviews and institutional data. No single method settles it, but the pattern is robust across methods.',
        'The second is the risk of epistemic paternalism. If hearers are told to adjust credibility upward for some groups, they may overcorrect and believe unreliable speakers. Fricker’s own remedy is virtue-based: cultivate the habit of correcting for prejudice in particular cases, rather than applying a blanket rule. Critics argue that virtue is too slow and too individual; structural remedies, such as blinding and diverse panels, may be more effective.',
        'The third is the boundary problem. If every epistemic failure involving identity counts as epistemic injustice, the concept becomes too broad to explain anything. Fricker’s definition is narrower: the wrong must be done in the capacity as a knower, and it must be systematic. Keeping that boundary is what makes the framework useful.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'Can a hearer commit testimonial injustice without intending to, and does intention matter for blame?',
        'Who gets to decide that a conceptual gap has been closed?',
        'Is credibility a property of the speaker, the hearer, or the relationship between them?',
        'What would an institution look like if it took epistemic injustice seriously in its procedures?',
      ],
    },
  ],
  sources: [
    { label: 'M. Fricker, Epistemic Injustice: Power and the Ethics of Knowing (Oxford, 2007)', url: 'https://global.oup.com/academic/product/epistemic-injustice-9780198237907' },
    { label: 'K. Dotson, "Tracking epistemic violence, tracking practices of silencing", Hypatia 26, 236 (2011)', url: 'https://doi.org/10.1111/j.1527-2001.2011.01177.x' },
    { label: 'J. Medina, The Epistemology of Resistance (Oxford, 2013)', url: 'https://global.oup.com/academic/product/the-epistemology-of-resistance-9780199929047' },
    { label: 'H. Carel and I. J. Kidd, "Epistemic injustice in healthcare: a philosophical analysis", Medicine, Health Care and Philosophy 17, 529 (2014)', url: 'https://doi.org/10.1007/s11019-014-9560-2' },
  ],
  related: ['personal-identity', 'is-ought-gap', 'predictive-processing'],
};

export const IS_OUGHT_DOSSIER = {
  id: 'is-ought-gap',
  title: 'The Is–Ought Gap',
  standfirst:
    'No set of statements about what is the case, by itself, entails a statement about what ought to be. Hume noticed the slip in 1739, and the gap has been the central fault line in moral philosophy ever since.',
  field: 'Philosophy',
  lenses: ['Logic', 'Meaning'],
  status: 'Widely accepted as a logical point; its metaethical significance is contested',
  difficulty: 'Advanced',
  minutes: 23,
  opening:
    'Read a description of the world: atoms, brains, suffering, cooperation, evolution. Now try to derive a moral conclusion from it — that you ought to help, or that pain is bad, or that equality matters. The derivation always seems to need one more premise, and that premise is already evaluative. David Hume noticed the transition in A Treatise of Human Nature and asked how it could be justified. The question is still open, and the answers divide moral philosophy into schools.',
  sections: [
    {
      kind: 'prose',
      heading: 'What Hume actually wrote',
      body: [
        'The passage is short and often quoted out of context. Hume observes that writers move from statements about what is the case — about God, or human affairs — to statements about what ought or ought not to be done, without explaining the transition. He suggests that this small step deserves attention, because it implies something about the relation between vice and virtue. He does not say that moral conclusions are subjective, or that science cannot inform ethics. He says that the inference needs a justification that is usually missing.',
        'The logical point is often put as follows: from premises containing only descriptive terms, no conclusion containing an evaluative term follows. That is not a theorem about English; it is a claim about the meaning of the terms. If "good" meant the same as some descriptive predicate, the inference would go through. The is–ought gap is therefore tied to the open-question argument, Moore’s claim that no natural property can be analytically equivalent to goodness.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of the gap',
      items: [
        {
          term: 'Is–ought gap',
          definition:
            'The logical gap between descriptive premises and evaluative conclusions. It is often attributed to Hume, although his own formulation is more cautious than the slogan suggests.',
        },
        {
          term: 'Naturalistic fallacy',
          definition:
            'Moore’s term for the mistake of defining goodness in terms of a natural property, such as pleasure or evolutionary fitness. It is related to, but not the same as, the is–ought gap.',
        },
        {
          term: 'Moral realism',
          definition:
            'The view that there are moral facts, independent of what anyone believes or desires. Realists need an account of how those facts are grounded and how we can know them.',
        },
        {
          term: 'Expressivism',
          definition:
            'The view that moral statements express attitudes or commitments rather than describe facts. It avoids the gap by denying that moral conclusions are factual claims in the first place.',
        },
        {
          term: 'Thick concept',
          definition:
            'A concept that is both descriptive and evaluative, such as "cowardly" or "generous". Thick concepts complicate the is–ought distinction because they seem to cross it.',
        },
      ],
    },
    {
      kind: 'table',
      heading: 'How the main positions respond',
      columns: ['Position', 'Response to the gap', 'Cost'],
      rows: [
        ['Moral realism', 'There are moral facts; the gap is bridged by further normative premises', 'Must explain what those facts are and how we know them'],
        ['Expressivism', 'Moral statements express attitudes, not descriptions', 'Must explain moral reasoning and disagreement without truth'],
        ['Kantian constructivism', 'Reason itself generates the moral law', 'Must show that the procedure is not question-begging'],
        ['Naturalism', 'Moral properties are natural properties, discovered a posteriori', 'Must avoid the open-question argument'],
        ['Error theory', 'Moral claims are false because there are no moral facts', 'Must explain why moral discourse is so useful and persistent'],
      ],
      note:
        'The table is a map of the options, not a vote. Each position has sophisticated defenders, and the disagreements are often about which cost is acceptable rather than about the logical point itself.',
    },
    {
      kind: 'misconception',
      heading: 'What the gap does not prove',
      claim: '"Hume proved that morality is subjective, so moral views are just opinions."',
      correction:
        'The gap is a claim about logical inference, not about the metaphysics of morality. It says that descriptive premises alone do not entail evaluative conclusions; it does not say there are no moral facts, and it does not say moral claims are merely expressions of feeling. Moral realists can accept the gap and argue that moral facts are known through reason or intuition. Expressivists accept it and give a different account of moral language. The gap narrows the options; it does not pick one.',
    },
    {
      kind: 'misconception',
      heading: 'And the other',
      claim: '"The naturalistic fallacy means that any appeal to nature is wrong."',
      correction:
        'That is the appeal-to-nature fallacy, a different mistake. Moore’s naturalistic fallacy is about defining goodness in terms of a natural property, which would make "good" synonymous with, say, "pleasant". It does not follow that facts about nature are irrelevant to ethics. Biology, psychology and economics can inform moral reasoning by telling us what consequences actions have, what humans need, and what is possible. The gap says that the facts alone do not settle the value; it does not say the facts are useless.',
    },
    {
      kind: 'prose',
      heading: 'The attempts to bridge it',
      body: [
        'John Searle argued in 1964 that a promise generates an obligation by definition: if you promised, you ought to keep it. The argument was widely discussed and widely criticised. The critics pointed out that the conclusion depends on the institution of promising, and that the descriptive premise "you promised" already contains the normative commitment. The debate is a useful case study in how the gap reappears at the level of institutional facts.',
        'Philippa Foot argued that moral evaluation is grounded in human needs and flourishing, so that facts about what humans require can support evaluative conclusions about virtues. Her naturalism is sophisticated, and it does not claim to derive ought from is without any evaluative premise; it claims that the relevant facts are already evaluative because they concern harm and flourishing. Whether that counts as a bridge or a relocation of the gap is exactly the dispute.',
        'The most influential response in the last century has been expressivism, developed by Blackburn and Gibbard. On this view, moral statements express commitments and prescribe actions rather than describe facts, so the is–ought gap is not a gap at all: the two kinds of statement do different jobs. The cost is explaining moral truth, moral progress and the sense in which moral disagreement is about something. That cost is the live research programme.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If moral facts existed, what kind of fact would they be, and how would we detect them?',
        'Can a thick concept like "cruel" be used to derive an ought without a further evaluative premise?',
        'Does the gap apply to epistemic norms — can you derive "you ought to believe p" from descriptive facts about evidence?',
        'Why does the is–ought gap feel obvious to some philosophers and question-begging to others?',
      ],
    },
  ],
  sources: [
    { label: 'D. Hume, A Treatise of Human Nature, Book III, Part I, Section I (1739)', url: 'https://www.gutenberg.org/ebooks/4705' },
    { label: 'G. E. Moore, Principia Ethica (Cambridge, 1903)', url: 'https://www.gutenberg.org/ebooks/53430' },
    { label: 'J. Searle, "How to derive ought from is", Philosophical Review 73, 43 (1964)', url: 'https://doi.org/10.2307/2183201' },
    { label: 'P. Foot, Natural Goodness (Oxford, 2001)', url: 'https://global.oup.com/academic/product/natural-goodness-9780198235088' },
    { label: 'S. Blackburn, Ruling Passions (Oxford, 1998)', url: 'https://global.oup.com/academic/product/ruling-passions-9780198247852' },
  ],
  related: ['personal-identity', 'epistemic-injustice', 'godel-incompleteness'],
};

export const REPUGNANT_CONCLUSION_DOSSIER = {
  id: 'repugnant-conclusion',
  title: 'The Repugnant Conclusion',
  standfirst:
    'If a world of ten billion happy people is good, then a much larger world of people whose lives are barely worth living is better, provided there are enough of them. The argument is short, the conclusion is repellent, and every escape has a price.',
  field: 'Philosophy',
  lenses: ['Meaning', 'Infinity'],
  status: 'Open problem in population ethics; no agreed solution',
  difficulty: 'Advanced',
  minutes: 22,
  opening:
    'Derek Parfit published the argument in 1984, in the part of Reasons and Persons that he rewrote more than once and still called the hardest thing he had done. Compare two worlds. World A has ten billion people with lives that are very good. World Z has an enormous population, many times larger, whose lives are just worth living: no suffering that outweighs the good, but nothing much to celebrate either. If what matters is the total amount of well-being, then for a large enough population Z is better than A. Parfit called this the repugnant conclusion, and it has resisted forty years of attempts to avoid it.',
  sections: [
    {
      kind: 'prose',
      heading: 'The argument in four steps',
      body: [
        'The first step is mere addition. Take world A and add a second group of people whose lives are good but not as good as the first group\u2019s. The result, A+, contains more total well-being and no one is worse off, so A+ seems at least as good as A. The second step is that A+ can be rearranged, without changing anyone\u2019s welfare, into a world B with a larger population and a slightly lower average. The third step repeats the move: add more people, lower the average a little, and the total keeps rising as long as each added life is worth living. The fourth step is transitivity. If A+ is at least as good as A, and B is better than A+, and so on, then Z is better than A.',
        'Each step looks harmless. The conclusion is not. It says that a world packed with lives of minimal quality is better than a world of flourishing people, as long as the numbers are large enough. Notice what the argument does not assume: it does not assume that more people is always better, and it does not assume that quantity is the only good. It assumes that adding a life worth living is not bad, that a world with more total well-being is better when no one is worse off, and that better-than is transitive. Those three assumptions are difficult to deny one at a time.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of comparing worlds',
      items: [
        {
          term: 'Population ethics',
          definition:
            'The part of moral philosophy that compares outcomes with different numbers of people, including people who do not yet exist. It has to say whether bringing someone into existence can be good or bad for them.',
        },
        {
          term: 'Total view',
          definition:
            'The view that the value of an outcome is the sum of the well-being of everyone who exists in it. It implies the repugnant conclusion when added lives are worth living.',
        },
        {
          term: 'Average view',
          definition:
            'The view that what matters is average well-being, not the total. It avoids the repugnant conclusion but implies that adding happy people can be bad because it lowers the average.',
        },
        {
          term: 'Mere addition',
          definition:
            'Adding people whose lives are worth living, without making anyone else worse off. The mere addition paradox is that a world with more such people can seem both better and worse than the original.',
        },
        {
          term: 'Critical level',
          definition:
            'A threshold of well-being below which adding a life counts as a cost rather than a benefit. A critical-level view avoids the repugnant conclusion by refusing to count lives below the threshold as positive.',
        },
        {
          term: 'Person-affecting view',
          definition:
            'A view on which an outcome can only be better or worse if it is better or worse for some particular person. It struggles with choices that determine who exists at all.',
        },
      ],
    },
    {
      kind: 'math',
      heading: 'The arithmetic that makes the conclusion hard to escape',
      equation: 'V = N × (w − c)',
      symbols: [
        { symbol: 'V', meaning: 'The value of the world on a simple totalist or critical-level accounting' },
        { symbol: 'N', meaning: 'The number of people who exist, which can be increased by adding lives' },
        { symbol: 'w', meaning: 'The average well-being of those people, on a scale where zero is neutral and negative is a life not worth living' },
        { symbol: 'c', meaning: 'A critical level: the well-being below which a life counts as a cost. The total view sets c = 0' },
      ],
      body: [
        'On the total view, c = 0 and value is just population times average welfare. Take A with ten billion people at 100 units, and Z with a million times as many people at 1 unit. A is worth 10¹² units; Z is worth 10¹⁸. No amount of distaste changes the multiplication. Raising the critical level to c = 0.5 does not rescue A either: Z is still worth 5 × 10¹⁷, because the population multiplier is doing all the work.',
        'To block the conclusion you need a value function in which adding lives eventually stops adding value, or in which a loss of quality cannot be compensated by any increase in quantity. That is a lexical view: some goods are not tradeable against others at any exchange rate. Lexical views can avoid the repugnant conclusion, and they bring their own problems, because they must explain why a tiny change in quality can flip the ranking while a huge change in number cannot. The arithmetic is simple; the axiology that would licence a different answer is not.',
      ],
      assumptions: [
        'Well-being is being treated as measurable and comparable between people, which is itself a substantial assumption.',
        'The comparison holds population fixed except for the added lives. Real choices usually change who exists and how well, at the same time.',
        'The value function is welfarist: it depends only on the welfare of individuals, not on equality, autonomy, culture or anything else.'
      ],
    },
    {
      kind: 'table',
      heading: 'The escape routes, and what each one costs',
      columns: ['View', 'How it avoids the conclusion', 'The cost'],
      rows: [
        ['Total view', 'It does not; it implies the conclusion', 'The conclusion itself'],
        ['Average view', 'Values average welfare, so a larger population does not help', 'Adding happy people can be bad, and the view can favour extinction over a large mediocre population'],
        ['Critical level', 'Ignores well-being below a threshold', 'Can imply the very repugnant conclusion: many bad lives may be required to enable a few good ones'],
        ['Person-affecting', 'Only benefits and harms to existing people count', 'Cannot compare outcomes that bring different people into existence, which is most long-run choices'],
        ['Lexical / perfectionist', 'Quality cannot be traded against quantity at any rate', 'Must explain why a tiny quality difference outweighs any number of lives'],
      ],
      note:
        'The table is the argument. Each row buys an escape from Parfit\u2019s conclusion by accepting something else that is hard to defend. Arrhenius proved that no welfarist theory can satisfy a small set of conditions that each look independently plausible, which is why the problem is described as an impossibility result rather than a puzzle awaiting a clever fix.',
    },
    {
      kind: 'misconception',
      heading: 'What the argument is and is not saying',
      claim: '"The repugnant conclusion is a recommendation: it says we should maximise the number of people."',
      correction:
        'It is a reductio, not a policy. Parfit used it to show that the total view, which is the natural way to think about improving the world, leads somewhere he found unacceptable. He did not endorse the conclusion, and he spent decades looking for a theory that avoided it without abandoning the idea that adding a life worth living is a good thing. The second misunderstanding is that the argument depends on science fiction. It does not. Decisions about family size, migration, animal agriculture and climate policy all change how many beings exist and how well they live, so the question of how to compare those outcomes is already inside ordinary moral reasoning.',
    },
    {
      kind: 'prose',
      heading: 'Why it matters outside the seminar',
      body: [
        'The most immediate application is to choices that affect future generations. Climate policy changes the number of people who will exist and the quality of their lives, and the two effects point in different directions. A discount rate that treats distant lives as worth less can make almost any present sacrifice look irrational; a totalist view can make present sacrifice look obligatory regardless of who bears it. Population ethics is the place where those intuitions are made explicit enough to argue about.',
        'The second application is to extinction. If the total view is right, the loss of humanity is bad because of the well-being that would have existed, not because the people who would have existed are somehow harmed. That distinction matters for how we justify preventing extinction, and it is why some philosophers have looked for a view on which extinction is bad for a different reason. None of these debates has produced a consensus. What has been produced is a much clearer map of which intuitions cost what, and that is the kind of progress philosophy can honestly claim.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'Is a life that is barely worth living a benefit to the person who lives it, and can that person coherently regret existing?',
        'Could you accept the repugnant conclusion if the alternative were a view that made adding happy people bad?',
        'Does the argument depend on comparing well-being between people, and what happens if that comparison is only rough?',
        'If every escape costs something, is the right response to pick the least bad cost, or to deny that the question has a single answer?',
      ],
    },
  ],
  sources: [
    { label: 'D. Parfit, Reasons and Persons (Oxford University Press, 1984), part IV and the mere addition paradox', url: 'https://doi.org/10.1093/019824908X.001.0001' },
    { label: 'G. Arrhenius, "The Repugnant Conclusion", Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/repugnant-conclusion/' },
    { label: 'M. Huemer, "In defence of repugnance", Mind 117, 899 (2008)', url: 'https://doi.org/10.1093/mind/fzn079' },
  ],
  related: ['is-ought-gap', 'personal-identity', 'epistemic-injustice'],
};

export const PHILOSOPHY_DOSSIERS = [
  PERSONAL_IDENTITY_DOSSIER,
  EPISTEMIC_INJUSTICE_DOSSIER,
  IS_OUGHT_DOSSIER,
  REPUGNANT_CONCLUSION_DOSSIER,
];

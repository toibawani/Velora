// Human-written philosophy curriculum for VELORA.
export const PHILOSOPHY_CURRICULUM = {
  name: 'Philosophy',
  description: 'Careful questions about what we know, what we should do, and what it means to be free.',
  modules: [
    { id: 'knowing', title: 'How do we know?', intro: 'A good question can keep you honest for years.', topics: [
      { id: 'stoicism', title: 'Stoicism', kicker: 'A practical philosophy for a noisy mind', minutes: 13,
        story: 'A philosopher, a doctor, and a ship captain worry about things they cannot control. Stoicism does not tell them to pretend nothing matters. It asks them to spend effort where action is still possible.',
        sections: [
          { heading: 'Control and action', body: 'Stoics separate what depends on us from what does not. Judgement, choices, and effort are closer to our control. Reputation, weather, other people, and the past are not. This is not a promise of good outcomes; it is a way to stop wasting energy on a steering wheel you do not have.' },
          { heading: 'The three figures', body: 'Epictetus taught that freedom begins with noticing what is in our power. Marcus Aurelius wrote Meditations while governing an empire. Seneca wrote about time, anger, and friendship. They were thinkers in a Greek and Roman world, not life coaches in a self-help studio.' },
          { heading: 'Not “don’t care”', body: '“Whatever happens, happens” can sound like giving up. Stoicism is more demanding: accept the facts before deciding what a good response looks like. You can care deeply about an exam or a diagnosis without confusing caring with controlling.' },
          { heading: 'A modern use', body: 'When anxiety tells you to rehearse every disaster, write three columns: facts, influence, next action. It is a pause that makes a worry different from a decision.' }
        ], connections: ['Control resembles action versus reaction.', 'It connects to ethics because character shapes action.', 'It overlaps with Buddhism on attention, though the traditions differ.'], uncertainty: 'Stoicism can be misused to excuse unfairness. A philosophy deserves a skeptical reader.', career: 'Stoic ideas show up in cognitive behavioural therapy, leadership coaching, resilience training, and ethical decisions.'
      },
      { id: 'epistemology', title: 'Epistemology', kicker: 'What would count as knowing?', minutes: 14,
        story: 'You look up from this page because the floor is holding you up. Epistemology asks what makes confidence reasonable rather than merely lucky.',
        sections: [
          { heading: 'Empirical and rational', body: 'Empiricism leans on observation. Rationalism leans on reason and concepts. We observe patterns and need concepts such as cause and number before observation becomes an explanation.' },
          { heading: 'A priori and a posteriori', body: 'A priori knowledge is meant to be knowable before experience; a posteriori knowledge depends on experience. Mathematics is often used as an a priori example. “Water boils at 100°C at sea level” is empirical, but it depends on concepts and instruments too.' },
          { heading: 'Skepticism', body: 'How do we know we are not in a dream or a simulation? Skepticism asks us to notice that evidence can mislead. Say which claims are supported, which are assumptions, and what would change your mind.' },
          { heading: 'Why it matters', body: 'Learning without checking evidence is confident storage. Epistemology gives vocabulary for uncertainty, explanation, and revision. It is underneath good science and honest disagreement.' }
        ], connections: ['Epistemology asks about knowledge.', 'Ontology asks what exists.', 'Metaphysics examines the structure of reality.', 'Logic studies what follows from reasons.'], uncertainty: 'Many problems are unresolved because people disagree about what a question even means.', career: 'Research, medicine, law, data science, and journalism require separating evidence from confidence.'
      },
      { id: 'ethics', title: 'Ethics', kicker: 'Three ways to ask what is right', minutes: 13,
        story: 'A friend asks you to cover for a small lie. A rule says one thing, consequences say another, and your sense of character asks a third question.',
        sections: [
          { heading: 'Deontology: rules', body: 'This view asks whether an action respects a duty, right, or rule. A promise matters even when breaking it is convenient. It is strong when consequences are uncertain, though duties can conflict.' },
          { heading: 'Consequentialism: outcomes', body: 'This view judges an action by its results. Whose results count? How far into the future do we look? Helping many people can still be unfair to one person.' },
          { heading: 'Virtue ethics: character', body: 'This view asks what a good person would do. Kindness, courage, honesty, and practical wisdom are habits built through practice.' },
          { heading: 'Use them as lenses', body: 'These frameworks are not a vote where one wins forever. Ask who bears the cost, who has a voice, and whether you would accept the result if it happened to you.' }
        ], connections: ['Ethics needs evidence about consequences.', 'Character connects to Stoic practice.', 'Reasoning belongs to logic and epistemology.'], uncertainty: 'Ethics is not only a rule. It also involves judgment, relationships, and consequences that cannot be calculated cleanly.', career: 'Medicine, design, engineering, public policy, and product teams use more than one framework.'
      },
      { id: 'existentialism', title: 'Existentialism', kicker: 'Freedom has a shadow', minutes: 14,
        story: 'You can inherit a language, family, and options without inheriting the whole answer to what to do with them. Existentialism begins in that gap between what you were given and what you choose.',
        sections: [
          { heading: 'Freedom and responsibility', body: 'Sartre argued that we are condemned to be free: no hidden essence tells us what we must become. That can sound lonely. It also means choices are not secretly written by someone else.' },
          { heading: 'Authenticity', body: 'Authenticity is not being a rebel for a costume. It is owning the fact that a decision is yours, including its values.' },
          { heading: 'The absurd', body: 'Camus compared a person searching for meaning with a universe that offers no guaranteed answer. He did not say nothing can matter. He said a search should not be dismissed just because it has no promise attached.' },
          { heading: 'The weight of choice', body: 'Kierkegaard, Sartre, and Camus write differently, but they return to the fact that a decision changes a life. A meaningful life is not one that never hesitates; it is one where you notice what you choose and why.' }
        ], connections: ['Authenticity connects to ethics.', 'Freedom changes responsibility.', 'Absurdism questions guaranteed meaning.'], uncertainty: 'Existentialism is a family of positions, not a single creed.', career: 'Literature, psychology, design, activism, and ethics examine the life behind a decision.'
      }
    ] }
  ]
};

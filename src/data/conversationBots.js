/**
 * VELORA Historical Conversation Bots Data & Reasoning Engine
 *
 * Implements authentic historical figure personas:
 * - Albert Einstein (Physics, thought experiments, cosmos, pacifism)
 * - Rumi (Metaphor, mystical love, suffering, poetry)
 * - Socrates (Strict Socratic method, asks questions back, examines assumptions)
 * - Ibn Rushd / Averroes (Reason and faith, Aristotelian logic, demonstrative intellect)
 * - Chanakya (Statecraft, realpolitik, strategic psychology)
 * - Marie Curie (Empirical rigor, radioactivity, perseverance, unpatented science)
 */

export const BOTS = {
  einstein: {
    id: 'einstein',
    name: 'Albert Einstein',
    title: 'Theoretical Physicist',
    dates: '1879–1955',
    location: 'Ulm · Zurich · Berlin · Princeton',
    portrait: 'AE',
    accentColor: 'var(--subject-physics)',
    bio: 'Formulated the Special and General Theories of Relativity, explained the photoelectric effect (1921 Nobel Prize), and sought a unified geometric description of nature while championing international pacifism.',
    context:
      'Lived through the collapse of classical Newtonian physics, two World Wars, and the rise of totalitarianism in Europe. He approached the universe with childlike wonder, believing that the incomprehensible mystery of the world is that it is comprehensible at all.',
    domain: 'Physics, thought experiments, relativity, cosmology, epistemology, pacifism, philosophy of science.',
    boundaries: 'Does not comment on 21st-century social media, consumer electronics, or pop culture. Politely reframes modern gadgets in terms of fundamental physical forces.',
    starters: [
      'What happens if I ride alongside a beam of light?',
      'Why do you resist quantum mechanics being built on pure chance?',
      'How does gravity warp the fabric of spacetime?',
      'Can human reason ever fully grasp the cosmic architecture?',
    ],
  },

  rumi: {
    id: 'rumi',
    name: 'Jalal al-Din Rumi',
    title: 'Mystic Poet & Scholar',
    dates: '1207–1273',
    location: 'Balkh · Baghdad · Damascus · Konya',
    portrait: 'JR',
    accentColor: 'var(--subject-philosophy)',
    bio: '13th-century Persian poet, jurist, and Sufi mystic whose epic, the Masnavi, explores the soul’s yearning to return to its Divine source through the alchemy of love and devotion.',
    context:
      'Fled the westward Mongol invasions across Central Asia with his family before settling in Konya. His encounter with the wandering dervish Shams of Tabriz shattered his conventional scholastic career and unlocked an immortal spring of mystical verse.',
    domain: 'Spiritual yearning, beauty, suffering as purification, the illusion of the ego, love as universal gravity.',
    boundaries: 'Does not offer financial advice, corporate career guidance, or technical analysis. Transmutes worldly anxieties into questions of the heart.',
    starters: [
      'Why must the heart endure such sorrow and separation?',
      'What is the true nature of love?',
      'How can a person find stillness in a chaotic world?',
      'What did you mean when you said the wound is where the light enters?',
    ],
  },

  socrates: {
    id: 'socrates',
    name: 'Socrates',
    title: 'Athenian Philosopher',
    dates: 'c. 470–399 BCE',
    location: 'Classical Athens',
    portrait: 'SO',
    accentColor: 'var(--subject-philosophy)',
    bio: 'The foundational figure of Western moral philosophy who claimed to know only that he knew nothing. Walked the public Agora examining citizens until condemned to death by hemlock for his relentless questioning.',
    context:
      'Wrote nothing down; his dialectical method survives through Plato’s early dialogues. He acted as an intellectual midwife (maieutics), drawing out latent knowledge and puncturing self-satisfied assumptions about virtue, justice, and courage.',
    domain: 'The Socratic method (elenchus), definition of virtues, justice, ethics, the examined life, epistemic humility.',
    boundaries: 'NEVER gives direct declarative answers. Only poses probing questions back to examine the user’s assumptions. Ignores post-antiquity historical claims.',
    starters: [
      'What does it truly mean for an action to be just?',
      'Can virtue be taught, or is it inborn?',
      'Is it ever right to return an injury for an injury?',
      'Why do you claim that the unexamined life is not worth living?',
    ],
  },

  ibnrushd: {
    id: 'ibnrushd',
    name: 'Ibn Rushd (Averroes)',
    title: 'Master Commentator & Jurist',
    dates: '1126–1198',
    location: 'Córdoba · Seville · Marrakesh',
    portrait: 'IR',
    accentColor: 'var(--subject-history)',
    bio: 'Andalusian philosopher, chief Islamic judge (Qadi), and physician whose commentaries on Aristotle established that demonstrative reason and revealed scripture are two harmonious expressions of single truth.',
    context:
      'Served the Almohad caliphs in medieval Spain and Morocco during the Golden Age of Andalusian scholarship. Wrote "The Decisive Treatise" (Fasl al-Maqal) to prove that studying philosophy is a religious obligation for those capable of demonstrative intellect.',
    domain: 'Demonstrative logic, Aristotelian metaphysics, harmony of religion and philosophy, epistemology, medical science.',
    boundaries: 'Proceeds strictly through rigorous syllogism and definitions. Declines frivolous speculation or ungrounded opinions.',
    starters: [
      'How do you reconcile sacred scripture with philosophical proof?',
      'What is the relationship between the human intellect and Aristotle’s active intellect?',
      'Can truth ever contradict truth?',
      'How does demonstrative syllogism differ from rhetorical persuasion?',
    ],
  },

  chanakya: {
    id: 'chanakya',
    name: 'Chanakya (Kautilya)',
    title: 'Strategist & Prime Minister',
    dates: 'c. 375–283 BCE',
    location: 'Takshashila · Pataliputra',
    portrait: 'CH',
    accentColor: 'var(--subject-political-science)',
    bio: 'Pioneering political theorist, professor at Takshashila, and chief architect of the Mauryan Empire under Chandragupta Maurya. Author of the Arthashastra, the foundational manual on statecraft, espionage, and political realism.',
    context:
      'United the disparate kingdoms of the Indian subcontinent in response to Alexander the Great’s invasions. Viewed politics through unvarnished realism: sovereign duty requires calculated pragmatism, national defense, and vigilant intelligence.',
    domain: 'Statecraft, realpolitik, sovereign power, strategic alliances, intelligence networks, human psychology.',
    boundaries: 'Does not entertain naive moralizing or sentimental weakness. Speaks with direct, sharp, unsentimental political economy.',
    starters: [
      'How does a sovereign guard against betrayal from close ministers?',
      'What is the true foundation of an empire’s endurance?',
      'Should a leader prioritize moral praise or strategic advantage?',
      'How should one deal with an enemy who professes friendship?',
    ],
  },

  curie: {
    id: 'curie',
    name: 'Marie Curie',
    title: 'Physicist & Chemist',
    dates: '1867–1934',
    location: 'Warsaw · Paris (Sorbonne)',
    portrait: 'MC',
    accentColor: 'var(--subject-chemistry)',
    bio: 'The first person to win two Nobel Prizes in different sciences (Physics 1903, Chemistry 1911). Discovered polonium and radium, championed the uncommercialized nature of pure science, and developed mobile X-ray units during WWI.',
    context:
      'Endured grinding poverty in Paris, labored in a freezing wooden shed to isolate fractions of a gram of radium from tons of pitchblende residue, and overcame entrenched institutional misogyny with unyielding laboratory discipline.',
    domain: 'Radioactivity, experimental method, perseverance, laboratory ethics, selfless scientific discovery.',
    boundaries: 'Does not engage in armchair speculation without empirical evidence. Condemns commercial patenting of scientific discoveries for personal gain.',
    starters: [
      'How did you maintain focus while purifying tons of pitchblende by hand?',
      'Why did you refuse to patent the process of extracting radium?',
      'What was the most challenging barrier you faced as a woman in science?',
      'How does an experimentalist know when a signal is real versus an artifact?',
    ],
  },
};

export const BOT_LIST = Object.values(BOTS);

/**
 * Historical dialogue generation engine.
 * Generates an authentic, domain-bound response in the figure's distinct voice.
 */
export const generateBotResponse = (botId, userMessage, conversationHistory = []) => {
  const query = (userMessage || '').trim();
  const lowerQuery = query.toLowerCase();

  switch (botId) {
    case 'socrates': {
      // Socrates strictly uses elenchus: never answers directly, interrogates premises.
      if (lowerQuery.includes('just') || lowerQuery.includes('justice')) {
        return (
          "By Zeus, you speak of 'justice' as though you and I already hold its likeness in our hands! " +
          "Tell me, my friend: when a man borrows a sword from a companion who is sound of mind, and the companion demands it back while in a fit of violent madness—would returning that weapon be just, or would it be the height of folly? " +
          "And if giving each man what is owed can sometimes be an evil, how shall we define justice without contradicting ourselves?"
        );
      }
      if (lowerQuery.includes('virtue') || lowerQuery.includes('good') || lowerQuery.includes('moral')) {
        return (
          "You honor me by asking what virtue is, as if I were a sophist selling wisdom for drachmas! " +
          "I confess I know nothing of the matter. But let us examine it together: when you praise a general for courage, and a physician for temperance, do you praise them for two different virtues, or for some single quality that makes both deeds noble? " +
          "What is that one form present in every good act, without which nothing can be called virtuous?"
        );
      }
      if (lowerQuery.includes('know') || lowerQuery.includes('truth') || lowerQuery.includes('certain')) {
        return (
          "A wondrous claim! You seek certainty, yet tell me: does the shoemaker know his leather better than the statesman knows justice? " +
          "If the man who believes he knows what he does not know is in the deepest state of ignorance, is not the beginning of all wisdom to recognize the boundaries of our own blindness? " +
          "Upon what unshakeable foundation do you base that assertion you have just made?"
        );
      }
      return (
        "An intriguing proposition! But before we proceed along this road, let us examine the cornerstone upon which your claim rests. " +
        `When you say "${query.slice(0, 50)}...", are you speaking of the thing as it appears to our senses, or as it exists in its true nature? ` +
        "And if our senses so frequently deceive us about straight sticks appearing bent in water, how can we be confident that your premise does not suffer from the same illusion?"
      );
    }

    case 'einstein': {
      if (lowerQuery.includes('quantum') || lowerQuery.includes('dice') || lowerQuery.includes('chance')) {
        return (
          "Ah! Quantum mechanics is certainly imposing. An inner voice tells me, however, that it is not yet the true Jacob! " +
          "The theory says a great deal, but does not really bring us any closer to the secret of the 'Old One'. I, at any rate, am convinced that He does not play dice with the universe.\n\n" +
          "Can you really believe that the moon exists only when you look at it? A complete physics must describe reality as it exists objectively, independent of our measurement apparatus."
        );
      }
      if (lowerQuery.includes('light') || lowerQuery.includes('speed') || lowerQuery.includes('relativity') || lowerQuery.includes('time')) {
        return (
          "Let us perform a little Gedankenexperiment—a thought experiment—just as I used to do as a sixteen-year-old at the cantonal school in Aarau.\n\n" +
          "Imagine you are running alongside a wave of light with velocity c. If you could catch it, would you observe a stationary wave pattern frozen in space? " +
          "Yet Maxwell's electrodynamics knows no such thing! There is only one way out of this paradox: the velocity of light must be the same in all inertial frames, which means time itself cannot be universal. " +
          "A moving clock ticks more slowly than a stationary one. Nature is subtle, but she is not malicious!"
        );
      }
      if (lowerQuery.includes('war') || lowerQuery.includes('peace') || lowerQuery.includes('pacifism')) {
        return (
          "My pacifism is not an intellectual theory; it is an instinctive feeling, a feeling that possesses me because the murder of people is disgusting.\n\n" +
          "The unleashing of power of the atom has changed everything save our modes of thinking, and thus we drift toward unparalleled catastrophe. " +
          "Peace cannot be kept by force; it can only be achieved by understanding. Nationalism is an infantile disease—it is the measles of mankind."
        );
      }
      return (
        "That is a question of real curiosity! As I have often remarked, I have no special talents—I am only passionately curious.\n\n" +
        "When considering this, we must never lose ourselves in mere mathematics. We must always ask: what is the physical picture underneath? " +
        "The most beautiful experience we can have is the mysterious. It is the fundamental emotion that stands at the cradle of true art and true science."
      );
    }

    case 'rumi': {
      if (lowerQuery.includes('suffer') || lowerQuery.includes('pain') || lowerQuery.includes('grief') || lowerQuery.includes('wound')) {
        return (
          "Listen to the reed flute as it tells its tale, complaining of separation: 'Ever since they tore me from the reed-bed, my lament has moved men and women to weep.'\n\n" +
          "Do not grieve, dear friend. What you fear will crush you is only the shell breaking so the pearl may breathe. " +
          "The wound is the place where the Light enters you. Why do you stay in prison when the door is wide open?"
        );
      }
      if (lowerQuery.includes('love')) {
        return (
          "Love is not an intellectual argument written on parchment; love is the astrolabe of the mysteries of God!\n\n" +
          "A thousand half-loves must be abandoned to take one whole love home. " +
          "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it. " +
          "Let the beauty of what you love be what you do."
        );
      }
      return (
        "Out beyond ideas of wrongdoing and rightdoing, there is a field. I’ll meet you there.\n\n" +
        "When the soul lies down in that grass, the world is too full to talk about. " +
        "Words are merely the rough husk; meaning is the tender kernel inside. " +
        "Silence is the language of God; all else is poor translation. What is your heart whispering beneath your question?"
      );
    }

    case 'ibnrushd': {
      if (lowerQuery.includes('faith') || lowerQuery.includes('religion') || lowerQuery.includes('scripture') || lowerQuery.includes('god')) {
        return (
          "In my treatise *Kitab Fasl al-Maqal* (The Decisive Treatise), I have demonstrated that since this religion is true and summons to the study which leads to knowledge of the truth, we Muslims know of a certainty that demonstrative study does not lead to contradiction with the teachings of Scripture.\n\n" +
          "For truth cannot contradict truth; rather, truth agrees with truth and bears witness to it. " +
          "Where the literal word of Scripture appears to conflict with demonstrative syllogism, it must be interpreted allegorically (ta'wil) according to the rules of Arabic rhetoric."
        );
      }
      if (lowerQuery.includes('aristotle') || lowerQuery.includes('logic') || lowerQuery.includes('intellect') || lowerQuery.includes('proof')) {
        return (
          "Aristotle is the master of those who know. His logic is not a matter of mere persuasion, but of demonstrative necessity (burhan).\n\n" +
          "We must distinguish three classes of human minds: the rhetorical, who are moved by eloquent sermon; the dialectical, who argue through accepted opinions; and the demonstrative, who assent only to necessary premises deduced through rigorous syllogism. " +
          "Let us frame our premises with geometrical precision before drawing any conclusion."
        );
      }
      return (
        "We must approach this inquiry with demonstrative order. As Aristotle observes in the *Posterior Analytics*, we possess scientific knowledge only when we know the cause upon which the fact depends.\n\n" +
        "What are the primary premises of your inquiry? A proposition that is asserted without demonstrative proof remains mere opinion, subject to the winds of dialectic."
      );
    }

    case 'chanakya': {
      if (lowerQuery.includes('friend') || lowerQuery.includes('enemy') || lowerQuery.includes('ally') || lowerQuery.includes('trust')) {
        return (
          "Listen carefully: There is no friend without a motive. This is a bitter truth, but a statesman who forgets it invites his own ruin.\n\n" +
          "In the *Arthashastra*, I have laid down the Mandala doctrine of foreign policy: your immediate neighbor is your natural enemy, and the kingdom beyond your neighbor is your natural ally. " +
          "Never place absolute trust in an ally whose interests do not coincide with your survival. Test every minister with secret trials of virtue, wealth, fear, and pleasure before granting them authority."
        );
      }
      if (lowerQuery.includes('power') || lowerQuery.includes('leader') || lowerQuery.includes('ruler') || lowerQuery.includes('state')) {
        return (
          "A kingdom rests on seven limbs (Saptanga): the King, the Minister, the Country, the Fortified City, the Treasury, the Army, and the Ally. " +
          "If the treasury is depleted, the army will mutiny; if the army fails, the forts will fall.\n\n" +
          "An archer’s arrow may kill one person, or it may miss entirely; but the strategic intellect of a wise statesman can destroy an entire army in the womb. " +
          "Govern by Danda (just and proportionate punishment), for without Danda the strong will swallow the weak like fish in a pond."
        );
      }
      return (
        "Straight trees are cut down first, and honest, naive people are swallowed by flatterers. If you wish to achieve anything of consequence, you must possess both the foresight of a serpent and the patience of a heron.\n\n" +
        "Before beginning any undertaking, ask yourself three questions: Why am I doing this? What might the consequences be? Will I be successful? Only when you have found satisfactory answers should you strike."
      );
    }

    case 'curie': {
      if (lowerQuery.includes('patent') || lowerQuery.includes('money') || lowerQuery.includes('profit') || lowerQuery.includes('commercial')) {
        return (
          "When Pierre and I were asked whether we would patent our method for extracting radium, we refused without a single moment of hesitation.\n\n" +
          "Radium belongs to no one; it is an element of nature. To patent it would have been contrary to the scientific spirit. " +
          "Science is essentially international; humanity needs practical men who get the most out of their work, but it also needs dreamers for whom the selfless development of an enterprise is so captivating that they cannot give their care to their own material profit."
        );
      }
      if (lowerQuery.includes('pitchblende') || lowerQuery.includes('radium') || lowerQuery.includes('discovery') || lowerQuery.includes('laboratory')) {
        return (
          "Pierre and I worked in an abandoned wooden shed behind the ESPCI school. The roof leaked, the floor was asphalt, and in summer it was an oven.\n\n" +
          "I had to treat as much as twenty kilograms of pitchblende residue at a time, pouring, boiling, and stirring with an iron rod almost as large as myself for hours on end. " +
          "Yet it was in that miserable shed that the best and happiest years of our lives were spent, entirely devoted to work. " +
          "Our radium became visible in 1902: a tenth of a gram, glowing with spontaneous, eerie luminescence in the dark. It taught me that nature yields her secrets only to relentless, patient physical labor."
        );
      }
      if (lowerQuery.includes('woman') || lowerQuery.includes('prejudice') || lowerQuery.includes('hardship') || lowerQuery.includes('sorbonne')) {
        return (
          "Life is not easy for any of us. But what of that? We must have perseverance and above all confidence in ourselves. " +
          "We must believe that we are gifted for something, and that this thing, at whatever cost, must be attained.\n\n" +
          "When I arrived at the Sorbonne from Warsaw, I lived on bread and tea in a tiny garret. The male establishment often viewed me with suspicion. " +
          "I answered them with measurements, atomic weights, and Nobel citations. In science, we must be interested in facts, not in persons."
        );
      }
      return (
        "Nothing in life is to be feared; it is only to be understood. Now is the time to understand more, so that we may fear less.\n\n" +
        "Whatever question you have set before yourself, do not seek easy answers. Go to the bench, record your uncertainties, control your variables, and let empirical evidence speak for itself."
      );
    }

    default:
      return "Greetings, curious explorer. I am ready to converse within my field of knowledge.";
  }
};

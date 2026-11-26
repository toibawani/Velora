/**
 * Chemistry dossiers.
 *
 * Same editorial rule as the physics file: exact numbers or an explicit
 * estimate, named experiments, and speculation labelled as speculation. These
 * three were chosen because each one overturns a picture a careful reader is
 * likely to already hold: that reactions run downhill to a stop, that mirror
 * molecules are interchangeable, and that fixing nitrogen is a solved problem.
 */

export const BZ_REACTION_DOSSIER = {
  id: 'belousov-zhabotinsky',
  title: 'The Reaction That Will Not Settle',
  standfirst:
    'Mix bromate, malonic acid and a cerium salt in acid and the solution turns yellow, then clear, then yellow again, for hours. A beaker that oscillates looks like a perpetual-motion machine. It is not: it is an open system burning its fuel in a pattern.',
  field: 'Chemistry',
  lenses: ['Matter', 'Time'],
  status: 'Established chemistry; the mechanism is still being refined',
  difficulty: 'Advanced',
  minutes: 24,
  opening:
    'In 1951 Boris Belousov mixed potassium bromate, citric acid and a cerium salt in dilute sulfuric acid and watched the colour of the solution swing between yellow and colourless. The period was about thirty seconds and the oscillation persisted for nearly an hour. He submitted the result to a Soviet journal and was told it was impossible: a closed chemical system must approach equilibrium monotonically, so a reaction that goes back and forth must be an artefact. His paper was rejected twice before it appeared, shortened, in 1959. The effect is real, and the reason it is real is that the beaker was never closed.',
  sections: [
    {
      kind: 'prose',
      heading: 'Why a chemist thought it could not happen',
      body: [
        'The intuition Belousov ran into is a real theorem, correctly applied to the wrong system. A closed system at constant temperature and pressure minimises its Gibbs free energy. It can pass through a maximum on the way down, but it cannot cycle forever, because a cycle would return it to a state it had already left and the free energy would have to be lower both times. A genuinely closed, isothermal reaction that oscillates would violate the second law.',
        'Belousov’s beaker was not closed in the relevant sense. It was open to the atmosphere, and more importantly it was far from equilibrium: the bromate and malonic acid were fuel, and the reaction was consuming them while dissipating heat. An open system can hold a non-equilibrium steady state, and a steady state can lose stability and give way to a sustained oscillation. Ilya Prigogine later called structures of this kind dissipative structures: ordered patterns maintained by a flow of energy through the system, not by a lowering of entropy inside it.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of an oscillating reaction',
      items: [
        {
          term: 'Oscillating reaction',
          definition:
            'A reaction in which the concentration of an intermediate rises and falls periodically instead of approaching a final value. It requires an open system or a continuous feed of reactants.',
        },
        {
          term: 'Autocatalysis',
          definition:
            'A reaction in which a product catalyses its own formation. Autocatalysis supplies the positive feedback that makes a chemical system able to switch, and switching is what an oscillation is made of.',
        },
        {
          term: 'Far from equilibrium',
          definition:
            'A state in which the concentrations are far from the values they would have at equilibrium, maintained by a flow of matter or energy. Only such a system can sustain a pattern indefinitely.',
        },
        {
          term: 'Dissipative structure',
          definition:
            'An ordered pattern maintained by continuous dissipation of energy. It exists because energy flows through it, and it disappears when the flow stops.',
        },
        {
          term: 'Redox couple',
          definition:
            'A pair of chemical species related by the transfer of electrons, such as Ce⁴⁺ and Ce³⁺. The BZ reaction is driven by the cerium couple switching between its two oxidation states.',
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'The mechanism: bromide as a switch',
      body: [
        'The modern account is the Field–Körös–Noyes mechanism, published in 1972. It has three interlocking processes. In the first, bromide ion inhibits the reaction: it reacts with bromate and with the autocatalytic species and keeps the system in a reduced state. In the second, when bromide falls below a threshold, bromous acid (HBrO₂) autocatalytically produces more of itself, oxidising the cerium catalyst from Ce³⁺ to Ce⁴⁺. That is the yellow phase. In the third, the oxidised cerium reacts with malonic acid and its brominated derivatives, producing bromide and returning the system to the reduced state. The bromide then re-suppresses the autocatalysis, and the cycle starts again.',
        'The result is a relaxation oscillator, not a sine wave. The system spends most of its time in one regime, switches quickly when a threshold is crossed, and spends most of its time in the other. The visible colour change is the cerium couple; the redox potential of the solution can be recorded as a square-ish wave with a period set by the concentrations and the temperature. The same solution can also support spatial patterns: if it is spread in a thin layer, the switching happens at different times in different places, producing target patterns and rotating spiral waves.',
      ],
    },
    {
      kind: 'math',
      heading: 'The Oregonator: the smallest model that oscillates',
      equation: 'ε dx/dτ = x(1 − x) − f z (x − q)/(x + q),   dz/dτ = x − z',
      symbols: [
        { symbol: 'x', meaning: 'A scaled concentration of the autocatalytic species HBrO₂' },
        { symbol: 'z', meaning: 'A scaled concentration of the oxidised catalyst Ce⁴⁺' },
        { symbol: 'τ', meaning: 'Dimensionless time, scaled by the reaction rates' },
        { symbol: 'ε', meaning: 'The ratio of the fast bromide dynamics to the slow catalyst dynamics; small ε makes the oscillation sharp' },
        { symbol: 'f', meaning: 'A stoichiometric factor counting how much bromide one turnover of the catalyst produces' },
        { symbol: 'q', meaning: 'A scaled rate constant for the bromide inhibition step' },
      ],
      body: [
        'The Oregonator, published by Field and Noyes in 1974, is a five-step reduction of the full mechanism to two variables. It is not the chemistry; it is the smallest set of equations that reproduces the qualitative behaviour. The first equation says that HBrO₂ grows autocatalytically when x is small, is limited by the (1 − x) term when it is large, and is suppressed by the oxidised catalyst through the (x − q)/(x + q) factor. The second says the catalyst follows the autocatalyst with a lag.',
        'The small parameter ε is what makes the system a relaxation oscillator rather than a smooth one. Because ε is small, x moves quickly to a quasi-steady value for any given z, so the trajectory clings to a slow manifold and jumps between its branches when it reaches a fold. That geometry — fast jumps, slow drifts, hysteresis — is the same geometry behind the heartbeat, the neuron action potential and the bursts of a laser. The BZ reaction is the cleanest chemical example of it.',
      ],
      assumptions: [
        'The reaction is well mixed, so concentrations do not depend on position. In a thin layer this assumption fails, and spatial patterns appear.',
        'The five-step reduction keeps the essential feedback loops and discards the rest; it is a model of the mechanism, not the mechanism.',
        'Temperature, pressure and the supply of bromate and malonic acid are held constant, which is what makes the oscillation sustained rather than transient.',
      ],
    },
    {
      kind: 'table',
      heading: 'Oscillating systems, and what each one demonstrates',
      columns: ['System', 'What oscillates', 'Why it is interesting'],
      rows: [
        ['Belousov–Zhabotinsky', 'Ce³⁺/Ce⁴⁺ ratio; colour and redox potential', 'The original; also supports spiral waves in thin layers'],
        ['Briggs–Rauscher', 'Iodine concentration; colour swings between amber and deep blue', 'A iodine analogue discovered in 1973; simpler to run in a school lab'],
        ['CIMA reaction', 'Colour of a starch–iodine complex', 'Designed by Epstein and others to be a practical laboratory oscillator'],
        ['Oregonator model', 'Two coupled variables x and z', 'Shows that two variables and autocatalysis are enough for oscillation'],
      ],
      note:
        'The list matters because each entry isolates a different question: whether the phenomenon is robust, whether it can be made reproducible, and how little mathematics is needed to reproduce it.',
    },
    {
      kind: 'misconception',
      heading: 'The objection Belousov heard, and why it fails here',
      claim: '"A reaction that goes back and forth forever would violate the second law of thermodynamics."',
      correction:
        'It would, in a closed system at equilibrium. The BZ reaction is neither. It consumes bromate and malonic acid, releases heat, and produces brominated organic products and carbon dioxide; the oscillation stops when the fuel runs out. The relevant bookkeeping is the entropy production of the whole system, including the heat bath, which increases. The pattern is maintained by the flow of free energy through the beaker, exactly as a vortex is maintained by a flow of water. Remove the fuel and the oscillation dies, which is the test that distinguishes a dissipative structure from a perpetual-motion claim.',
    },
    {
      kind: 'prose',
      heading: 'Why a beaker of yellow liquid matters',
      body: [
        'The first reason is that it made chemical pattern formation respectable. Before the BZ reaction was accepted, the dominant picture was that a well-mixed reaction vessel is spatially uniform. The existence of spiral waves in a thin layer showed that a chemical system can organise itself in space and time, with a wavelength set by the balance between reaction and diffusion. That is the same balance Alan Turing used in 1952 to explain how a uniform embryo could develop spots and stripes, and the two literatures are now one.',
        'The second is that the mathematics transfers. The Oregonator is a two-variable excitable system, and excitable systems describe cardiac tissue, cortical waves, calcium signalling and slime-mould aggregation. A spiral wave in the BZ solution and a re-entrant arrhythmia in heart muscle obey the same class of equations; the BZ system is used as a controllable model because you can see the wave and change the chemistry. The third is pedagogical: it is one of the few places where a student can watch a nonlinear dynamical system with their own eyes, in a beaker, for the price of a few reagents.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'What exactly has to be open for an oscillation to persist, and is a sealed cuvette enough?',
        'If two variables are sufficient for oscillation, what do the other twenty species in the real mechanism contribute?',
        'Why do spiral waves form instead of concentric rings, and what sets their rotation period?',
        'Could a chemical oscillator be used as a clock or a memory element, and what limits its reliability?',
      ],
    },
  ],
  sources: [
    { label: 'B. P. Belousov, "A periodic reaction and its mechanism", Sbornik Referatov po Radiatsionni Meditsine (1959); the paper that was rejected twice', url: 'https://en.wikipedia.org/wiki/Boris_Belousov' },
    { label: 'A. N. Zaikin and A. M. Zhabotinsky, "Concentration wave propagation in two-dimensional liquid-phase self-oscillating system", Nature 225, 535 (1970)', url: 'https://doi.org/10.1038/225535b0' },
    { label: 'R. J. Field, E. Körös, R. M. Noyes, "Oscillations in chemical systems II", JACS 94, 8649 (1972)', url: 'https://doi.org/10.1021/ja00780a001' },
    { label: 'A. T. Winfree, "Spiral waves of chemical activity", Science 175, 634 (1972)', url: 'https://doi.org/10.1126/science.175.4022.634' },
    { label: 'I. R. Epstein and J. A. Pojman, An Introduction to Nonlinear Chemical Dynamics (Oxford, 1998)', url: 'https://global.oup.com/academic/product/an-introduction-to-nonlinear-chemical-dynamics-9780195076707' },
  ],
  related: ['time-crystals', 'arrow-of-time', 'slime-mould'],
};

export const CHIRALITY_DOSSIER = {
  id: 'chirality',
  title: 'The Two Hands of a Molecule',
  standfirst:
    'Two molecules with exactly the same atoms, bonded in exactly the same order, can smell different, taste different and behave differently in the body. The difference is handedness, and the universe is not neutral about it.',
  field: 'Chemistry',
  lenses: ['Matter', 'Life'],
  status: 'Established stereochemistry; the origin of biological homochirality is open',
  difficulty: 'Intermediate',
  minutes: 22,
  opening:
    'Hold your hands palms up. They are mirror images, and no rotation in three dimensions will superimpose them. Molecules can have the same property. A carbon atom bonded to four different groups has two arrangements that are mirror images of each other, and they are not the same compound. They have the same formula, the same bonds, the same melting point in isolation, and different biology. Every protein in your body is built from one hand of each amino acid, and nobody knows why the choice was made.',
  sections: [
    {
      kind: 'prose',
      heading: 'Pasteur, crystals and the first separation',
      body: [
        'In 1848 Louis Pasteur was working on tartaric acid from wine. He noticed that crystals of the sodium ammonium salt came in two shapes, each the mirror image of the other, and he separated them by hand under a microscope. Solutions of the two kinds rotated polarised light in opposite directions. Neither kind had been known to differ chemically. Pasteur had found that a molecule can be chiral — from the Greek for hand — and that chirality is a property of the arrangement of atoms in space, not of their identity.',
        'The formal description came later. A carbon with four different substituents is a stereocentre; the two arrangements are enantiomers. A 50:50 mixture is a racemate, and it is optically inactive because the two rotations cancel. The naming system, Cahn–Ingold–Prelog, assigns R and S by priority rules, which is why a molecule can be described completely without drawing it. None of this requires the molecule to be alive. It requires only that it not be superimposable on its mirror image.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of handedness',
      items: [
        {
          term: 'Chirality',
          definition:
            'The property of an object that cannot be superimposed on its mirror image by rotation or translation. A hand, a screw thread and many molecules are chiral.',
        },
        {
          term: 'Enantiomer',
          definition:
            'One of a pair of molecules that are mirror images of each other and not superimposable. They have identical connectivity and differ only in three-dimensional arrangement.',
        },
        {
          term: 'Racemate',
          definition:
            'A mixture containing equal amounts of both enantiomers. It is optically inactive because the two optical rotations cancel exactly.',
        },
        {
          term: 'Stereocentre',
          definition:
            'An atom, usually carbon, bonded to four different groups so that exchanging two of them produces a different stereoisomer. It is the most common source of chirality in organic molecules.',
        },
        {
          term: 'Optical activity',
          definition:
            'The rotation of the plane of polarised light by a chiral substance. It is the classical way to detect chirality and to measure the ratio of enantiomers in a solution.',
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'Why handedness changes behaviour',
      body: [
        'A chiral molecule fits into a chiral binding site the way a hand fits into a glove. The right hand fits the right glove; the left hand does not, even though it has the same shape in mirror. Enzymes, receptors and olfactory receptors are built from chiral amino acids, so they present a chiral surface. Two enantiomers of a drug can therefore bind with different affinities, be metabolised at different rates, and produce different effects. The difference can be trivial or catastrophic.',
        'Limonene is a clean example. The R enantiomer smells of orange; the S enantiomer smells of lemon, because the two fit the olfactory receptors differently. Carvone is more striking: R-carvone smells of spearmint, S-carvone of caraway. Neither is "the real" molecule; they are different compounds that happen to share a formula. Ibuprofen is sold as a racemate, but only the S enantiomer is pharmacologically active; the body converts much of the R form into the S form, which is why the racemate works.',
      ],
    },
    {
      kind: 'math',
      heading: 'Specific rotation, and what the number measures',
      equation: '[α] = α / (l · c)',
      symbols: [
        { symbol: '[α]', meaning: 'Specific rotation, a property of the substance at a stated temperature and wavelength', unit: 'degrees·mL/(dm·g)' },
        { symbol: 'α', meaning: 'The observed rotation of the plane of polarised light', unit: 'degrees' },
        { symbol: 'l', meaning: 'Path length through the sample', unit: 'decimetres' },
        { symbol: 'c', meaning: 'Concentration of the chiral substance', unit: 'g/mL' },
      ],
      body: [
        'The formula normalises the observed rotation for path length and concentration, so the number can be compared between experiments. It does not tell you which enantiomer is present; it tells you the net optical effect. A pure enantiomer has a characteristic specific rotation, a racemate has zero, and a mixture has a value proportional to its enantiomeric excess. That last relation is what makes polarimetry useful in synthesis: you can measure how well a reaction selected one hand without separating the mixture.',
        'The measurement is also a warning about language. A solution with zero rotation is not necessarily achiral; it may be a racemate. Pasteur’s separation worked because the two crystal forms could be picked apart by hand. Most racemates cannot be separated that way, which is why chiral chromatography and asymmetric catalysis became such important technologies.',
      ],
      assumptions: [
        'The solvent, temperature and wavelength are specified, because specific rotation depends on all three.',
        'The sample is not absorbing strongly at the measurement wavelength, or the reading is dominated by absorption rather than rotation.',
        'The concentration is known accurately and the substance is stable in solution; a reaction during the measurement invalidates the comparison.',
      ],
    },
    {
      kind: 'table',
      heading: 'Same formula, different hand, different effect',
      columns: ['Compound', 'One enantiomer', 'The other'],
      rows: [
        ['Limonene', 'Orange', 'Lemon'],
        ['Carvone', 'Spearmint', 'Caraway'],
        ['Thalidomide', 'Sedative in early studies', 'Also sedative; both forms can be teratogenic in animal models'],
        ['Ibuprofen', 'Active anti-inflammatory (S)', 'Largely inactive; converted to S in the body'],
        ['Glucose vs galactose', 'Not enantiomers: these are diastereomers', 'A reminder that not every mirror-image difference is chirality'],
      ],
      note:
        'The thalidomide row is deliberately cautious. The popular story that one enantiomer was safe and the other caused birth defects is too simple: the enantiomers interconvert in the body, and teratogenicity has been observed with both in some models. The tragedy is real; the tidy chemistry lesson often drawn from it is not.',
    },
    {
      kind: 'misconception',
      heading: 'The thalidomide simplification',
      claim: '"Thalidomide is the classic proof that one enantiomer is a drug and the other is a poison."',
      correction:
        'Thalidomide was marketed as a racemate, and the two enantiomers do interconvert in vivo, so even a pure preparation would have produced the other hand in the body. Animal studies have found teratogenic effects from both enantiomers, and the mechanism is still debated. The real lesson is narrower and more important: stereochemistry matters, and the body is a chiral environment. Using thalidomide as a clean morality tale about "good" and "bad" mirror molecules misstates the chemistry and lets the regulatory failure disappear into a neat fable.',
    },
    {
      kind: 'prose',
      heading: 'The origin of biological homochirality',
      body: [
        'Life uses almost exclusively L-amino acids and D-sugars. That is not a thermodynamic preference: the two hands have identical energies in solution, so a racemic prebiotic soup would have produced racemic polymers. Something must have biased the choice, and the candidates are still being argued about. Circularly polarised ultraviolet light can destroy one enantiomer preferentially, and amino acids in the Murchison meteorite show a small excess of the L form, which suggests an extraterrestrial bias rather than a terrestrial accident.',
        'The other class of explanation is autocatalytic amplification. The Soai reaction, discovered in 1995, is a real chemical system in which a tiny excess of one enantiomer catalyses its own formation and suppresses the other, turning a fraction of a per cent into nearly 100 per cent. That is a plausible mechanism for amplifying a small cosmic bias into a biological monopoly. It is not proof. The origin of homochirality is one of the few places where chemistry, astronomy and the origin of life meet, and none of them can yet close the argument alone.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If the two enantiomers have identical energies, what kind of process could have selected one on the early Earth?',
        'Why does the body convert ibuprofen’s inactive form into the active one, and is that a general pattern?',
        'Could a racemic drug be safer than a pure enantiomer because the body expects both hands?',
        'What would the world look like if biological homochirality had gone the other way?',
      ],
    },
  ],
  sources: [
    { label: 'L. Pasteur, "Mémoire sur la relation qui peut exister entre la forme cristalline et la composition chimique", Annales de Chimie et de Physique 24, 442 (1848)', url: 'https://en.wikipedia.org/wiki/Louis_Pasteur' },
    { label: 'K. Soai et al., "Asymmetric autocatalysis and amplification of enantiomeric excess of a chiral molecule", Nature 378, 767 (1995)', url: 'https://doi.org/10.1038/378767a0' },
    { label: 'N. Vargesson, "Thalidomide-induced teratogenesis: history and mechanisms", Birth Defects Research 105, 140 (2015)', url: 'https://doi.org/10.1002/bdr2.1053' },
    { label: 'D. G. Blackmond, "The origin of biological homochirality", Cold Spring Harbor Perspectives in Biology 2, a002147 (2010)', url: 'https://doi.org/10.1101/cshperspect.a002147' },
  ],
  related: ['horizontal-gene-transfer', 'mycorrhizal-networks', 'belousov-zhabotinsky'],
};

export const HABER_BOSCH_DOSSIER = {
  id: 'haber-bosch',
  title: 'The Reaction That Feeds Half the World',
  standfirst:
    'Nitrogen gas is 78 per cent of the air and almost none of it is available to living things. A high-pressure iron catalyst turns it into ammonia, and roughly half the nitrogen atoms in your body have passed through that reactor.',
  field: 'Chemistry',
  lenses: ['Matter', 'Life'],
  status: 'Established industrial chemistry; its climate cost is a live problem',
  difficulty: 'Intermediate',
  minutes: 23,
  opening:
    'The bond in N₂ is one of the strongest in chemistry: 941 kilojoules per mole, a triple bond with no dipole and no easy point of attack. Nitrogen is abundant, inert and biologically useless until something breaks that bond. Lightning does it in small quantities; a few bacteria do it with nitrogenase; and since 1913 an iron-catalysed reactor at 400–500 °C and 150–250 atmospheres has done it at industrial scale. The ammonia it makes becomes fertiliser, and the fertiliser becomes food.',
  sections: [
    {
      kind: 'prose',
      heading: 'A bond that does not want to break',
      body: [
        'N₂ is unreactive for two reasons that reinforce each other. The triple bond is extremely strong, and the molecule has no permanent dipole, so it does not bind strongly to surfaces or ions. Nitrogenase, the enzyme that fixes nitrogen in bacteria, gets around this with an iron–molybdenum cofactor and a large expenditure of ATP: about 16 ATP per molecule of N₂ reduced. That is why biological nitrogen fixation is confined to a small set of organisms and why legumes, which host rhizobia, are agriculturally special.',
        'The industrial route uses heat and pressure to overcome the same barrier. Haber’s insight was not the reaction itself — ammonia had been made from its elements in the laboratory — but the combination of a catalyst, high pressure and a recycle loop that made it practical. Bosch’s contribution was engineering: the reactor, the compressors and the heat exchangers that could run continuously at those conditions. The first plant opened at Oppau in 1913, and the process has changed less than you might expect.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of nitrogen fixation',
      items: [
        {
          term: 'Nitrogen fixation',
          definition:
            'The conversion of atmospheric N₂ into compounds that living things can use, such as ammonia or nitrate. It is the rate-limiting step in the natural nitrogen cycle.',
        },
        {
          term: 'Catalyst',
          definition:
            'A substance that speeds up a reaction without being consumed, by providing a lower-energy pathway. In Haber–Bosch the catalyst is iron with promoters such as potassium and aluminium oxides.',
        },
        {
          term: 'Equilibrium constant',
          definition:
            'The ratio of product to reactant activities at equilibrium. For ammonia synthesis it is small at high temperature, which is why the process needs high pressure and a recycle loop.',
        },
        {
          term: 'Le Chatelier’s principle',
          definition:
            'A system at equilibrium shifts to oppose a change in conditions. Raising pressure favours the side with fewer gas molecules, which is why high pressure favours ammonia.',
        },
        {
          term: 'Activation energy',
          definition:
            'The energy barrier a reaction must overcome to proceed. A catalyst lowers it; it does not change the equilibrium position.',
        },
      ],
    },
    {
      kind: 'math',
      heading: 'Why the conditions are a compromise',
      equation: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g),   ΔH° = −92 kJ/mol',
      symbols: [
        { symbol: 'N₂, H₂, NH₃', meaning: 'Nitrogen, hydrogen and ammonia, all in the gas phase' },
        { symbol: '⇌', meaning: 'The reaction is reversible; it reaches an equilibrium rather than going to completion' },
        { symbol: 'ΔH°', meaning: 'Standard enthalpy change: 92 kJ of heat released per mole of N₂ reacted' },
        { symbol: '4 → 2', meaning: 'Four gas molecules become two, so high pressure favours ammonia' },
      ],
      body: [
        'The reaction is exothermic and reduces the number of gas molecules. Both facts point the same way on pressure and opposite ways on temperature. High pressure favours ammonia because it compresses four molecules into two. Low temperature also favours ammonia because the reaction releases heat, so Le Chatelier’s principle shifts it back toward products as the temperature falls. But low temperature makes the reaction too slow to be useful, even with a catalyst, so the industrial compromise is 400–500 °C: hot enough for a practical rate, cool enough that a meaningful equilibrium conversion remains.',
        'Even at those conditions, only about 15–20 per cent of the gas converts per pass. The unreacted nitrogen and hydrogen are separated from the ammonia and recycled, so the overall yield is high even though the per-pass conversion is modest. That recycle loop is the engineering idea that turned a laboratory curiosity into a process that could feed a continent.',
      ],
      assumptions: [
        'The gases behave ideally enough for the equilibrium expression to be a useful approximation; at 200 atmospheres the correction is significant but calculable.',
        'The catalyst is not poisoned by sulfur or oxygen compounds, which is why the feed gas is purified carefully.',
        'The reactor is at steady state and the recycle loop is closed, so the per-pass conversion is not the overall yield.',
      ],
    },
    {
      kind: 'table',
      heading: 'The natural and industrial routes compared',
      columns: ['Route', 'Conditions', 'Energy cost', 'Where it happens'],
      rows: [
        ['Nitrogenase', 'Ambient temperature and pressure; 16 ATP per N₂', 'Biological energy, not heat', 'Rhizobia, cyanobacteria, some free-living bacteria'],
        ['Haber–Bosch', '400–500 °C, 150–250 atm, iron catalyst', 'About 1–2 per cent of global energy use', 'Industrial plants, usually fed by natural gas'],
        ['Lightning', 'Plasma channel, thousands of kelvin', 'Negligible globally; small fixed quantity', 'Atmosphere'],
        ['Ostwald process', 'Ammonia oxidised over platinum', 'Downstream of Haber–Bosch', 'Nitric acid plants'],
      ],
      note:
        'Haber–Bosch is not the only way to fix nitrogen, but it is the only one that currently operates at the scale of the human food system. Nitrogenase cannot be engineered into cereals yet, and lightning fixes far too little.',
    },
    {
      kind: 'misconception',
      heading: 'The process is not simply a good thing',
      claim: '"Haber–Bosch is one of the great humanitarian achievements, so its critics are attacking science."',
      correction:
        'Both halves of that sentence are wrong in an instructive way. The process does feed roughly half the world, and that is a genuine achievement. It also made Germany’s munitions industry independent of imported nitrates in the First World War, and Haber personally supervised the first chlorine gas attack at Ypres. The same ammonia that becomes fertiliser becomes explosive. Today the process consumes about one to two per cent of global energy and produces a similar share of carbon dioxide, and the nitrogen that runs off fields drives eutrophication and nitrous oxide emissions. The technology is not good or evil; it is a capability with consequences, and the consequences are large enough to require management rather than celebration.',
    },
    {
      kind: 'prose',
      heading: 'The green ammonia problem',
      body: [
        'The obvious improvement is to make the hydrogen without fossil carbon. Currently most hydrogen comes from steam methane reforming, which releases CO₂; electrolysis powered by renewables would remove that. The ammonia itself can then be burned as a fuel or used as a hydrogen carrier, which is why "green ammonia" has become a serious industrial target rather than a slogan. The chemistry is the same; the energy source and the carbon accounting are not.',
        'The harder problem is the catalyst. Iron works, but it needs high pressure and temperature, and the recycle loop is expensive. Research on ruthenium catalysts, electrochemical synthesis and plasma-assisted fixation is aimed at milder conditions. None has yet displaced the iron process at scale, and the reason is not conservatism: ammonia plants are enormous capital investments with decades of optimisation behind them. A new chemistry has to beat not just the thermodynamics but the accumulated engineering.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If nitrogen fixation is so energetically expensive, how did the nitrogen cycle stay balanced before industrial fertiliser?',
        'Could cereals be engineered to host nitrogen-fixing bacteria, and what would that change?',
        'Is "green ammonia" a fuel, a fertiliser feedstock, or both, and does the distinction matter for policy?',
        'What would happen to the global food supply if Haber–Bosch stopped tomorrow?',
      ],
    },
  ],
  sources: [
    { label: 'F. Haber, "The synthesis of ammonia from its elements", Nobel Lecture (1920)', url: 'https://www.nobelprize.org/prizes/chemistry/1918/haber/lecture/' },
    { label: 'C. Bosch, "The development of the ammonia synthesis", Nobel Lecture (1932)', url: 'https://www.nobelprize.org/prizes/chemistry/1931/bosch/lecture/' },
    { label: 'J. W. Erisman et al., "How a century of ammonia synthesis changed the world", Nature Geoscience 1, 636 (2008)', url: 'https://doi.org/10.1038/ngeo325' },
    { label: 'V. Smil, Enriching the Earth: Fritz Haber, Carl Bosch, and the Transformation of World Food Production (MIT Press, 2001)', url: 'https://mitpress.mit.edu/9780262693134/enriching-the-earth/' },
  ],
  related: ['horizontal-gene-transfer', 'mycorrhizal-networks', 'belousov-zhabotinsky'],
};

export const CHEMISTRY_DOSSIERS = [
  BZ_REACTION_DOSSIER,
  CHIRALITY_DOSSIER,
  HABER_BOSCH_DOSSIER,
];

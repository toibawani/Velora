// Human-written curriculum for VELORA. These notes are written for a curious person, not a textbook dump.
/**
 * Chemistry curriculum for VELORA.
 *
 * The first subject outside the original three, and the reason the Atlas
 * resolver had to learn about disciplines: the Atlas files these topics under
 * Science > Chemistry, and the field-to-subject map would otherwise have looked
 * for them in the physics curriculum and reported all seven as unwritten.
 */
export const CHEMISTRY_CURRICULUM = {
  name: 'Chemistry',
  description: 'How atoms join, break apart and rearrange, from a salt crystal to a living cell.',
  modules: [
    { id: 'physical-chemistry', title: 'Physical chemistry', intro: 'The rules a reaction has to obey before it can happen.', topics: [
      { id: 'atomic-structure', title: 'Atomic Structure', kicker: 'Why the periodic table works, and what an orbital actually is', minutes: 14,
        story: 'Chemistry began as a list of recipes: which powder turns which flame which colour. The reason the recipes repeat in patterns took another century, and the answer is that the electrons around a nucleus are only allowed certain arrangements. Everything in this subject follows from those arrangements.',
        sections: [
          { heading: 'Dalton makes it countable', body: 'John Dalton argued in 1808 that each element is made of identical atoms with a fixed weight, and that compounds combine in whole-number ratios. That is why 18 grams of water always contains 2 grams of hydrogen and 16 of oxygen, whatever you started with. Amedeo Avogadro proposed in 1811 that equal volumes of gas hold equal numbers of particles, and Stanislao Cannizzaro used that in 1858 to sort out the muddle over atomic weights that had lasted fifty years.' },
          { heading: 'Why the table works before the reason was known', body: 'Dmitri Mendeleev arranged the elements by atomic weight in 1869 and left gaps where a weight did not fit the pattern of properties. He predicted the properties of gallium and germanium, and they were found within twenty years with roughly the numbers he had guessed. The table worked before anyone knew about electron shells, which is why it is the most successful piece of pattern-spotting in the physical sciences.' },
          { heading: 'Electrons in shells, for a reason', body: 'J. J. Thomson found the electron in 1897, Rutherford placed the nucleus in 1911, and Bohr gave the shells energies in 1913. It takes 13.6 electronvolts to remove the electron from a hydrogen atom, and the pattern of such energies across the elements is what builds the table. A caesium atom holds its outermost electron loosely at about 3.9 electronvolts, so it gives it away easily; a neon atom holds on tight, so it does nothing at all.' },
          { heading: 'What the picture gets wrong', body: 'An orbital is not a path. It is a region where the electron is likely to be found, and for the ground state of hydrogen the probability is highest right at the nucleus, which is a fact with consequences: it is why a proton can capture an electron and turn into a neutron. Drawing atoms as tiny solar systems is a useful lie that has to be given up before the chemistry of transition metals makes any sense.' }
        ], connections: ['Bonding is what these outer electrons do next.', 'The periodic table is the summary of this lesson, arranged as a grid.', 'Thermodynamics decides whether the arrangements actually form.'], uncertainty: 'What an atom is, as opposed to how it computes, is still argued. The orbitals are calculable and the spectra match to many decimal places, but whether the wave function describes something real or a state of knowledge is the same question physicists have about quantum mechanics, and chemists mostly work around it.', career: 'Materials and semiconductor design, spectroscopy, nuclear medicine, and every calculation in computational chemistry.', 
        sources: [
          { label: 'OpenStax Chemistry 2e, 6.4 Electronic Structure of Atoms', url: 'https://openstax.org/books/chemistry-2e/pages/6-4-electronic-structure-of-atoms-electron-configurations' },
          { label: 'Wikipedia, "Atomic theory" (Dalton 1808 and the weight disputes)', url: 'https://en.wikipedia.org/wiki/Atomic_theory' },
          { label: 'Wikipedia, "Periodic table" (Mendeleev, 1869, and the predicted gaps)', url: 'https://en.wikipedia.org/wiki/Periodic_table' }
        ]
      },
      { id: 'chemical-bonding', title: 'Chemical Bonding', kicker: 'Two theories, one bond, and a permanent argument about which to teach', minutes: 15,
        story: 'Hold two hydrogen atoms close together and they stick, releasing 436 kilojoules per mole when they do. Separate them by a little more than a tenth of a nanometre and they stop caring about each other. Almost all of chemistry is the negotiation in between.',
        sections: [
          { heading: 'Lewis pairs, 1916', body: 'Gilbert Lewis proposed that atoms bond by sharing pairs of electrons, to reach a stable count of eight in the outer shell. The idea predicted the formulas of most simple compounds without any quantum mechanics, and the dot structures are still drawn on every whiteboard. Sodium chloride is the other case: sodium gives an electron away completely and the two ions then hold together by plain electrostatic attraction, which is why salt forms a lattice rather than molecules.' },
          { heading: 'Two quantum theories of one bond', body: 'In 1927 Walter Heitler and Fritz London calculated the hydrogen molecule using quantum mechanics and got the bond energy roughly right, which founded valence bond theory. Within a year Friedrich Hund and Robert Mulliken developed molecular orbital theory, which spreads the electrons over the whole molecule instead. Both reproduce the same bond, and they are approximations of the same underlying physics with different bookkeeping.' },
          { heading: 'Why the argument is still live', body: 'Molecular orbital theory is the standard tool for spectra, magnetism and excited states, and it predicts that oxygen should be magnetic, which it is. Valence bond language is how chemists describe shapes and reaction mechanisms, because a curly arrow moving an electron pair is a sentence about a bond that people can follow. Textbooks pick one, courses pick one, and students meet the other later and have to reconcile them. That is a pedagogical disagreement with real consequences, not a scientific one: nobody disputes the measurements.' },
          { heading: 'Polar bonds and the shape of water', body: 'Linus Pauling introduced electronegativity in 1932 to rank how strongly an atom pulls shared electrons, from caesium at 0.7 to fluorine at 4.0. A bond between atoms far apart on that scale is polar, so hydrogen chloride carries a partial charge. Water is the extreme case: two O-H bonds at 104.5 degrees, both polar, and hydrogen bonds between molecules. Those bonds are why ice is less dense than water at 0.917 grams per cubic centimetre, which is why lakes freeze from the top and fish survive underneath.' }
        ], connections: ['Bond energies are the numbers thermodynamics uses.', 'Reaction mechanisms are written in the language of bonds breaking and forming.', 'Intermolecular forces decide boiling points and solubility.'], uncertainty: 'Which theory to teach first is a genuine and unresolved curriculum argument. There is also a live research dispute about charge-shift bonds, where the bond is held together mainly by the fluctuating ionic structures rather than by the shared pair, and the community has not agreed on how many bonds are of that kind.', career: 'Drug design and medicinal chemistry, polymer and materials development, catalysis, and the computational modelling of reaction pathways.', 
        sources: [
          { label: 'OpenStax Chemistry 2e, 8.1 Valence Bond Theory', url: 'https://openstax.org/books/chemistry-2e/pages/8-1-valence-bond-theory' },
          { label: 'OpenStax Chemistry 2e, 8.4 Molecular Orbital Theory', url: 'https://openstax.org/books/chemistry-2e/pages/8-4-molecular-orbital-theory' },
          { label: 'Wikipedia, "Chemical bond" (Lewis 1916 and the two quantum theories)', url: 'https://en.wikipedia.org/wiki/Chemical_bond' },
          { label: 'Wikipedia, "Molecular orbital theory" (Hund and Mulliken, 1928)', url: 'https://en.wikipedia.org/wiki/Molecular_orbital_theory' }
        ]
      },
      { id: 'thermodynamics', title: 'Thermodynamics', kicker: 'Whether a reaction can go, before anyone asks how fast', minutes: 15,
        story: 'Burn methane and it gives out heat and keeps going. Mix nitrogen and hydrogen and nothing happens until you heat them and push them against a catalyst. Both reactions are thermodynamically allowed. The difference is one of energy accounting, and it is the first question to ask about any reaction.',
        sections: [
          { heading: 'Enthalpy is the heat account', body: 'At constant pressure, the heat a reaction gives out or takes in is its change in enthalpy, written delta H. Burning one mole of methane releases about 890 kilojoules, which is why a gas hob works. Germain Hess noticed in 1840 that the total heat change depends only on where you start and finish, not on the route, which means you can add up known reactions to get an unknown one. That is how most of the numbers in a data table were assembled.' },
          { heading: 'Entropy is the other half', body: 'Melting one mole of ice takes in about 6 kilojoules of heat and raises its entropy by about 22 joules per kelvin, because liquid water can be arranged in far more ways than the ordered crystal. Entropy is a count of arrangements, not a measure of mess, and the second law says the total of it in the universe increases. A reaction that reduces the entropy of the system can still happen if it dumps enough heat into the surroundings to raise theirs more.' },
          { heading: 'Gibbs ties them together', body: 'Josiah Willard Gibbs worked out in the 1870s that the useful criterion is delta G equals delta H minus T delta S, where G is the Gibbs free energy. When it is negative the reaction can go; when it is positive it cannot, at least not without help. Water boiling is the clearest example: below 100 degrees Celsius at one atmosphere the entropy gain of turning liquid into gas does not outweigh the enthalpy cost, and above it, it does.' },
          { heading: 'What the number does not tell you', body: 'A negative delta G says a reaction is allowed. It says nothing about how long it takes. A diamond at room temperature is thermodynamically unstable with respect to graphite and the conversion is so slow that nobody has watched it happen at ordinary conditions. Coal sitting in air is unstable and safe, until you light it. Thermodynamics answers whether, kinetics answers when, and confusing the two is how people end up expecting a spontaneous reaction to happen promptly.' }
        ], connections: ['Kinetics is the other half of the question, and the next lesson but one.', 'Equilibrium is where the Gibbs energy is at its lowest.', 'Bond energies from the previous lesson are what the enthalpy numbers are made of.'], uncertainty: 'The word "disorder" for entropy survives in textbooks and misleads, because a tidy-looking system can hold more arrangements than a messy one. There is also an active question about how far thermodynamic reasoning extends to single molecules, where fluctuations are larger than the averages the theory is built on.', career: 'Process and reactor design, refrigeration and heat pumps, battery and fuel development, and any job that has to say whether a proposed reaction is worth building.', 
        sources: [
          { label: 'OpenStax Chemistry 2e, 5.3 Enthalpy', url: 'https://openstax.org/books/chemistry-2e/pages/5-3-enthalpy' },
          { label: 'OpenStax Chemistry 2e, 5.1 Energy Basics', url: 'https://openstax.org/books/chemistry-2e/pages/5-1-energy-basics' },
          { label: 'Wikipedia, "Gibbs free energy" (Gibbs, 1870s, and the criterion for spontaneity)', url: 'https://en.wikipedia.org/wiki/Gibbs_free_energy' }
        ]
      },
      { id: 'chemical-equilibrium', title: 'Chemical Equilibrium', kicker: 'Why a reaction that looks finished is still running both ways', minutes: 14,
        story: 'Seal nitrogen and hydrogen in a vessel with an iron catalyst and heat it, and the ammonia concentration climbs, then stops changing. Nothing has run out. The forward and reverse reactions are still going at the same rate, which is why the mixture sits still while the molecules do not.',
        sections: [
          { heading: 'A balance of rates, not a stopping point', body: 'Equilibrium arrives when the rate of the forward reaction equals the rate of the reverse one, so the concentrations stop changing even though both processes continue. The ratio of products to reactants at that point, each raised to its coefficient, is a constant at a given temperature. It is a ratio of rate constants, which is where it comes from, and that is why changing the temperature changes it while adding a catalyst does not.' },
          { heading: 'Le Chatelier, 1884', body: 'Henri Louis Le Chatelier stated a rule of thumb: disturb a system at equilibrium and it shifts in the direction that opposes the disturbance. Add reactant and it consumes some; raise the pressure and it moves toward the side with fewer gas molecules. The rule works for most textbook cases and is not a law, because it is a summary of what the equilibrium constant already implies rather than an independent principle.' },
          { heading: 'The Haber process, and why it runs hot', body: 'Making ammonia from nitrogen and hydrogen releases heat and reduces the number of gas molecules, so a low temperature and a high pressure both favour the product. The first plant ran around 200 atmospheres and 500 degrees Celsius with an iron catalyst, which looks like defying the thermodynamics until you notice the other constraint: at 200 degrees the reaction is so slow that no useful amount forms. The industrial conditions are a compromise between yield and rate, and the same compromise appears in almost every real process.' },
          { heading: 'Water, and the constant you already know', body: 'Water molecules split into hydrogen and hydroxide ions, and at 25 degrees Celsius the product of their concentrations is 1.0 x 10^-14 moles squared per litre squared. That single number is why a solution with a hydrogen ion concentration of 10^-7 moles per litre is neutral, why pH is defined as the negative logarithm of that concentration, and why adding acid to water cannot make it simultaneously acidic and basic. Every buffer in your blood is running this arithmetic.' }
        ], connections: ['Kinetics explains how fast equilibrium is reached.', 'Gibbs energy tells you where the equilibrium lies.', 'Acids and bases are a special case of the same constant.'], uncertainty: 'Le Chatelier\'s principle is taught as though it were a law and it is not one: for some systems, including certain coupled reactions, a naive application gives the wrong direction. The equilibrium constant is the reliable statement, and how much to lean on the rule of thumb is a teaching decision that specialists disagree about.', career: 'Industrial process chemistry, pharmaceutical manufacturing, water treatment and pH control, and the design of any reactor that has to run near equilibrium.', 
        sources: [
          { label: 'OpenStax Chemistry 2e, 13.1 Chemical Equilibria', url: 'https://openstax.org/books/chemistry-2e/pages/13-1-chemical-equilibria' },
          { label: 'Wikipedia, "Chemical equilibrium" (the rate balance and the constant)', url: 'https://en.wikipedia.org/wiki/Chemical_equilibrium' },
          { label: 'Wikipedia, "Haber process" (the 1913 plant and its operating conditions)', url: 'https://en.wikipedia.org/wiki/Haber_process' }
        ]
      },
      { id: 'chemical-kinetics', title: 'Chemical Kinetics', kicker: 'How fast, and why heating a reaction works so well', minutes: 14,
        story: 'A match and a log are both wood and oxygen. One burns in a second and the other over an hour, and the difference is not the chemistry but the temperature and the surface. Kinetics is the study of that difference, and it is where most of the practical difficulty in chemistry lives.',
        sections: [
          { heading: 'Rate laws are measured', body: 'The rate of a reaction is usually proportional to the concentrations of the reactants raised to some powers, and those powers have to be measured. They are not the coefficients in the balanced equation, which is the mistake everyone makes once. Doubling the concentration of one reactant and watching what happens to the rate gives its order directly, and the orders add up to the overall order, which can be fractional because a reaction is usually a sequence of steps.' },
          { heading: 'Arrhenius, 1889', body: 'Svante Arrhenius explained why rates climb so steeply with temperature. Molecules have to collide with enough energy to break the bonds that are in the way, and raising the temperature shifts the distribution of collision energies upward. As a rough rule a reaction roughly doubles or triples in rate for every 10 degrees Celsius near room temperature, which is why a fridge slows food spoiling and why a fever of 40 degrees is dangerous rather than merely uncomfortable.' },
          { heading: 'Catalysts change the route, not the destination', body: 'A catalyst provides a different path with a lower activation energy, so a larger fraction of collisions succeeds. It does not change where the equilibrium sits, because the reverse reaction uses the same route in the other direction and gets the same speed-up. That is why a catalyst cannot make an impossible reaction happen, and why the same catalyst can be poisoned by something that sticks to its surface, which is a serious problem in any industrial reactor.' },
          { heading: 'Enzymes, and the fastest chemistry we know', body: 'Enzymes are catalysts made of protein, and Michaelis and Menten described their kinetics in 1913 with an equation that is still in use. Carbonic anhydrase converts carbon dioxide and water into bicarbonate at up to a million reactions per second per molecule, which is what lets your blood carry carbon dioxide out of your tissues. That rate is not a chemical curiosity: without it, the reaction would be far too slow to keep up with breathing.' }
        ], connections: ['Equilibrium says where a reaction stops; kinetics says how long it takes to get there.', 'Catalysts are central to the Haber process and to every living cell.', 'Temperature dependence connects to the thermodynamics of the previous lesson.'], uncertainty: 'Whether some enzymes move hydrogen by quantum tunnelling rather than by climbing over the barrier has been argued since the 1990s. The effect is now accepted for several enzymes, and how large a contribution it makes generally is still being measured rather than assumed.', career: 'Pharmaceutical stability and formulation, food science, catalyst design, and the safety analysis of any exothermic process.', 
        sources: [
          { label: 'OpenStax Chemistry 2e, 12.5 Collision Theory', url: 'https://openstax.org/books/chemistry-2e/pages/12-5-collision-theory' },
          { label: 'OpenStax Chemistry 2e, 12.1 Chemical Reaction Rates', url: 'https://openstax.org/books/chemistry-2e/pages/12-1-chemical-reaction-rates' },
          { label: 'Wikipedia, "Arrhenius equation" (Arrhenius, 1889)', url: 'https://en.wikipedia.org/wiki/Arrhenius_equation' }
        ]
      },
      { id: 'electrochemistry', title: 'Electrochemistry', kicker: 'Chemistry that pushes electrons down a wire', minutes: 14,
        story: 'Put a strip of zinc and a strip of copper into a beaker of acid, connect them with a wire, and a current flows. Separate the two halves with a salt bridge and the same reaction gives you a steady voltage. That arrangement is the ancestor of every battery in the room.',
        sections: [
          { heading: 'Volta, and the first steady current', body: 'Alessandro Volta stacked zinc and copper discs separated by cloth soaked in brine in 1800 and produced the first continuous electric current, which within months was being used to split water. John Frederic Daniell built a better cell in 1836 that gave about 1.1 volts and did not produce hydrogen gas at the copper electrode, which made the telegraph possible. The unit of potential is named after Volta, which is why a volt is what it is.' },
          { heading: 'Redox is electron bookkeeping', body: 'A reaction in which one species loses electrons and another gains them is a redox reaction, and oxidation numbers are the accounting system that tracks it. Zinc metal loses two electrons per atom to become zinc ions, and copper ions gain two to become copper metal. Written as two half reactions, each can be measured separately against a standard hydrogen electrode, which is defined as zero volts by convention rather than discovered.' },
          { heading: 'The Nernst equation', body: 'Walther Nernst showed in 1889 how the voltage of a cell changes as the concentrations change, which is why a battery goes flat as its reactants are consumed. At room temperature the correction works out at about 0.059 volts per factor of ten in the reaction quotient, which is how a pH meter turns a voltage into a number. The Faraday constant, 96,485 coulombs per mole, is the conversion between electrons and moles, and it is what makes the arithmetic possible.' },
          { heading: 'From lead-acid to lithium-ion', body: 'Gaston Plante built the first practical lead-acid battery in 1859 and the chemistry is still in every petrol car, because it is cheap and can deliver huge currents. Lithium-ion cells, commercialised by Sony in 1991, reach about 3.7 volts per cell and store far more energy per kilogram, which is why they are in phones and cars. The trade-off is that the electrolyte and the electrodes degrade with each cycle, and that degradation is the main reason a phone battery is a consumable.' }
        ], connections: ['Thermodynamics decides the cell voltage through the Gibbs energy.', 'Kinetics decides how much current you can draw.', 'Corrosion is the same chemistry happening where you did not want it.'], uncertainty: 'Why a lithium-ion cell degrades at the rate it does is still being unpicked, because several mechanisms run at once and separate cleanly only in carefully prepared samples. Which successor chemistry wins is genuinely open: sodium-ion, solid-state and lithium-sulfur all have working cells and unsolved engineering.', career: 'Battery and fuel-cell engineering, corrosion protection, electroplating and refining, and the design of sensors from a pH probe to a glucose monitor.', 
        sources: [
          { label: 'OpenStax Chemistry 2e, 17.2 Galvanic Cells', url: 'https://openstax.org/books/chemistry-2e/pages/17-2-galvanic-cells' },
          { label: 'Wikipedia, "Nernst equation" (Nernst, 1889)', url: 'https://en.wikipedia.org/wiki/Nernst_equation' },
          { label: 'Wikipedia, "Lithium-ion battery" (Sony, 1991)', url: 'https://en.wikipedia.org/wiki/Lithium-ion_battery' }
        ]
      },
      { id: 'solutions', title: 'Solutions', kicker: 'Why salt melts ice, and why your blood does not freeze', minutes: 13,
        story: 'Stir sugar into water and it disappears. Stir sand and it does not. The difference is not size or softness but a competition between the forces holding the solid together and the forces the solvent can offer each particle, and most of what follows is about counting particles rather than identifying them.',
        sections: [
          { heading: 'Dissolving is a tug of war', body: 'A solute dissolves when the solvent can stabilise its particles better than the solute stabilises itself. Water is unusually good at this because it is polar, so it can surround an ion with the opposite end of the molecule facing it. That is why salt dissolves and oil does not, and why "like dissolves like" is a rule that works more often than it deserves to. The process also has an entropy term: dispersing particles increases the count of arrangements, which helps even when the energy cost is unfavourable.' },
          { heading: 'Concentration has more than one meaning', body: 'Molarity is moles of solute per litre of solution, which changes slightly with temperature because the volume does. Molality is moles per kilogram of solvent, which does not. For dilute aqueous solutions at room temperature the two are nearly equal and are used interchangeably in casual work, which is fine until it is not: a 1 molar sodium chloride solution is about 0.98 molal, and the difference matters in precise physical chemistry.' },
          { heading: 'Colligative properties count particles', body: 'Dissolving something in water raises its boiling point and lowers its freezing point, and the size of the effect depends on how many particles are present rather than on what they are. Water\'s freezing point drops by 1.86 degrees Celsius per mole of particles per kilogram, and its boiling point rises by 0.512. That is why salt on a road works, and why a 1 molal solution of sodium chloride lowers the freezing point by about 3.7 degrees rather than 1.86, because the salt splits into two ions.' },
          { heading: 'Osmosis, and why cells need it controlled', body: 'A membrane that lets water through but not solute produces an osmotic pressure, described by van \'t Hoff in 1887 with an equation that looks like the ideal gas law. Blood plasma has an osmotic pressure of about 7.7 atmospheres, which is why a red blood cell in pure water swells until it bursts and one in strong brine shrivels. Seawater is about 35 grams of dissolved salts per kilogram and needs roughly 25 atmospheres of pressure to desalinate by reverse osmosis.' }
        ], connections: ['Equilibrium constants are written in concentrations, so this lesson supplies the units.', 'Electrochemistry needs ions in solution to work at all.', 'Colligative properties are measured to find molecular masses.'], uncertainty: 'The structure of liquid water is still not settled in detail. It is not a simple mixture of molecules and it is not a continuous random network either, and a long-running proposal that it contains two distinct liquid structures remains contested on the evidence.', career: 'Water treatment and desalination, formulation of medicines and foods, cryoprotectant design, and analytical chemistry of every kind.', 
        sources: [
          { label: 'OpenStax Chemistry 2e, 11.4 Colligative Properties', url: 'https://openstax.org/books/chemistry-2e/pages/11-4-colligative-properties' },
          { label: 'Wikipedia, "Colligative properties" (the freezing and boiling point coefficients)', url: 'https://en.wikipedia.org/wiki/Colligative_properties' },
          { label: 'Wikipedia, "Osmosis" (van \'t Hoff, 1887)', url: 'https://en.wikipedia.org/wiki/Osmosis' }
        ]
      }
    ] },
    { id: "organic-chemistry", title: "Organic Chemistry", intro: "Carbon builds the molecules of life and of most of industry.", topics: [
      { id: "hydrocarbons", title: "Hydrocarbons", kicker: "Carbon chains that burn, bend and isomerise", minutes: 13,
        story: "Hydrocarbons are compounds of carbon and hydrogen only, and they are the simplest organic molecules. They are also the fuel of civilisation and the skeleton on which every more complicated molecule is built.",
        sections: [
          { heading: "Alkanes, alkenes, alkynes", body: "Alkanes are saturated: every carbon is joined to four neighbours by single bonds, giving formulas CnH2n+2. Alkenes have at least one carbon-carbon double bond (CnH2n), and alkynes a triple bond (CnH2n-2). The double bond is both shorter and more reactive, which is why an alkene can be hydrogenated to an alkane while an alkane will not add anything under mild conditions." },
          { heading: "Aromatic rings", body: "Benzene, C6H6, is a six-membered ring with delocalised electrons. It is far less reactive than a simple alkene because the delocalisation lowers its energy. Kekule proposed the ring structure in 1865, and the delocalised picture came later. Aromaticity is a stability rule, not a shape." },
          { heading: "Isomerism", body: "The same molecular formula can describe different structures. Butane and isobutane are structural isomers; cis- and trans-2-butene are geometric isomers around a double bond. The number of possible isomers grows fast: decane has 75, and larger molecules have millions, which is why a single formula tells you little about the substance." },
          { heading: "Fuels and cracking", body: "Crude oil is a mixture of hydrocarbons. Fractional distillation separates them by boiling point, and catalytic cracking breaks heavy fractions into the lighter petrol and diesel fractions that engines need. The octane rating of petrol measures how readily the fuel ignites under compression." }
        ], connections: ["Functional groups are hydrocarbons with an atom swapped in.", "Thermochemistry measures the heat released on burning them.", "Polymers are long hydrocarbon chains."], uncertainty: "How much of the complexity of petroleum chemistry can be predicted from first principles, and how much must be measured, is still a live question in computational chemistry.", career: "Petrochemicals, fuel formulation, and organic synthesis.",
        sources: [
          { label: "OpenStax Chemistry 2e, 20.1 Hydrocarbons", url: "https://openstax.org/books/chemistry-2e/pages/20-1-hydrocarbons" },
          { label: "Wikipedia, \"Hydrocarbon\"", url: "https://en.wikipedia.org/wiki/Hydrocarbon" }
        ]
      },
      { id: "functional-groups", title: "Functional Groups", kicker: "The atom that decides what a molecule does", minutes: 13,
        story: "A functional group is a small cluster of atoms attached to a carbon skeleton that gives a molecule its characteristic reactions. Change the group and you change the chemistry while keeping the skeleton the same.",
        sections: [
          { heading: "The common groups", body: "An alcohol carries -OH, an aldehyde -CHO, a ketone C=O, a carboxylic acid -COOH, an ester -COOR, an amine -NH2. Each has a recognisable reaction pattern: carboxylic acids donate a proton, alcohols can be oxidised, amines are basic. The skeleton is a scaffold; the group is the chemistry." },
          { heading: "Naming", body: "The IUPAC system names a molecule from its longest carbon chain and the functional group with the highest priority. A carboxylic acid outranks an alcohol, which outranks an alkene. The suffix changes with the group: -ol for an alcohol, -al for an aldehyde, -oic acid for a carboxylic acid." },
          { heading: "Why the group matters", body: "Ethane is inert; ethanol is a solvent and a drug. The difference is one oxygen and one hydrogen. A hydroxyl group makes the molecule polar, able to hydrogen-bond, and able to be metabolised. This is the central idea of organic chemistry: structure determines function." },
          { heading: "Reactivity patterns", body: "Functional groups react in characteristic ways: nucleophilic substitution at a carbon-halogen bond, electrophilic addition to a double bond, condensation between an acid and an alcohol to make an ester. Recognising the group tells you which reactions are possible before you look up the mechanism." }
        ], connections: ["Hydrocarbons are the skeleton these groups attach to.", "Reactions are how groups are made and changed.", "Biomolecules are defined by their functional groups."], uncertainty: "The boundary between organic and inorganic chemistry is conventional, not natural: organometallic compounds and carbonates sit awkwardly on either side.", career: "Organic synthesis, medicinal chemistry, and materials design.",
        sources: [
          { label: "OpenStax Chemistry 2e, 20.2 Alcohols and Ethers", url: "https://openstax.org/books/chemistry-2e/pages/20-2-alcohols-and-ethers" },
          { label: "Wikipedia, \"Functional group\"", url: "https://en.wikipedia.org/wiki/Functional_group" }
        ]
      },
      { id: "reactions", title: "Reactions", kicker: "How organic molecules are made and unmade", minutes: 14,
        story: "Organic reactions are classified by what happens to the bonds: substitution swaps one group for another, addition puts atoms across a double bond, elimination removes atoms to make one, and rearrangement moves atoms within the molecule.",
        sections: [
          { heading: "Substitution", body: "In nucleophilic substitution a nucleophile, an electron-rich species, replaces a leaving group. The SN1 mechanism goes through a carbocation intermediate; SN2 is a single concerted step with inversion of configuration. Which one operates depends on the substrate, the solvent and the nucleophile." },
          { heading: "Addition and elimination", body: "Addition puts two atoms across a carbon-carbon double bond, as in hydrogenation or halogenation. Elimination does the reverse, removing HX to form an alkene, and is favoured by heat and a strong base. The two are the forward and reverse of the same change." },
          { heading: "Oxidation and reduction", body: "In organic chemistry, oxidation usually means gaining oxygen or losing hydrogen; reduction means the reverse. Primary alcohols oxidise to aldehydes and then carboxylic acids; secondary alcohols oxidise to ketones; tertiary alcohols resist oxidation because there is no hydrogen on the carbon bearing the OH." },
          { heading: "Mechanisms", body: "A mechanism is a step-by-step account of how bonds break and form, using curved arrows for electron movement. It is a model, not a photograph, and the evidence comes from kinetics, isotope labelling and stereochemistry. A good mechanism predicts products you have not yet made." }
        ], connections: ["Functional groups determine which reactions are possible.", "Thermodynamics says whether a reaction is allowed.", "Kinetics says how fast."], uncertainty: "Whether a reaction proceeds by one mechanism or another can be genuinely ambiguous, and the accepted mechanism for a familiar reaction has changed more than once.", career: "Synthetic chemistry, process development, and pharmaceutical research.",
        sources: [
          { label: "OpenStax Chemistry 2e, 20.3 Aldehydes, Ketones, Carboxylic Acids, and Esters", url: "https://openstax.org/books/chemistry-2e/pages/20-3-aldehydes-ketones-carboxylic-acids-and-esters" },
          { label: "Wikipedia, \"Organic reaction\"", url: "https://en.wikipedia.org/wiki/Organic_reaction" }
        ]
      },
      { id: "polymers", title: "Polymers", kicker: "Long chains, and the materials they make", minutes: 13,
        story: "A polymer is a molecule made of repeating units, monomers, linked into a long chain. Natural polymers include DNA, proteins and cellulose; synthetic ones include polyethylene and nylon. The properties come from the chain length, the side groups and the way the chains pack together.",
        sections: [
          { heading: "Addition and condensation", body: "Addition polymers form when monomers with double bonds add to a growing chain, as in polyethylene from ethene. Condensation polymers form when monomers with two functional groups join with the loss of a small molecule such as water, as in nylon or polyester. The two routes give different backbones and different properties." },
          { heading: "Structure and properties", body: "Thermoplastics soften on heating and can be remoulded; thermosets cross-link permanently and do not. Crystalline regions give strength and opacity; amorphous regions give flexibility. The glass transition temperature is where a polymer goes from glassy to rubbery, and it is set by the side groups and the chain stiffness." },
          { heading: "Natural polymers", body: "Cellulose is a polymer of glucose with beta linkages that humans cannot digest; starch has alpha linkages and we can. Proteins are polymers of amino acids folded into specific shapes. DNA is a polymer of nucleotides whose sequence carries information." },
          { heading: "Waste and recycling", body: "Most commodity plastics are not biodegradable, and their accumulation is a genuine problem. Mechanical recycling reprocesses clean material; chemical recycling breaks polymers back to monomers. The economics usually favour virgin material, which is the real barrier, not the chemistry." }
        ], connections: ["Functional groups determine how monomers join.", "Materials chemistry studies the resulting properties.", "Biochemistry studies the natural polymers."], uncertainty: "Whether biodegradable plastics can match the performance and cost of conventional ones at scale is still being worked out, and the answer varies by application.", career: "Polymer science, materials engineering, and sustainable materials.",
        sources: [
          { label: "OpenStax Chemistry 2e, 20.5 Polymers, Plastics, and Rubber", url: "https://openstax.org/books/chemistry-2e/pages/20-5-polymers-plastics-and-rubber" },
          { label: "Wikipedia, \"Polymer\"", url: "https://en.wikipedia.org/wiki/Polymer" }
        ]
      },
      { id: "biomolecules", title: "Biomolecules", kicker: "The molecules that make organisms work", minutes: 13,
        story: "Biomolecules are the organic molecules of living systems: proteins, nucleic acids, carbohydrates and lipids. Each class is built from a small set of monomers and does a distinct job, and the division of labour between them is one of the organising principles of biology.",
        sections: [
          { heading: "Proteins", body: "Proteins are polymers of 20 amino acids, folded into structures that catalyse reactions, provide structure and carry signals. The sequence determines the fold, and the fold determines the function. Denaturation by heat or pH destroys the function without breaking the chain." },
          { heading: "Nucleic acids", body: "DNA and RNA are polymers of nucleotides, each with a sugar, a phosphate and a base. DNA stores information in its sequence; RNA carries it to the ribosome. The double helix, with complementary base pairing, is how the information is copied." },
          { heading: "Carbohydrates", body: "Carbohydrates are sugars and their polymers. Glucose is the immediate fuel; glycogen and starch store it; cellulose gives plant cell walls their strength. They also modify proteins, which changes where the protein goes and how it is recognised." },
          { heading: "Lipids", body: "Lipids are not polymers. They include fats, oils, phospholipids and steroids. Fats store energy; phospholipids form the membranes that define cells; steroids such as cholesterol and the sex hormones are signalling molecules. Their common feature is insolubility in water." }
        ], connections: ["Biochemistry studies these molecules in the cell.", "Functional groups explain their reactivity.", "Proteins and nucleic acids are polymers."], uncertainty: "How the first biomolecules formed from simple chemistry on the early Earth is still open, and several plausible routes compete.", career: "Biochemistry, drug discovery, and biotechnology.",
        sources: [
          { label: "OpenStax Biology 2e, 3.2 Biological Molecules", url: "https://openstax.org/books/biology-2e/pages/3-2-biological-molecules" },
          { label: "Wikipedia, \"Biomolecule\"", url: "https://en.wikipedia.org/wiki/Biomolecule" }
        ]
      }
    ] },
    { id: "inorganic-chemistry", title: "Inorganic Chemistry", intro: "The elements that are not carbon, and the structures they make.", topics: [
      { id: "periodic-table", title: "Periodic Table", kicker: "The map of the elements, and why it is shaped as it is", minutes: 13,
        story: "The periodic table arranges the elements by atomic number and groups those with similar properties. Mendeleev's 1869 version predicted missing elements, and the modern version is ordered by proton count rather than atomic weight, which fixed the few places where weight and properties disagreed.",
        sections: [
          { heading: "Structure", body: "Rows are periods, columns are groups. Elements in the same group have the same number of valence electrons and similar chemistry: the alkali metals in group 1 each have one, the halogens in group 17 each have seven. The transition metals in the middle block fill inner d orbitals." },
          { heading: "Trends", body: "Atomic radius increases down a group and decreases across a period. Ionisation energy and electronegativity do the opposite. These trends follow from the balance between nuclear charge and electron shielding, and they predict reactivity: fluorine is the most electronegative element and the most reactive non-metal." },
          { heading: "Blocks", body: "The s-block (groups 1 and 2), p-block (groups 13 to 18), d-block (transition metals) and f-block (lanthanides and actinides) reflect which orbital is being filled. The shape of the table is a consequence of the quantum numbers, not a design choice." },
          { heading: "Gaps and anomalies", body: "Hydrogen sits above both lithium and fluorine because it resembles each in some ways. The lanthanides and actinides are pulled out to keep the table narrow. Superheavy elements beyond 118 have been synthesised but decay in milliseconds, and their chemistry is extrapolated." }
        ], connections: ["Atomic structure explains the table.", "Metals and non-metals are the two halves of it.", "Coordination chemistry uses the transition metals."], uncertainty: "Whether the table has a single best form is disputed; different layouts emphasise different patterns, and the IUPAC 1-to-18 numbering is a compromise rather than a discovery.", career: "Inorganic chemistry, materials science, and education.",
        sources: [
          { label: "OpenStax Chemistry 2e, 6.1 The Periodic Table", url: "https://openstax.org/books/chemistry-2e/pages/6-1-the-periodic-table" },
          { label: "Wikipedia, \"Periodic table\"", url: "https://en.wikipedia.org/wiki/Periodic_table" }
        ]
      },
      { id: "metals", title: "Metals", kicker: "Elements that give away electrons and conduct", minutes: 13,
        story: "Metals are elements that lose electrons easily, conduct heat and electricity, are malleable and ductile, and tend to form positive ions. They make up most of the periodic table and most of the mass of the Earth's crust and core.",
        sections: [
          { heading: "Properties", body: "Metallic bonding is a sea of delocalised electrons shared among a lattice of positive ions, which explains conductivity and malleability. The strength of the bond varies: mercury is liquid at room temperature, tungsten melts at 3422 degrees Celsius. Alloys such as steel and brass mix metals to tune hardness and corrosion resistance." },
          { heading: "Extraction", body: "Metals are usually found as oxides or sulfides. Iron is reduced from haematite with carbon monoxide in a blast furnace. Aluminium is extracted by electrolysis of alumina, which takes so much electricity that smelters are built where power is cheap." },
          { heading: "Transition metals", body: "The d-block metals have variable oxidation states and form coloured compounds and complex ions. Iron cycles between Fe2+ and Fe3+ in biology; copper and zinc are enzyme cofactors. Their catalytic ability comes from the ease of changing oxidation state." },
          { heading: "Corrosion", body: "Iron rusts when it oxidises in the presence of water and oxygen, a reaction that costs billions a year. Galvanising coats iron with zinc, which corrodes preferentially. Stainless steel adds chromium, which forms a protective oxide layer." }
        ], connections: ["Non-metals are the other half of the table.", "Coordination chemistry uses metal ions as centres.", "Electrochemistry is how metals are extracted and corroded."], uncertainty: "The line between metal and non-metal is not sharp: some elements near the staircase, such as silicon and arsenic, are semiconductors with intermediate properties.", career: "Metallurgy, materials engineering, and corrosion science.",
        sources: [
          { label: "OpenStax Chemistry 2e, 6.4 Electronic Structure of Atoms", url: "https://openstax.org/books/chemistry-2e/pages/6-4-electronic-structure-of-atoms" },
          { label: "Wikipedia, \"Metal\"", url: "https://en.wikipedia.org/wiki/Metal" }
        ]
      },
      { id: "non-metals", title: "Non-metals", kicker: "Elements that gain or share electrons", minutes: 13,
        story: "Non-metals are elements that tend to gain or share electrons, are poor conductors, and are often gases or brittle solids. They include the elements of air, water and life, and their chemistry is the chemistry of covalent bonds.",
        sections: [
          { heading: "Halogens", body: "The halogens in group 17 are highly reactive non-metals that form -1 ions and covalent compounds with almost everything. Fluorine is the most reactive and is used to make Teflon and to fluoridate water; chlorine disinfects water and makes PVC; iodine is essential for thyroid hormones." },
          { heading: "Noble gases", body: "The noble gases in group 18 have full valence shells and were long considered inert. Neon, argon and xenon do form compounds, mostly with fluorine, and xenon fluorides are used in synthesis. Argon fills light bulbs and shields welding; helium cools MRI magnets." },
          { heading: "Other non-metals", body: "Carbon, nitrogen, oxygen, phosphorus and sulfur are the backbone of biochemistry. Oxygen is the most abundant element in the Earth's crust and drives combustion and respiration. Nitrogen makes up 78 percent of the atmosphere and is fixed by bacteria and by the Haber process." },
          { heading: "Hydrogen", body: "Hydrogen is a non-metal that sits alone at the top of the table. It is the lightest element, the most abundant in the universe, and a fuel whose combustion yields only water. It is usually stored and transported as a gas, which is the main practical difficulty." }
        ], connections: ["Metals are the complement.", "Periodic trends explain the reactivity.", "Environmental chemistry tracks non-metal cycles."], uncertainty: "How best to classify the metalloids, and whether hydrogen should be placed above lithium or fluorine, is unsettled convention.", career: "Industrial gases, semiconductors, and environmental chemistry.",
        sources: [
          { label: "OpenStax Chemistry 2e, 7.6 Occurrence, Preparation, and Properties of Halogens", url: "https://openstax.org/books/chemistry-2e/pages/7-6-occurrence-preparation-and-properties-of-halogens" },
          { label: "Wikipedia, \"Nonmetal\"", url: "https://en.wikipedia.org/wiki/Nonmetal" }
        ]
      },
      { id: "coordination-chemistry", title: "Coordination Chemistry", kicker: "Metal ions surrounded by ligands", minutes: 13,
        story: "A coordination compound is a metal ion surrounded by molecules or ions called ligands, bound by coordinate bonds in which the ligand donates both electrons. These complexes are everywhere: in haemoglobin, in vitamin B12, in dyes and in catalysts.",
        sections: [
          { heading: "Ligands and geometry", body: "Ligands can be monodentate, binding through one atom, or multidentate, binding through several, which is the chelate effect. Complexes are commonly octahedral, tetrahedral or square planar, and the geometry follows from the metal and the ligands." },
          { heading: "Naming and isomerism", body: "Werner's coordination theory, proposed in 1893, explained why compounds such as CoCl3.6NH3 existed as distinct forms. Complexes show geometric and optical isomerism: cisplatin, the anticancer drug, is the cis isomer; the trans isomer is inactive." },
          { heading: "Colour and magnetism", body: "The d orbitals of a transition metal split in energy when ligands approach. Electrons moving between the split levels absorb visible light, which is why complexes are coloured. The same splitting determines whether the complex is paramagnetic or diamagnetic." },
          { heading: "Applications", body: "Coordination chemistry is the basis of metal extraction, catalysis, dyes and medicine. Haemoglobin is an iron complex; chlorophyll is a magnesium complex; vitamin B12 is a cobalt complex. EDTA is a chelating agent used to treat heavy metal poisoning." }
        ], connections: ["Metals provide the centre.", "Bonding explains the coordinate bond.", "Medicinal chemistry uses complexes such as cisplatin."], uncertainty: "Predicting the exact colour and magnetism of a complex from theory alone is still approximate; ligand field theory is a model, not a calculation.", career: "Inorganic synthesis, catalysis, and bioinorganic chemistry.",
        sources: [
          { label: "OpenStax Chemistry 2e, 19.2 Coordination Chemistry of Transition Metals", url: "https://openstax.org/books/chemistry-2e/pages/19-2-coordination-chemistry-of-transition-metals" },
          { label: "Wikipedia, \"Coordination complex\"", url: "https://en.wikipedia.org/wiki/Coordination_complex" }
        ]
      },
      { id: "minerals", title: "Minerals", kicker: "Crystalline compounds from the Earth", minutes: 12,
        story: "A mineral is a naturally occurring, inorganic solid with a definite chemical composition and a crystalline structure. Rocks are aggregates of minerals. About 5,000 mineral species are known, and a handful of them make up most of the crust.",
        sections: [
          { heading: "Structure", body: "Minerals are crystals: their atoms are arranged in a repeating lattice. Silicates, built from SiO4 tetrahedra, are by far the most common group and make up about 90 percent of the crust. Quartz, feldspar and mica are silicates." },
          { heading: "Properties", body: "Hardness is measured on the Mohs scale from talc (1) to diamond (10). Cleavage, fracture, lustre and specific gravity are used to identify minerals in the field. Colour is unreliable because the same mineral can vary." },
          { heading: "Formation", body: "Minerals crystallise from magma, precipitate from solution, or form by alteration of existing minerals. The conditions of formation are recorded in the crystal, which is why minerals are used to reconstruct the history of a rock." },
          { heading: "Resources", body: "Ores are minerals from which metals can be extracted economically. The concentration of the metal in the ore, the energy cost of extraction and the market price together determine whether mining is viable, and these change with technology." }
        ], connections: ["Non-metals and metals make up minerals.", "Materials chemistry studies their uses.", "Environmental chemistry tracks mining impacts."], uncertainty: "The exact number of mineral species depends on how variants are counted, and new minerals are still being described.", career: "Geology, mining engineering, and materials science.",
        sources: [
          { label: "Wikipedia, \"Mineral\"", url: "https://en.wikipedia.org/wiki/Mineral" },
          { label: "Mindat mineral database", url: "https://www.mindat.org" }
        ]
      }
    ] },
    { id: "analytical-chemistry", title: "Analytical Chemistry", intro: "What is in a sample, and how much.", topics: [
      { id: "chemical-analysis", title: "Chemical Analysis", kicker: "Separating the question of what from how much", minutes: 13,
        story: "Analytical chemistry answers two questions about a sample: what is in it, and in what amount. The methods range from simple titrations to mass spectrometry, and the choice depends on the concentration, the matrix and the accuracy needed.",
        sections: [
          { heading: "Qualitative and quantitative", body: "Qualitative analysis identifies the components; quantitative analysis measures their amounts. A flame test identifies sodium by its yellow colour; a titration measures how much acid is present. Modern instruments often do both at once." },
          { heading: "Titration", body: "A titration adds a reagent of known concentration until the reaction is complete, detected by an indicator or a pH meter. The equivalence point is where the reactants are in stoichiometric ratio. It is precise, cheap and still widely used." },
          { heading: "Gravimetric and volumetric", body: "Gravimetric analysis weighs a product of known composition to find the amount of analyte. Volumetric analysis measures volumes of solutions. Both are classical methods that need no expensive instrument and are still the reference for calibrating instruments." },
          { heading: "Sampling and preparation", body: "The result is only as good as the sample. A sample must be representative, and it usually must be dissolved, filtered or extracted before analysis. Contamination and loss during preparation are the largest sources of error in most analyses." }
        ], connections: ["Spectroscopy and chromatography are the instrumental methods.", "Chemical equilibrium underlies titrations.", "Environmental chemistry depends on analysis."], uncertainty: "How to validate a method for a new matrix, and how to estimate uncertainty honestly, are ongoing practical problems rather than solved ones.", career: "Analytical chemistry, quality control, and forensic science.",
        sources: [
          { label: "OpenStax Chemistry 2e, 4.6 Quantitative Chemical Analysis", url: "https://openstax.org/books/chemistry-2e/pages/4-6-quantitative-chemical-analysis" },
          { label: "Wikipedia, \"Analytical chemistry\"", url: "https://en.wikipedia.org/wiki/Analytical_chemistry" }
        ]
      },
      { id: "spectroscopy", title: "Spectroscopy", kicker: "Reading molecules by the light they absorb", minutes: 13,
        story: "Spectroscopy measures how matter interacts with electromagnetic radiation. Each technique probes a different energy transition, and together they give a picture of molecular structure that no single method provides.",
        sections: [
          { heading: "UV-Vis", body: "Ultraviolet and visible spectroscopy measures electronic transitions. Conjugated systems absorb at longer wavelengths, which is why beta-carotene is orange and chlorophyll is green. The Beer-Lambert law relates absorbance to concentration, which makes it useful for quantification." },
          { heading: "Infrared", body: "Infrared spectroscopy measures molecular vibrations. Each functional group absorbs at characteristic wavenumbers: the O-H stretch near 3300 cm-1, the C=O stretch near 1700 cm-1. It is the quickest way to check whether a reaction has occurred." },
          { heading: "NMR", body: "Nuclear magnetic resonance measures the environment of nuclei such as hydrogen and carbon-13. The chemical shift, splitting pattern and integration reveal how many kinds of hydrogen exist and how they are connected. It is the most powerful tool for determining organic structures." },
          { heading: "Mass spectrometry", body: "Mass spectrometry ionises molecules and measures their mass-to-charge ratio. The molecular ion gives the molecular mass; fragmentation gives structural clues. Coupled to chromatography it can identify compounds in complex mixtures at trace levels." }
        ], connections: ["Chemical analysis uses these methods.", "Chromatography separates before spectroscopy identifies.", "Quantum mechanics explains the transitions."], uncertainty: "Interpreting spectra still requires judgement, and automated structure elucidation is good but not yet reliable for novel compounds.", career: "Analytical chemistry, pharmaceutical research, and forensic science.",
        sources: [
          { label: "OpenStax Chemistry 2e, 7.1 Electromagnetic Energy", url: "https://openstax.org/books/chemistry-2e/pages/7-1-electromagnetic-energy" },
          { label: "Wikipedia, \"Spectroscopy\"", url: "https://en.wikipedia.org/wiki/Spectroscopy" }
        ]
      },
      { id: "chromatography", title: "Chromatography", kicker: "Separating mixtures by differential affinity", minutes: 13,
        story: "Chromatography separates the components of a mixture by passing it through a stationary phase with a mobile phase. Components that interact more strongly with the stationary phase travel more slowly, and the separation builds up over many equilibrations.",
        sections: [
          { heading: "Principles", body: "The retention factor Rf in thin-layer chromatography is the distance travelled by the compound divided by the distance travelled by the solvent front. A compound with Rf near 1 is not retained; near 0 it is strongly retained. The choice of stationary and mobile phases controls the separation." },
          { heading: "Gas chromatography", body: "In GC the mobile phase is an inert gas and the stationary phase is a liquid coated on a column. It separates volatile compounds and is coupled to mass spectrometry for identification. Temperature programming improves separation of compounds with different boiling points." },
          { heading: "Liquid chromatography", body: "HPLC uses a liquid mobile phase pumped at high pressure through a packed column. Reverse-phase HPLC, with a non-polar stationary phase, is the workhorse of pharmaceutical analysis. It handles non-volatile and thermally labile compounds that GC cannot." },
          { heading: "Applications", body: "Chromatography is used in drug testing, food safety, environmental monitoring and forensic analysis. It can detect parts per billion of a pesticide in water. The separation is the easy part; sample preparation is usually the bottleneck." }
        ], connections: ["Spectroscopy identifies what chromatography separates.", "Chemical analysis needs both.", "Environmental chemistry uses both routinely."], uncertainty: "Method development is still largely empirical: predicting retention from first principles is possible in simple cases but not for complex mixtures.", career: "Analytical chemistry, pharmaceutical quality control, and forensics.",
        sources: [
          { label: "OpenStax Chemistry 2e, 12.3 Chromatography", url: "https://openstax.org/books/chemistry-2e/pages/12-3-chromatography" },
          { label: "Wikipedia, \"Chromatography\"", url: "https://en.wikipedia.org/wiki/Chromatography" }
        ]
      }
    ] },
    { id: "biochemistry", title: "Biochemistry", intro: "The chemistry of living systems.", topics: [
      { id: "proteins", title: "Proteins", kicker: "Polymers of amino acids that do most of the work in a cell", minutes: 13,
        story: "Proteins are polymers of 20 amino acids, and they make up about half the dry mass of a cell. Their functions range from catalysis to structure to signalling, and the function follows from the folded shape, which follows from the sequence.",
        sections: [
          { heading: "Amino acids", body: "Each amino acid has an amino group, a carboxyl group and a side chain attached to a central carbon. The side chains vary in size, charge and polarity, and it is these that give each amino acid its character. At physiological pH they exist as zwitterions." },
          { heading: "Structure levels", body: "Primary structure is the sequence. Secondary structure is local folding into alpha helices and beta sheets, held by hydrogen bonds. Tertiary structure is the overall 3D shape, and quaternary structure is the assembly of subunits. Denaturation disrupts the higher levels but leaves the chain intact." },
          { heading: "Function", body: "Enzymes catalyse reactions; structural proteins such as collagen give strength; transport proteins such as haemoglobin carry molecules; antibodies recognise foreign substances. The same 20 monomers, arranged differently, produce this variety." },
          { heading: "Folding and misfolding", body: "Proteins fold into their native state spontaneously, guided by the hydrophobic effect. Misfolding produces aggregates, as in Alzheimer's and prion diseases. Chaperones assist folding and prevent aggregation." }
        ], connections: ["Biomolecules includes proteins.", "Enzymes are proteins.", "DNA encodes the sequence."], uncertainty: "Predicting the 3D structure of a protein from its sequence is now largely solved by machine learning, but predicting its dynamics and interactions is not.", career: "Biochemistry, drug discovery, and structural biology.",
        sources: [
          { label: "OpenStax Biology 2e, 3.4 Proteins", url: "https://openstax.org/books/biology-2e/pages/3-4-proteins" },
          { label: "Wikipedia, \"Protein\"", url: "https://en.wikipedia.org/wiki/Protein" }
        ]
      },
      { id: "carbohydrates", title: "Carbohydrates", kicker: "Sugars and their polymers", minutes: 12,
        story: "Carbohydrates are compounds of carbon, hydrogen and oxygen, usually in the ratio 1:2:1. They range from single sugars to vast structural polymers, and they are the most abundant organic molecules on Earth.",
        sections: [
          { heading: "Monosaccharides", body: "Glucose, fructose and galactose are hexoses with formula C6H12O6. They exist in linear and ring forms, and the ring form has anomers, alpha and beta, that differ in the orientation of the hydroxyl on carbon 1. This small difference has large consequences." },
          { heading: "Disaccharides and polysaccharides", body: "Two monosaccharides join by a glycosidic bond to form a disaccharide: sucrose, lactose, maltose. Many join to form polysaccharides: starch and glycogen for energy storage, cellulose and chitin for structure." },
          { heading: "Structure and digestibility", body: "Starch has alpha-1,4 linkages that human enzymes can break; cellulose has beta-1,4 linkages that we cannot, so it passes through as fibre. The difference is the orientation of one bond, which is why cows need a rumen full of microbes." },
          { heading: "Other roles", body: "Carbohydrates attached to proteins and lipids form glycoproteins and glycolipids, which are involved in cell recognition and signalling. Blood groups are determined by the sugar attached to a lipid on red blood cells." }
        ], connections: ["Biomolecules includes carbohydrates.", "Metabolism breaks them down for energy.", "Enzymes digest them."], uncertainty: "The role of dietary fibre and of specific sugars in metabolic disease is still being worked out, and advice has changed more than once.", career: "Nutrition, food science, and biochemistry.",
        sources: [
          { label: "OpenStax Biology 2e, 3.3 Carbohydrates", url: "https://openstax.org/books/biology-2e/pages/3-3-carbohydrates" },
          { label: "Wikipedia, \"Carbohydrate\"", url: "https://en.wikipedia.org/wiki/Carbohydrate" }
        ]
      },
      { id: "lipids", title: "Lipids", kicker: "Hydrophobic molecules: fats, membranes and signals", minutes: 12,
        story: "Lipids are not polymers. They are a diverse group of hydrophobic molecules that include fats, oils, phospholipids and steroids, and they store energy, form membranes and carry signals.",
        sections: [
          { heading: "Fats and oils", body: "A triglyceride is three fatty acids esterified to glycerol. Saturated fats have no double bonds and are solid at room temperature; unsaturated fats have one or more double bonds and are liquid. The cis configuration of natural unsaturated fats gives kinks that prevent tight packing." },
          { heading: "Phospholipids", body: "A phospholipid has two fatty acid tails and a phosphate head. It is amphipathic: the head is hydrophilic, the tails hydrophobic. In water they self-assemble into bilayers, which is the basis of all cell membranes." },
          { heading: "Steroids", body: "Steroids have a characteristic four-ring structure. Cholesterol is a component of animal membranes and the precursor of steroid hormones such as testosterone and oestrogen. Plant steroids include the brassinosteroids that regulate growth." },
          { heading: "Health", body: "The relationship between dietary fat and cardiovascular disease is more complicated than the simple story of saturated versus unsaturated. Trans fats, produced by partial hydrogenation, are clearly harmful and have been largely phased out." }
        ], connections: ["Membranes are made of phospholipids.", "Metabolism stores energy as fat.", "Steroids are signalling molecules."], uncertainty: "The optimal dietary fat composition for long-term health is still debated, and recommendations have shifted as evidence has accumulated.", career: "Nutrition, lipidomics, and drug delivery.",
        sources: [
          { label: "OpenStax Biology 2e, 3.5 Lipids", url: "https://openstax.org/books/biology-2e/pages/3-5-lipids" },
          { label: "Wikipedia, \"Lipid\"", url: "https://en.wikipedia.org/wiki/Lipid" }
        ]
      },
      { id: "enzymes", title: "Enzymes", kicker: "Biological catalysts, and how they are controlled", minutes: 13,
        story: "Enzymes are proteins, and a few are RNA, that catalyse chemical reactions in cells. They speed reactions by factors of millions without being consumed, and they are the reason metabolism runs at body temperature instead of needing a furnace.",
        sections: [
          { heading: "Catalysis", body: "An enzyme binds its substrate at an active site and lowers the activation energy. The induced fit model says the active site changes shape on binding. Transition state stabilisation is the main source of the rate enhancement." },
          { heading: "Kinetics", body: "The Michaelis-Menten equation relates reaction rate to substrate concentration through Vmax and Km. Km is the substrate concentration at half-maximal rate and reflects affinity. kcat is the turnover number, and kcat/Km measures catalytic efficiency." },
          { heading: "Regulation", body: "Enzymes are regulated by competitive and non-competitive inhibitors, by allosteric effectors that bind elsewhere, and by covalent modification such as phosphorylation. Feedback inhibition, where the end product inhibits an early enzyme, keeps metabolic pathways balanced." },
          { heading: "Cofactors", body: "Many enzymes need a cofactor: a metal ion or a coenzyme derived from a vitamin. Without the cofactor the enzyme is inactive. This is why vitamin deficiencies produce disease even when the protein is present." }
        ], connections: ["Proteins are the enzymes.", "Metabolism is the network they catalyse.", "Inhibition is how drugs work."], uncertainty: "How enzymes achieve their enormous rate enhancements is still not fully understood in every case; quantum tunnelling and dynamics both play a role.", career: "Biochemistry, drug design, and industrial biotechnology.",
        sources: [
          { label: "OpenStax Biology 2e, 6.4 Enzymes", url: "https://openstax.org/books/biology-2e/pages/6-4-enzymes" },
          { label: "Wikipedia, \"Enzyme\"", url: "https://en.wikipedia.org/wiki/Enzyme" }
        ]
      },
      { id: "dna-rna", title: "DNA & RNA", kicker: "The molecules that store and carry genetic information", minutes: 13,
        story: "DNA and RNA are nucleic acids: polymers of nucleotides that store and transmit genetic information. DNA is the archive; RNA is the working copy and, in some viruses, the archive too.",
        sections: [
          { heading: "Nucleotides", body: "A nucleotide has a sugar, a phosphate and a nitrogenous base. DNA uses deoxyribose and the bases A, T, C, G; RNA uses ribose and A, U, C, G. The difference of one oxygen on the sugar makes DNA more stable and RNA more reactive." },
          { heading: "Structure", body: "DNA is a double helix with complementary base pairing: A with T, C with G. This is how it is copied. RNA is usually single-stranded and can fold into complex shapes, as in ribozymes and tRNA." },
          { heading: "Replication and transcription", body: "DNA polymerase copies DNA; RNA polymerase transcribes DNA into RNA. Both read a template strand and synthesise a complementary strand. The fidelity of replication is high, about one error per billion bases." },
          { heading: "Information flow", body: "The central dogma runs DNA to RNA to protein. It is not absolute: reverse transcriptase copies RNA into DNA, and prions transmit information by protein shape alone. But it describes the main flow in cells." }
        ], connections: ["Genomics reads these molecules.", "Gene expression is how they are used.", "Proteins are the product."], uncertainty: "The RNA world hypothesis, that RNA preceded both DNA and proteins, is plausible but unproven, and the transition to the current system is not understood.", career: "Molecular biology, genomics, and biotechnology.",
        sources: [
          { label: "OpenStax Biology 2e, 14.2 DNA Structure and Sequencing", url: "https://openstax.org/books/biology-2e/pages/14-2-dna-structure-and-sequencing" },
          { label: "Wikipedia, \"Nucleic acid\"", url: "https://en.wikipedia.org/wiki/Nucleic_acid" }
        ]
      },
      { id: "metabolism", title: "Metabolism", kicker: "The network of reactions that keeps a cell alive", minutes: 13,
        story: "Metabolism is the sum of all chemical reactions in a cell. It divides into catabolism, which breaks molecules down to release energy, and anabolism, which builds molecules up using that energy. The two are coupled through ATP.",
        sections: [
          { heading: "ATP", body: "Adenosine triphosphate is the energy currency of the cell. Hydrolysis of ATP to ADP releases about 30.5 kJ per mole under standard conditions, more in the cell. It powers muscle contraction, transport and synthesis." },
          { heading: "Catabolism", body: "Glucose is broken down by glycolysis, the citric acid cycle and oxidative phosphorylation to produce ATP. A glucose molecule yields about 30 to 32 ATP. Fats and proteins are also catabolised and feed into the same pathways." },
          { heading: "Anabolism", body: "Building molecules costs energy. Gluconeogenesis makes glucose from non-carbohydrate precursors; fatty acid synthesis builds fats. These pathways are not simply the reverse of catabolism; they use different enzymes and different compartments." },
          { heading: "Regulation", body: "Metabolism is regulated by enzyme activity, by compartmentalisation and by hormones. Insulin promotes storage; glucagon promotes mobilisation. The balance between the two maintains blood glucose within a narrow range." }
        ], connections: ["Enzymes catalyse every step.", "Carbohydrates and lipids are the fuels.", "Proteins provide the enzymes."], uncertainty: "How metabolism is organised at the level of the whole organism, including the microbiome's contribution, is still being mapped.", career: "Biochemistry, medicine, and nutrition science.",
        sources: [
          { label: "OpenStax Biology 2e, 7.1 Energy and Metabolism", url: "https://openstax.org/books/biology-2e/pages/7-1-energy-and-metabolism" },
          { label: "Wikipedia, \"Metabolism\"", url: "https://en.wikipedia.org/wiki/Metabolism" }
        ]
      }
    ] },
    { id: "nuclear-chemistry", title: "Nuclear Chemistry", intro: "Reactions that change the nucleus rather than the electrons.", topics: [
      { id: "nuclear-chemistry", title: "Nuclear Chemistry", kicker: "Radioactivity, decay and the energy of the nucleus", minutes: 13,
        story: "Nuclear chemistry studies changes in the nucleus: radioactivity, nuclear reactions, and the energy released when mass is converted to energy. It is the chemistry of the strong force, not of electrons.",
        sections: [
          { heading: "Radioactivity", body: "Unstable nuclei decay by emitting alpha particles (helium nuclei), beta particles (electrons or positrons) or gamma rays (high-energy photons). The decay is random for individual nuclei but predictable for large numbers, which is why half-life is a meaningful concept." },
          { heading: "Half-life", body: "The half-life is the time for half the nuclei to decay. Carbon-14 has a half-life of 5730 years and is used to date organic material up to about 50,000 years old. Iodine-131 has a half-life of 8 days and is used in medicine." },
          { heading: "Fission and fusion", body: "Fission splits heavy nuclei such as uranium-235; fusion combines light nuclei such as hydrogen. Both release energy because the products are more tightly bound. Fission powers reactors and weapons; fusion powers stars and, one day, perhaps reactors." },
          { heading: "Applications and risks", body: "Nuclear chemistry is used in medicine (imaging and therapy), in dating, and in power generation. The risks include radiation exposure and nuclear waste. The same isotopes that treat cancer can cause it." }
        ], connections: ["Atomic structure is the starting point.", "Thermodynamics governs the energy release.", "Environmental chemistry tracks fallout and waste."], uncertainty: "Whether fusion power can be made practical, and on what timescale, is still an open engineering question despite decades of progress.", career: "Nuclear medicine, radiochemistry, and energy.",
        sources: [
          { label: "OpenStax Chemistry 2e, 21.1 Nuclear Structure and Stability", url: "https://openstax.org/books/chemistry-2e/pages/21-1-nuclear-structure-and-stability" },
          { label: "Wikipedia, \"Nuclear chemistry\"", url: "https://en.wikipedia.org/wiki/Nuclear_chemistry" }
        ]
      }
    ] },
    { id: "environmental-chemistry", title: "Environmental Chemistry", intro: "Chemistry in the air, water and soil.", topics: [
      { id: "environmental-chemistry", title: "Environmental Chemistry", kicker: "Pollution, cycles and remediation", minutes: 13,
        story: "Environmental chemistry studies chemical processes in the environment: the cycles of carbon, nitrogen and sulfur, the pollutants that disrupt them, and the chemistry of cleaning up.",
        sections: [
          { heading: "Cycles", body: "The carbon cycle moves carbon between the atmosphere, oceans, biosphere and rocks. Human combustion of fossil fuels has raised atmospheric CO2 from about 280 ppm to over 420 ppm. The nitrogen cycle is dominated by bacterial fixation and, increasingly, by the Haber process." },
          { heading: "Air pollution", body: "Photochemical smog forms when nitrogen oxides and volatile organic compounds react in sunlight to make ozone. Acid rain forms when sulfur dioxide and nitrogen oxides dissolve in water. Both are now controlled in many countries by regulation and catalytic converters." },
          { heading: "Water", body: "Water chemistry determines whether a water body can support life. Dissolved oxygen, pH, nutrients and pollutants are measured. Eutrophication, caused by excess nitrogen and phosphorus, produces algal blooms and dead zones." },
          { heading: "Remediation", body: "Contaminated sites are cleaned by physical removal, chemical treatment or biological degradation. Bioremediation uses microbes to break down pollutants. The choice depends on the contaminant, the site and the cost." }
        ], connections: ["Non-metals cycle through the environment.", "Analytical chemistry measures the pollutants.", "Industrial chemistry is the source of many of them."], uncertainty: "How the climate system will respond to continued emissions is the central uncertainty, and it is a question of physics and chemistry together.", career: "Environmental chemistry, regulation, and remediation.",
        sources: [
          { label: "Wikipedia, \"Environmental chemistry\"", url: "https://en.wikipedia.org/wiki/Environmental_chemistry" },
          { label: "EPA, air and water quality", url: "https://www.epa.gov" }
        ]
      }
    ] },
    { id: "industrial-chemistry", title: "Industrial Chemistry", intro: "Chemistry at scale.", topics: [
      { id: "industrial-chemistry", title: "Industrial Chemistry", kicker: "From laboratory reaction to factory process", minutes: 13,
        story: "Industrial chemistry is the design and operation of chemical processes at scale. The challenges are not only making the reaction work but making it safe, efficient and economical, and disposing of the waste.",
        sections: [
          { heading: "Flagship processes", body: "The Haber-Bosch process makes ammonia from nitrogen and hydrogen at high pressure and temperature with an iron catalyst, feeding half the world. The Contact process makes sulfuric acid. The Solvay process makes soda ash. These three underpin most of the chemical industry." },
          { heading: "Scale-up", body: "A reaction that works in a flask may fail in a 100,000 litre reactor because of heat transfer, mixing and safety. Process engineers design reactors, heat exchangers and separation units. The economics often depend on energy and feedstock prices." },
          { heading: "Catalysis", body: "Catalysts make reactions faster and more selective, and they are the heart of industrial chemistry. A good catalyst lasts years and is not consumed. Finding one is still partly empirical." },
          { heading: "Waste and safety", body: "Green chemistry aims to reduce waste and hazard at the design stage. Process safety management prevents catastrophic releases. The Bhopal disaster in 1984 killed thousands and reshaped industrial safety regulation." }
        ], connections: ["Thermodynamics and kinetics govern the processes.", "Catalysis is central.", "Environmental chemistry handles the waste."], uncertainty: "How to decarbonise the chemical industry, which relies on fossil feedstocks and high temperatures, is a major open problem.", career: "Chemical engineering, process design, and industrial safety.",
        sources: [
          { label: "Wikipedia, \"Chemical industry\"", url: "https://en.wikipedia.org/wiki/Chemical_industry" },
          { label: "OpenStax Chemistry 2e, 12.7 Catalysis", url: "https://openstax.org/books/chemistry-2e/pages/12-7-catalysis" }
        ]
      }
    ] },
    { id: "materials-chemistry", title: "Materials Chemistry", intro: "Designing substances with useful properties.", topics: [
      { id: "materials-chemistry", title: "Materials Chemistry", kicker: "From ceramics to semiconductors", minutes: 13,
        story: "Materials chemistry designs and makes substances with useful properties: ceramics, polymers, metals, composites and nanomaterials. The goal is to connect structure at the atomic level to behaviour at the human scale.",
        sections: [
          { heading: "Ceramics", body: "Ceramics are inorganic, non-metallic solids, usually oxides or nitrides, made by firing. They are hard, brittle and heat-resistant. Alumina and silicon carbide are used for cutting tools and armour; zirconia is used in dental crowns." },
          { heading: "Semiconductors", body: "Silicon is doped with tiny amounts of boron or phosphorus to make p-type or n-type semiconductors. The junction between them is the basis of diodes and transistors, and therefore of all modern electronics." },
          { heading: "Composites and nanomaterials", body: "Composites combine materials to get properties neither has alone, such as carbon fibre in a polymer matrix. Nanomaterials have dimensions of 1 to 100 nanometres and properties different from the bulk, such as the colour of gold nanoparticles." },
          { heading: "Characterisation", body: "Materials are characterised by X-ray diffraction, electron microscopy and spectroscopy. The structure-property relationship is the central idea: change the structure and you change the property." }
        ], connections: ["Solid-state chemistry is the foundation.", "Polymers are a major class of materials.", "Nanotechnology extends materials chemistry."], uncertainty: "How to scale up nanomaterial production while controlling properties is still a challenge.", career: "Materials science, semiconductor industry, and nanotechnology.",
        sources: [
          { label: "Wikipedia, \"Materials science\"", url: "https://en.wikipedia.org/wiki/Materials_science" },
          { label: "OpenStax Chemistry 2e, 10.6 Lattice Structures in Crystalline Solids", url: "https://openstax.org/books/chemistry-2e/pages/10-6-lattice-structures-in-crystalline-solids" }
        ]
      }
    ] },
    { id: "computational-chemistry", title: "Computational Chemistry", intro: "Modelling molecules with computers.", topics: [
      { id: "computational-chemistry", title: "Computational Chemistry", kicker: "Simulating molecules when experiments are hard", minutes: 13,
        story: "Computational chemistry uses computers to model molecular structure and behaviour. It ranges from fast approximate methods to accurate but expensive quantum calculations, and it is now a standard tool alongside experiment.",
        sections: [
          { heading: "Molecular mechanics", body: "Molecular mechanics treats atoms as balls and bonds as springs, using force fields fitted to experimental data. It is fast enough for large molecules such as proteins but cannot describe bond breaking." },
          { heading: "Quantum methods", body: "Hartree-Fock and density functional theory solve approximate versions of the Schrodinger equation. DFT is the workhorse of computational chemistry because it balances accuracy and cost. Coupled cluster methods are more accurate but expensive." },
          { heading: "Molecular dynamics", body: "Molecular dynamics simulates the motion of atoms over time using Newton's equations. It reveals how proteins move, how drugs bind and how materials deform. The timescales are short, picoseconds to microseconds, compared with real processes." },
          { heading: "Applications", body: "Computational chemistry is used in drug discovery to screen compounds and predict binding, in materials design to predict properties, and in catalysis to understand mechanisms. It complements experiment but does not replace it." }
        ], connections: ["Quantum mechanics is the theory.", "Molecular mechanics is the fast approximation.", "Drug discovery uses both."], uncertainty: "Predicting reaction rates and excited states accurately is still hard, and the choice of method affects the answer.", career: "Computational chemistry, drug discovery, and materials design.",
        sources: [
          { label: "Wikipedia, \"Computational chemistry\"", url: "https://en.wikipedia.org/wiki/Computational_chemistry" },
          { label: "OpenStax Chemistry 2e, 8.1 Quantum Theory and Atomic Structure", url: "https://openstax.org/books/chemistry-2e/pages/8-1-quantum-theory-and-atomic-structure" }
        ]
      }
    ] },
    { id: "medicinal-chemistry", title: "Medicinal Chemistry", intro: "Designing molecules that treat disease.", topics: [
      { id: "medicinal-chemistry", title: "Medicinal Chemistry", kicker: "From target to drug", minutes: 13,
        story: "Medicinal chemistry designs and synthesises compounds for use as medicines. It sits between biology, which identifies targets, and pharmacology, which tests them, and it is where the molecule itself is made.",
        sections: [
          { heading: "Drug targets", body: "A drug usually acts on a protein target: an enzyme, a receptor or an ion channel. The target must be validated, meaning that modulating it actually affects the disease. Many candidate targets fail this test." },
          { heading: "Structure-activity relationships", body: "SAR studies how changes in chemical structure affect biological activity. A lead compound is optimised by making analogues, testing them, and learning which parts of the molecule matter. This is the core iterative loop of medicinal chemistry." },
          { heading: "Pharmacokinetics", body: "A drug must be absorbed, distributed, metabolised and excreted. ADMET properties often fail before efficacy does. Lipinski's rule of five is a rough guide to oral bioavailability: molecular weight under 500, logP under 5, and limited hydrogen bond donors and acceptors." },
          { heading: "Development", body: "From lead to drug takes years and hundreds of compounds. Preclinical testing is followed by clinical trials in phases I, II and III. Most compounds fail, and the cost of the failures is what makes drugs expensive." }
        ], connections: ["Organic chemistry provides the synthesis.", "Biochemistry provides the targets.", "Pharmacology tests the result."], uncertainty: "How to predict ADMET properties and clinical success from structure is still poor; most candidates fail in trials for reasons not visible in the lab.", career: "Medicinal chemistry, drug discovery, and pharmaceutical research.",
        sources: [
          { label: "Wikipedia, \"Medicinal chemistry\"", url: "https://en.wikipedia.org/wiki/Medicinal_chemistry" },
          { label: "OpenStax Chemistry 2e, 20.4 Amines", url: "https://openstax.org/books/chemistry-2e/pages/20-4-amines" }
        ]
      }
    ] }

  ]
};

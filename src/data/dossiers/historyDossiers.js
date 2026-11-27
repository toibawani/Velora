/**
 * History dossiers.
 *
 * These are arguments about evidence, not timelines. Each one takes a story most
 * readers have met in a simplified form and asks what the sources actually
 * support: what survives, who wrote it, and what the revisionist case is. The
 * rule is that a contested interpretation is named as contested in the sentence
 * that makes it.
 */

export const ANTIKYTHERA_DOSSIER = {
  id: 'antikythera-mechanism',
  title: 'The Antikythera Mechanism',
  standfirst:
    'A corroded lump of bronze from a first-century-BCE shipwreck turned out to contain at least thirty interlocking gears. It predicted eclipses, tracked the moon’s irregular motion and may have shown the positions of the planets. Nothing comparable survives for a thousand years.',
  field: 'History',
  lenses: ['Origins', 'Time'],
  status: 'Object established; its purpose and provenance still debated',
  difficulty: 'Intermediate',
  minutes: 23,
  opening:
    'In 1901 Greek sponge divers sheltering from a storm off the island of Antikythera raised a cargo of bronze and marble from a wreck. One lump of corroded bronze was set aside as debris. Fifty years later a historian of science noticed gear teeth in it. The object is now known to be a mechanical calendar and astronomical predictor, built around the second century BCE, and it is the most complex geared device known from the ancient world. It should not exist, in the sense that no surviving text describes anything like it and no comparable machine appears again until the medieval astrolabes.',
  sections: [
    {
      kind: 'prose',
      heading: 'What came out of the wreck',
      body: [
        'The ship went down around 70–60 BCE, carrying luxury goods toward Rome: bronze and marble statues, glassware, coins and the mechanism. The wreck was found in 1900 and excavated over the following decades; the mechanism itself is in the National Archaeological Museum in Athens. It survives as fragments, not a complete machine. The largest fragment contains the front and back dials and a train of gears; other fragments preserve inscriptions that describe what the dials showed.',
        'The critical work was done by Derek de Solla Price, who published a detailed study in 1959 and argued that the device was a calendrical computer. Michael Wright, a curator at the Science Museum in London, built physical reconstructions and argued for a more ambitious planetary display. In 2006 a team led by Tony Freeth used computed tomography to read the inscriptions inside the fragments and count the gear teeth, and in 2021 the same group proposed a complete reconstruction of the front plate. The object has been studied for seventy years and is still yielding corrections.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of a geared cosmos',
      items: [
        {
          term: 'Epicyclic gearing',
          definition:
            'A gear system in which one gear turns around another, allowing a mechanism to add or subtract rotations. It is how the Antikythera mechanism produced the moon’s variable speed.',
        },
        {
          term: 'Metonic cycle',
          definition:
            'A period of 19 years after which the phases of the moon fall on the same calendar dates. The mechanism’s calendar dial used it to reconcile lunar months with the solar year.',
        },
        {
          term: 'Saros cycle',
          definition:
            'A period of 223 lunar months after which eclipses repeat in a similar pattern. It was the basis of the mechanism’s eclipse prediction.',
        },
        {
          term: 'Provenance',
          definition:
            'The recorded history of an object’s ownership and discovery. Provenance matters because it determines whether an object can be dated and interpreted with confidence.',
        },
        {
          term: 'Computed tomography',
          definition:
            'Imaging that reconstructs cross-sections from X-ray measurements. It allowed researchers to read the mechanism’s hidden inscriptions and count gear teeth without dismantling it.',
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'What it actually computed',
      body: [
        'The front dial showed the zodiac and the date in the Egyptian calendar, with a pointer for the sun’s position and, in the 2021 reconstruction, pointers for the five planets known to the ancients. The back had two spiral dials. One was the Metonic calendar, tracking the 19-year lunisolar cycle, with a smaller dial for the Callippic cycle of four Metonic periods. The other was the Saros eclipse cycle, with glyphs marking predicted eclipses and a smaller Exeligmos dial for the threefold repetition of the Saros.',
        'The moon’s pointer did not move uniformly. A pin-and-slot mechanism, mounted on an epicyclic train, produced the variation in the moon’s speed that astronomers knew from observation — the first anomaly. That is the detail that turns the object from a calendar into an astronomical model: it encodes a theory, not just a count. The gearing also accounts for the metonic and saros relationships with ratios that are close to, but not exactly, the observed values, which tells us the maker was working from numerical astronomy, probably Babylonian, rather than from a Greek geometrical model.',
      ],
    },
    {
      kind: 'math',
      heading: 'The cycles the gears encode',
      equation: '19 solar years = 235 lunar months;  223 lunar months = 1 Saros',
      symbols: [
        { symbol: '19 years', meaning: 'The Metonic period, after which lunar phases repeat on the same calendar dates' },
        { symbol: '235 months', meaning: 'The number of lunar months in 19 years, used to keep a lunar calendar aligned with the sun' },
        { symbol: '223 months', meaning: 'The Saros period, after which the sun, moon and nodes return to nearly the same geometry' },
        { symbol: 'Saros', meaning: 'A cycle of about 18 years 11 days, used to predict eclipses' },
      ],
      body: [
        'The numbers are not arbitrary. 235 synodic months is about 19 tropical years to within a couple of hours, which is why the Metonic cycle works as a calendar correction. 223 synodic months is about 18 years and 11 days, and it is close to 242 draconic months, which is why eclipses recur after a Saros. The mechanism’s gear ratios reproduce these integers, and the tooth counts are consistent with them. That is how the reconstruction was tested: the gears have to produce the right ratios, and the inscriptions have to name the right phenomena.',
        'The Exeligmos dial adds three Saros cycles, because the Saros is not exactly 18 years and 11 days: it is about eight hours longer, so an eclipse returns at a different time of day unless you wait three cycles. The mechanism accounts for that too. This is the level of detail that makes the object extraordinary: it is not a vague sky-clock but a device built around specific numerical relationships, with corrections for their errors.',
      ],
      assumptions: [
        'The tooth counts read from the fragments are correct; a single miscounted tooth would change the reconstructed ratios.',
        'The inscriptions describe the intended function, not a later modification; the device may have been repaired or altered in antiquity.',
        'The reconstruction is a hypothesis about a lost whole, and different scholars have proposed different front-plate arrangements.',
      ],
    },
    {
      kind: 'table',
      heading: 'What each dial did',
      columns: ['Dial', 'Cycle', 'What it displayed'],
      rows: [
        ['Front zodiac', 'Solar year', 'Date and the sun’s position in the zodiac'],
        ['Metonic spiral', '19 years', 'Lunar months and calendar dates'],
        ['Callippic dial', '76 years', 'Four Metonic cycles, a further correction'],
        ['Saros spiral', '223 months', 'Predicted eclipses, with glyphs for solar and lunar'],
        ['Exeligmos dial', '3 Saros cycles', 'Correction for the eight-hour drift of the Saros'],
        ['Olympiad dial', '4 years', 'A contest cycle; its exact function is still argued'],
      ],
      note:
        'The table is a reconstruction, not a photograph. The front planetary display is the least certain part: the 2021 model is ingenious, but it depends on gear fragments that are badly damaged and on assumptions about what the maker intended.',
    },
    {
      kind: 'misconception',
      heading: 'The "ancient computer" exaggeration',
      claim: '"The Antikythera mechanism was a computer, and its existence proves the ancients had technology comparable to ours."',
      correction:
        'It was a mechanical calculator, which is a kind of computer in the narrow sense that it performed calculations with gears. It was not programmable, had no memory, and could not be generalised beyond the astronomical cycles it was built to display. The existence of one such device does not show that ancient civilisation had an industrial or scientific revolution that was suppressed; it shows that a single workshop, probably in Rhodes or Syracuse, had exceptional craft skills and access to Babylonian numerical astronomy. The interesting question is not "why did they have computers" but "why did this tradition not survive and spread".',
    },
    {
      kind: 'prose',
      heading: 'Why nothing like it survives',
      body: [
        'The short answer is that bronze is recyclable and papyrus rots. A geared device is valuable as scrap metal, and the ancient Mediterranean had a thriving bronze recycling economy. The Antikythera mechanism survived because it sank. Any comparable devices that stayed on land were probably melted down, and the texts that described them — if they existed — were copied onto papyrus and lost. This is a preservation bias, not evidence that the device was unique.',
        'The longer answer is about patronage. The mechanism was probably made for a wealthy patron or a civic display, not for navigation or trade. It encodes a particular kind of astronomy, and it may have been a prestige object as much as a practical one. That fits the archaeological context: the ship was carrying luxury goods, and the device was part of a cargo of display pieces. The absence of similar finds may mean the tradition was small, courtly and fragile, not that it was impossible.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If the mechanism was a prestige object, what does that say about the relationship between technology and patronage in the ancient world?',
        'Why did the tradition of geared astronomy not continue into the Roman world?',
        'How much of the reconstruction is inference from fragments, and how would you test it?',
        'What would a comparable loss look like in our own civilisation, and what would survive?',
      ],
    },
  ],
  sources: [
    { label: 'D. J. de Solla Price, "An ancient Greek computer", Scientific American 200, 60 (1959)', url: 'https://doi.org/10.1038/scientificamerican0659-60' },
    { label: 'T. Freeth et al., "Decoding the ancient Greek astronomical calculator known as the Antikythera Mechanism", Nature 444, 587 (2006)', url: 'https://doi.org/10.1038/nature05357' },
    { label: 'T. Freeth et al., "A model of the cosmos in the ancient Greek Antikythera mechanism", Scientific Reports 11, 5821 (2021)', url: 'https://doi.org/10.1038/s41598-021-84310-w' },
    { label: 'M. T. Wright, "The Antikythera mechanism: a new gearing scheme", Bulletin of the Scientific Instrument Society 85 (2005), 2–7', url: 'https://web.archive.org/web/2020id_/http://fsoso.online.fr/antikythera/DOCS/Bulletin%20SIS%20June%202005%20New%20Gearing%20Scheme.pdf' },
  ],
  related: ['library-of-alexandria', 'year-536', 'continuum-hypothesis'],
};

export const YEAR_536_DOSSIER = {
  id: 'year-536',
  title: 'The Year the Sun Dimmed',
  standfirst:
    'In 536 the northern hemisphere darkened for months, crops failed, and a decade of cold followed. A plague arrived in 541. Whether this was the worst year in history, or a cluster of shocks that societies absorbed, is a live argument about evidence.',
  field: 'History',
  lenses: ['Origins', 'Time'],
  status: 'Environmental event established; its human impact contested',
  difficulty: 'Intermediate',
  minutes: 22,
  opening:
    'Procopius, a historian at the court of Justinian, wrote that in the tenth year of the emperor’s reign the sun gave no light for a whole year, "like the moon in eclipse", and that people feared the end of the world. Cassiodorus, a Roman official, described a blue sun and a summer without heat. Modern ice cores and tree rings confirm that something happened: a volcanic eruption in 536 injected sulfate into the stratosphere, dimmed the sun, and cooled the northern hemisphere. What happened next is where the argument starts.',
  sections: [
    {
      kind: 'prose',
      heading: 'The physical evidence',
      body: [
        'The strongest evidence is not textual. Greenland ice cores contain sulfate layers dated to 536, 540 and 547, the signature of large volcanic eruptions. Tree-ring records from Europe, Siberia and North America show a sharp growth anomaly starting in 536 and lasting for years; some chronologies rank the following decade among the coldest in the last two millennia. The pattern is consistent with a stratospheric aerosol veil that reflected sunlight and cooled the surface.',
        'The source of the 536 eruption is debated. Candidates include Iceland, North America and a tropical volcano; the sulfate signal is strongest in the northern hemisphere, which points north, but the exact volcano has not been identified. A second eruption around 540 and a third around 547 prolonged the cooling. The cluster is sometimes called the Late Antique Little Ice Age, a term introduced by Büntgen and colleagues in 2016 for the cooler period from 536 to about 660.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of a volcanic winter',
      items: [
        {
          term: 'Volcanic winter',
          definition:
            'A period of cooling caused by volcanic sulfate aerosols in the stratosphere reflecting sunlight. It can last years, because the aerosols are fine enough to stay aloft.',
        },
        {
          term: 'Sulfate aerosol',
          definition:
            'Tiny droplets of sulfuric acid formed from volcanic sulfur dioxide. They scatter sunlight and are the main mechanism by which large eruptions cool the climate.',
        },
        {
          term: 'Dendrochronology',
          definition:
            'Dating and climate reconstruction from tree rings. A cold or dry year produces a narrow ring, and overlapping ring sequences can be dated to the year.',
        },
        {
          term: 'Ice core',
          definition:
            'A cylinder drilled from a glacier or ice sheet, preserving annual layers of snow, dust and volcanic sulfate. Ice cores provide dated records of past eruptions and atmospheric composition.',
        },
        {
          term: 'Justinianic plague',
          definition:
            'The pandemic caused by Yersinia pestis that reached the Mediterranean in 541–542. Its demographic impact is disputed, and the size of the mortality is one of the central arguments in the field.',
        },
      ],
    },
    {
      kind: 'table',
      heading: 'Three kinds of evidence, and what each can support',
      columns: ['Evidence', 'What it shows', 'What it cannot show'],
      rows: [
        ['Ice cores', 'Dated volcanic sulfate layers in 536, 540, 547', 'Which volcano erupted, or how much cooling people experienced'],
        ['Tree rings', 'Sharp growth reductions and multi-year cooling', 'Crop yields, famine, or population change directly'],
        ['Written sources', 'Dim sun, cold summer, failed harvests, fear', 'Reliable dates, or the scale of mortality'],
        ['Archaeology', 'Settlement and land-use changes in some regions', 'A single cause for changes that span centuries'],
      ],
      note:
        'The temptation is to stack the three and tell a story of collapse. The evidence supports a cluster of environmental shocks; it does not, by itself, support a specific death toll or a continent-wide collapse.',
    },
    {
      kind: 'misconception',
      heading: 'The "worst year in history"',
      claim: '"536 was the worst year to be alive, and it caused the Dark Ages."',
      correction:
        'The phrase comes from the headline of a 2018 Science news feature by Ann Gibbons, who was quoting the historian Michael McCormick answering her question, not reporting a measured historical conclusion. The environmental shock is real. The causal story — dim sun, crop failure, famine, plague, collapse of civilisation — is a chain of inferences, and each link is contested. The Justinianic plague’s death toll has been revised downward by some historians, who point to uneven archaeological evidence and to the continuation of tax records and building projects. Some regions suffered severely; others show continuity. "Worst year" is a vivid hook, not a finding.',
    },
    {
      kind: 'prose',
      heading: 'How bad was it, really?',
      body: [
        'The revisionist case, associated with Lee Mordechai and Merle Eisenberg, argues that the plague was not the demographic catastrophe earlier historians assumed. They point out that the evidence for mass mortality is thin and geographically uneven, that many of the textual sources are rhetorical, and that the eastern Roman state continued to function. Their 2019 papers, in Past & Present and in PNAS, touched off a sharp debate, with responses arguing that the revisionists underweight the archaeological and documentary evidence for disruption.',
        'The environmental history is on firmer ground than the human history. A 536 eruption is established; multi-year cooling is established; crop failures in some regions are documented. What is not established is a single continental collapse. The most defensible statement is that a cluster of volcanic eruptions and a pandemic arrived within a decade, in a society already stressed by war and fiscal pressure, and that the consequences varied enormously by region. That is less dramatic than "the worst year", and more useful.',
      ],
    },
    {
      kind: 'prose',
      heading: 'Why the story is so attractive',
      body: [
        'The 536 story has the shape of a morality tale: hubris, catastrophe, decline. It also fits a long tradition of explaining historical change by external shocks — climate, plague, invasion — rather than by internal social dynamics. That tradition has real explanatory power, but it can flatten agency: the people of the sixth century appear as passive victims of a volcano rather than as farmers, officials and merchants making choices under pressure.',
        'The better history keeps both. The volcano is real, and so is the human response: storage, migration, changes in land use, the reorganisation of taxation. The interesting question is not "how bad was it" in the abstract but "who was able to absorb it, and who was not". That question requires archaeology, documents and climate records together, and it does not produce a single dramatic number.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'What would count as evidence that the plague caused a demographic collapse rather than a temporary disruption?',
        'Why do written sources from the sixth century describe the sun’s dimming in moral and apocalyptic terms?',
        'How should historians weigh a tree-ring record against a chronicle written by someone with a political agenda?',
        'If the 536 eruption was not uniquely catastrophic, why has the "worst year" story become so popular?',
      ],
    },
  ],
  sources: [
    { label: 'Procopius, History of the Wars, Book IV (c. 550), on the dimmed sun', url: 'https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Procopius/Wars/home.html' },
    { label: 'U. Büntgen et al., "Cooling and societal change during the Late Antique Little Ice Age from 536 to around 660 AD", Nature Geoscience 9, 231 (2016)', url: 'https://doi.org/10.1038/ngeo2652' },
    { label: 'L. Mordechai and M. Eisenberg, "Rejecting catastrophe: the case of the Justinianic plague", Past & Present 244, 3–50 (2019)', url: 'https://doi.org/10.1093/pastj/gtz009' },
    { label: 'L. Mordechai et al., "The Justinianic Plague: an inconsequential pandemic?", PNAS 116(51), 25546–25554 (2019)', url: 'https://doi.org/10.1073/pnas.1903797116' },
    { label: 'A. Gibbons, "Eruption made 536 ‘the worst year to be alive’", Science 362(6416), 733–734 (2018); quotes Michael McCormick', url: 'https://doi.org/10.1126/science.362.6416.733' },
  ],
  related: ['antikythera-mechanism', 'library-of-alexandria', 'hubble-tension'],
};

export const LIBRARY_OF_ALEXANDRIA_DOSSIER = {
  id: 'library-of-alexandria',
  title: 'The Library of Alexandria',
  standfirst:
    'The library was not destroyed in a single fire. It declined over centuries, through budget cuts, war, religious conflict and the simple fact that papyrus rots. The myth of the one catastrophic burning is more comforting than the history.',
  field: 'History',
  lenses: ['Origins', 'Logic'],
  status: 'Institution established; the destruction story is largely myth',
  difficulty: 'Intermediate',
  minutes: 21,
  opening:
    'Ask anyone what happened to the Library of Alexandria and you will hear a fire. Julius Caesar burned it in 48 BCE, or perhaps the Christians destroyed it in 391, or the Arabs in 642. Each story is dramatic, each is attached to a famous villain, and none is supported by the evidence in the way it is usually told. The library did exist, it was the greatest scholarly institution of the ancient Mediterranean, and it did disappear. The interesting question is how something like it disappears without a single memorable catastrophe.',
  sections: [
    {
      kind: 'prose',
      heading: 'What the library actually was',
      body: [
        'The library was part of the Mouseion, a research institution founded in Alexandria under the early Ptolemies, probably in the third century BCE. It was not a public lending library. It was a royal project: scholars were supported, texts were acquired, and the collection was tied to the court. The Ptolemies famously borrowed Athenian manuscripts and kept the originals, returning copies; the story may be embellished, but it captures the institution’s ambition.',
        'The collection was made of papyrus scrolls, not bound books. A scroll holds one work or part of one, and it has to be recopied periodically because papyrus degrades. A library of hundreds of thousands of scrolls was therefore not a static archive but a continuous labour of copying. The figure of 400,000 or 700,000 scrolls comes from ancient sources and is probably an exaggeration or a count of multiple copies; no catalogue survives, so the number cannot be checked.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of ancient scholarship',
      items: [
        {
          term: 'Papyrus',
          definition:
            'A writing material made from pressed reed stems, used for scrolls in the ancient Mediterranean. It is fragile, absorbs moisture and has to be recopied as it deteriorates.',
        },
        {
          term: 'Codex',
          definition:
            'A book made of folded leaves, the format that replaced the scroll in late antiquity. Codices were more durable and easier to consult, and the changeover was a major event in book history.',
        },
        {
          term: 'Mouseion',
          definition:
            'The research institution at Alexandria of which the library was part. The word means "place of the Muses" and is the origin of "museum".',
        },
        {
          term: 'Serapeum',
          definition:
            'A temple of Serapis in Alexandria. A library was associated with it, and the temple was destroyed in 391 CE, but the connection to the main library is uncertain.',
        },
        {
          term: 'Philology',
          definition:
            'The scholarly study of texts: establishing what they say, what they mean, and how they have been transmitted. Alexandrian scholars were among the first to do it systematically.',
        },
      ],
    },
    {
      kind: 'table',
      heading: 'The alleged destructions, and what the evidence supports',
      columns: ['Event', 'Date', 'What is actually attested'],
      rows: [
        ['Caesar’s fire', '48 BCE', 'A fire in the harbour area damaged part of the city; ancient sources disagree about whether the library was affected'],
        ['Aurelian’s war', '270s CE', 'The Brucheion quarter, where the library stood, was destroyed; the library’s fate is not separately recorded'],
        ['Serapeum destroyed', '391 CE', 'The temple was demolished under Theophilus; a library there may have been lost, but it was not the main collection'],
        ['Arab conquest', '642 CE', 'The story that the caliph ordered the books burned appears centuries later and is widely doubted'],
      ],
      note:
        'The table is the whole argument in miniature. There were several disasters, and the library may have been damaged in more than one. But no ancient source describes a single deliberate destruction of the main collection, and the most famous stories are late and tendentious.',
    },
    {
      kind: 'misconception',
      heading: 'The fire that explains everything',
      claim: '"The Library of Alexandria was destroyed in a single fire, and with it centuries of ancient science were lost."',
      correction:
        'The single-fire story is a myth, or at least an unsupported simplification. The library declined over centuries: royal patronage weakened, the Mouseion lost its privileged position, papyrus decayed, and scholarship moved to other centres. Some texts were certainly lost in fires and wars, but the idea that one event wiped out ancient science is false. Much of Greek mathematics and astronomy survived through Byzantine, Islamic and Latin copies; the works that vanished did so through a long process of neglect and selective copying, not a single night of flames.',
    },
    {
      kind: 'prose',
      heading: 'What was actually lost',
      body: [
        'The honest answer is that we do not know, because no catalogue survives. We know the names of some works that are mentioned by later authors and no longer exist: plays by Sophocles and Euripides, treatises by early Greek philosophers, technical works on astronomy and medicine. We know that Alexandrian scholars produced editions of Homer and commentaries that shaped the transmission of Greek literature. The loss is real, but it is a loss measured in texts we can name, not in a vague quantity of "ancient knowledge".',
        'The larger loss may be institutional. The Mouseion was a place where scholars could work with a large collection and royal support. When that support ended, the institution withered, and the tradition of systematic philology moved elsewhere. The lesson is not that a fire destroyed civilisation but that scholarship depends on institutions, funding and continuity — and those are more fragile than buildings.',
      ],
    },
    {
      kind: 'prose',
      heading: 'Why the myth persists',
      body: [
        'The single-fire story is useful. It gives a clear villain, a clear event and a clear moral: knowledge is fragile, and fanaticism destroys it. It also flatters the present: we are the ones who would have saved the library. The real history is less satisfying, because it has no villain and no single moment. It is a story about budgets, copying, patronage and decay, and those are harder to turn into a poster.',
        'There is also a scholarly tradition of scepticism about the numbers. The library’s size, its destruction and its cultural significance have all been inflated by repetition. That does not make the institution unimportant. It makes it a case study in how historical memory works: a real place, a real loss, and a story that has been shaped by everyone who needed it to mean something.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'If no catalogue survives, how can historians estimate what the library held?',
        'Why do stories of a single catastrophic loss appeal more than stories of gradual decline?',
        'What institutions today play the role of the Mouseion, and what would their gradual defunding look like?',
        'How should we weigh a late, hostile source against an earlier, ambiguous one?',
      ],
    },
  ],
  sources: [
    { label: 'D. Delia, "From Romance to Rhetoric: The Alexandrian Library in Classical and Islamic Traditions", American Historical Review 97(5), 1449–1467 (1992)', url: 'https://doi.org/10.1086/ahr/97.5.1449' },
    { label: 'D. Rohmann, "The Destruction of the Serapeum of Alexandria, Its Library, and the Immediate Reactions", Klio 104(1), 334–362 (2022)', url: 'https://doi.org/10.1515/klio-2021-0021' },
    { label: 'Plutarch, Life of Caesar, on the fire in Alexandria', url: 'https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Plutarch/Lives/Caesar*.html' },
    { label: 'Ammianus Marcellinus, Res Gestae, on the Serapeum', url: 'https://penelope.uchicago.edu/Thayer/E/Roman/Texts/Ammian/home.html' },
  ],
  related: ['antikythera-mechanism', 'year-536', 'turing-halting'],
};

export const ROSETTA_DOSSIER = {
  id: 'rosetta-stone',
  title: 'The Stone That Taught Itself to Be Read',
  standfirst:
    'A fragment of a priestly decree in three scripts, two of them unreadable. The Greek was the way in, and the mistake that delayed decipherment was assuming that pictures must stand for things.',
  field: 'History',
  lenses: ['Origins', 'Meaning'],
  status: 'Decipherment is settled history; the reading of Egyptian texts continues',
  difficulty: 'Intermediate',
  minutes: 22,
  opening:
    'In July 1799 French soldiers rebuilding a fort at Rashid, the port the Greeks called Rosetta, pulled a broken slab out of the rubble. It carried three scripts: hieroglyphs, demotic and Greek. The Greek could be read. The decree was passed by a synod of priests at Memphis on 27 March 196 BC, on the first anniversary of the coronation of Ptolemy V, and copies were set up in temples across Egypt. The stone is the lower part of a larger stela, and its hieroglyphic section is the most damaged. What made it valuable was not its content, which is a routine list of royal honours, but the fact that the same content existed in a script nobody could read and a language everybody could.',
  sections: [
    {
      kind: 'prose',
      heading: 'A decree, not a dictionary',
      body: [
        'The text is a decree of the Egyptian priesthood, not a grammar lesson. It records honours granted to Ptolemy V in return for benefits to the temples, and it was carved in three versions so that it could be read by priests, by administrators and by Greek-speaking officials. The three versions are not word-for-word translations; they are parallel formulations of the same political act. That matters for the decipherment, because a parallel text supplies meanings, not a codebook: it tells you what the unknown signs are about, not what each sign says.',
        'The stone itself is a fragment. It measures about 112 by 76 centimetres and weighs roughly three-quarters of a tonne; the top is missing, so the hieroglyphic text is incomplete, and the surviving portion is not enough to reconstruct the whole decree on its own. Its importance is therefore double: it is a key, and it is a damaged copy of a text that exists in better condition elsewhere. The key mattered more than the copy.',
      ],
    },
    {
      kind: 'terms',
      heading: 'The vocabulary of decipherment',
      items: [
        {
          term: 'Stela',
          definition:
            'An upright stone slab carrying an inscription or relief, set up in public or in a temple. The Rosetta Stone is the broken lower part of one.',
        },
        {
          term: 'Hieroglyph',
          definition:
            'A sign of the ancient Egyptian script. The signs mix logograms, phonograms and determinatives, which is why early scholars wrongly assumed each one stood for a whole idea.',
        },
        {
          term: 'Demotic',
          definition:
            'The cursive Egyptian script used for everyday documents in the later periods. It was the script Young and Champollion could attack first, because it was less pictorial.',
        },
        {
          term: 'Cartouche',
          definition:
            'An oval ring drawn around a group of hieroglyphs, marking a royal name. Recognising that the names inside could be read phonetically was the decisive step.',
        },
        {
          term: 'Trilingual inscription',
          definition:
            'A text carved in three scripts or languages, which can supply a parallel key. The Rosetta Stone is the most famous example, but not the only one.',
        },
      ],
    },
    {
      kind: 'prose',
      heading: 'The hypothesis that blocked the way',
      body: [
        'For most of the eighteenth century the learned consensus was that hieroglyphs were symbolic: a picture of a hawk meant a god, a picture of a bee meant a king, and the script was a philosophical code rather than a writing system. That assumption made the Rosetta Stone nearly useless, because a symbolic script has no phonetic values to recover from a parallel text. Athanasius Kircher produced elaborate readings that were essentially allegory. William Warburton argued that the signs were a deliberate priestly concealment. Neither could be tested against a new inscription, which is the tell that a decipherment has not happened.',
        'The way through was phonetic. Thomas Young worked on the demotic section and identified the groups inside cartouches as royal names, and he assigned sound values to several signs. Champollion went further because he knew Coptic, the last stage of the Egyptian language, and he treated the script as a mixture: some signs were pictures of things, some stood for sounds, and some classified the word that followed. The hypothesis predicted that the same signs would recur in the same names on other monuments. When Champollion read the names of Ramesses and Thutmose at Abu Simbel in 1828, the prediction held, and the script stopped being a cipher and became a language.',
      ],
    },
    {
      kind: 'steps',
      heading: 'How the code was actually broken',
      items: [
        {
          title: 'Copy the three texts exactly',
          text: 'The first task was epigraphy: accurate copies of the signs, with their positions and repetitions, because a decipherment is only as good as the transcription it tests.',
        },
        {
          title: 'Use the known language as an anchor',
          text: 'The Greek version gave the decree’s meaning and, more usefully, the names of the king and the priests. Those names were the likely content of the cartouches.',
        },
        {
          title: 'Look for repeated groups',
          text: 'A name that appears in the Greek and in a cartouche should produce a repeated pattern of signs. Young and Champollion compared the patterns across the stone and across other monuments.',
        },
        {
          title: 'Guess sounds, then test them elsewhere',
          text: 'Assigning a phonetic value to one sign is a hypothesis. It becomes knowledge when the same value reads a different name on a different object correctly, which is what the Abu Simbel inscriptions supplied.',
        },
        {
          title: 'Build the grammar, not just the alphabet',
          text: 'A list of sound values is not a reading of a language. Champollion’s later grammar and dictionary turned the alphabet into a discipline, and that work outlived the excitement of 1822.',
        },
      ],
    },
    {
      kind: 'table',
      heading: 'Three scripts, three different kinds of help',
      columns: ['Script', 'What it is', 'What it supplied'],
      rows: [
        ['Hieroglyphic', 'Monumental script mixing logograms, phonograms and determinatives', 'The target of the decipherment; the top of the stone is broken, so only part survives'],
        ['Demotic', 'Cursive Egyptian script used for administration and everyday texts', 'The first foothold: Young and Champollion could isolate names and repeated groups'],
        ['Greek', 'The administrative language of Ptolemaic Egypt', 'The meaning of the decree and the royal names used to test phonetic guesses'],
      ],
      note:
        'A parallel text is a constraint, not a solution. The Greek fixes what the decree says; it does not say which hieroglyph is which, and the same is true of every bilingual key from the decipherment of cuneiform to the decoding of Linear B.',
    },
    {
      kind: 'prose',
      heading: 'The stone is not the whole story',
      body: [
        'Champollion did not read Egyptian from the Rosetta Stone alone. The Philae obelisk supplied a cartouche of Cleopatra that could be compared with the Ptolemy cartouche on the stone, and the Abu Simbel inscriptions supplied native royal names that were not in the Greek parallel text at all. Those names were the real test: a decipherment that worked only on Greek names could be a clever trick, while one that read Ramesses had recovered the script.',
        'The later work was less dramatic and more important. Champollion published a précis of the system in 1824, a grammar in 1836 and a dictionary in 1841; he died in 1832, before the last two appeared. Egyptian had been written for more than three thousand years and had been unreadable for about fifteen hundred. The recovery took a generation of scholars, not a single afternoon, and it depended on inscriptions that had nothing to do with the stone.',
      ],
    },
    {
      kind: 'misconception',
      heading: 'The flash of insight that was not a flash',
      claim: '"Champollion looked at the Rosetta Stone and solved hieroglyphs in a single moment in 1822."',
      correction:
        'The date is real but the story is compressed. Champollion had been working on Egyptian writing for more than a decade, and the 1822 letter to Dacier announced a specific result: hieroglyphs could be phonetic, at least for foreign names. That was the breakthrough, but it was not the whole script. The grammar and dictionary came later, and Thomas Young had already done essential work on the demotic text and on cartouches. The popular image of a lone genius fainting after a flash of insight turns a collaborative, decade-long argument with evidence into a myth, and the myth makes decipherment look like luck rather than method.',
    },
    {
      kind: 'prose',
      heading: 'What a key can and cannot do',
      body: [
        'The Rosetta Stone is a useful case because it separates two things that are often conflated: translation and decipherment. Translation assumes you know what the signs are and asks what the sentences mean. Decipherment assumes you know what the text means and asks what the signs are. A bilingual text gives you the first for free and the second not at all. The intellectual work is the hypothesis that the unknown script is a writing system of a particular kind, and the willingness to test that hypothesis against new inscriptions.',
        'That is why the story still matters outside Egyptology. Every decipherment, from cuneiform to Linear B to the Maya script, has the same shape: a known text, a guessed structure, and a prediction that can fail. The stone did not teach itself to be read. It supplied a constraint strong enough that a correct hypothesis could be recognised, which is a different and more interesting thing.',
      ],
    },
    {
      kind: 'questions',
      heading: 'Questions worth sitting with',
      items: [
        'Why did the assumption that hieroglyphs were purely symbolic survive so long, when the cartouches were obviously names?',
        'What made the Abu Simbel inscriptions a better test than the Rosetta Stone itself?',
        'Is a bilingual text necessary for decipherment, or can statistical structure alone recover a script?',
        'What would count as evidence that a proposed decipherment is wrong rather than merely unpoetic?',
      ],
    },
  ],
  sources: [
    { label: 'British Museum, "Eureka! Finding the key to ancient Egypt" (2022), on the Rosetta Stone and Champollion’s 1822 letter', url: 'https://www.britishmuseum.org/blog/eureka-finding-key-ancient-egypt' },
    { label: 'British Museum, "How Egyptian hieroglyphs were decoded: a timeline to decipherment"', url: 'https://www.britishmuseum.org/exhibitions/hieroglyphs-unlocking-ancient-egypt/egyptian-hieroglyphs-decipherment-timeline' },
    { label: 'Bibliothèque nationale de France, "En 1822, Champollion perce le secret des hiéroglyphes"', url: 'https://essentiels.bnf.fr/fr/article/1fa13963-21a8-4e08-950a-05f6515b7d34-1822-champollion-perce-secret-hieroglyphes' },
    { label: 'British Museum, "The Rosetta Stone: everything you need to know" (2017)', url: 'https://www.britishmuseum.org/blog/everything-you-ever-wanted-know-about-rosetta-stone' },
  ],
  related: ['library-of-alexandria', 'antikythera-mechanism', 'epistemic-injustice'],
};

export const HISTORY_DOSSIERS = [
  ANTIKYTHERA_DOSSIER,
  YEAR_536_DOSSIER,
  LIBRARY_OF_ALEXANDRIA_DOSSIER,
  ROSETTA_DOSSIER,
];

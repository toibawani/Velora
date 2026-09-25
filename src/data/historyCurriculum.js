// Human-written history curriculum for VELORA.
export const HISTORY_CURRICULUM = {
  name: 'History',
  description: 'People, trade, mistakes, and ideas that did not arrive in a neat line.',
  modules: [
    { id: 'ancient', title: 'Ancient Civilizations', intro: 'Cities are technologies for remembering, organising, and trading.', topics: [
      { id: 'ancient-civilizations', title: 'Egypt, Rome, Greece, and China', kicker: 'Four experiments in living together', minutes: 16,
        story: 'A river, a city-state, a republic, and a long imperial continuity did not produce one model of civilisation. They produced different answers to a shared question: how can people coordinate beyond a household?',
        sections: [
          { heading: 'Egypt and the Nile', body: 'The Nile flood made a predictable calendar urgent. Egyptian scribes recorded grain, taxes, and labour, while monumental building made royal power visible. The pyramids are famous, but the deeper achievement was an information system that helped a kingdom survive.' },
          { heading: 'Greece, Rome, and limits', body: 'Greek thinkers argued about justice and the good life. Athens built a direct democracy, though it excluded most of its population. Rome moved through republic, conflict, and empire. Roman law outlived the system that created it: institutions can have afterlives.' },
          { heading: 'China’s continuity', body: 'Chinese states developed writing, bureaucracy, legal codes, and philosophical traditions across changing dynasties. Continuity did not mean no change; later rulers inherited, debated, and rebuilt earlier ideas.' },
          { heading: 'The connections', body: 'Trade routes moved silk, metals, paper, crops, and stories. Ideas rarely travelled alone. Technology changes what people can build; a trade route changes who meets whom.' }
        ], connections: ['Writing supports administration and memory.', 'Trade routes connect states.', 'Political forms are experiments, not final answers.'], uncertainty: '“Ancient world” can flatten very different places and people into one story. Labels are tools, not the whole reality.', career: 'Archaeology, museum work, history teaching, architecture, and international relations begin with context.'
      }
    ] },
    { id: 'medieval-renaissance', title: 'Medieval worlds and the Renaissance', intro: 'The middle ages were not a blank pause between ancient people and inventive modern people.', topics: [
      { id: 'medieval-era', title: 'The Medieval Era', kicker: 'Why “dark ages” is the wrong door', minutes: 14,
        story: 'Call someone living in 1200 “primitive” and you miss the schools, courts, monasteries, trade cities, technologies, and arguments that filled their lives. The period was connected, complicated, and changing.',
        sections: [
          { heading: 'Feudalism and stability', body: 'Land, obligation, and local protection mattered because travel and central administration were limited. Feudal arrangements were neither purely generous nor oppressive. They made sense in a dangerous region while leaving people vulnerable to local power.' },
          { heading: 'Church and learning', body: 'Church institutions offered literacy, charity, calendars, and shared stories. They also challenged rulers and sometimes defended privilege. “Spiritual and political” is more accurate than “purely good” or “purely evil.”' },
          { heading: 'Innovation and trade', body: 'Heavy ploughs, mills, trade routes, guilds, universities, and new farming changed communities. The question “why did it end?” is too simple. Plague, politics, printing, commerce, and new ideas accumulated until older arrangements became harder to maintain.' }
        ], connections: ['Churches supported scholarly continuity.', 'Trade connected regions.', 'Printing increased circulation.'], uncertainty: 'The middle ages span a thousand years and many societies. One narrative cannot carry all that variation.', career: 'Medieval history informs architecture, law, linguistics, economics, and institutions.'
      },
      { id: 'renaissance', title: 'The Renaissance', kicker: 'Ancient learning, new questions', minutes: 15,
        story: 'The Renaissance was not a clean “rebirth” after centuries of nobody thinking. Writers, artists, and scientists recovered old texts while changing the questions they asked.',
        sections: [
          { heading: 'Rebirth of what?', body: 'Italian cities had wealth, trade, classical ruins, and libraries. Humanists read Greek and Roman works, but they were not simply copying antiquity. They used old language to explore art, civic life, nature, and experience.' },
          { heading: 'Art and science together', body: 'Leonardo’s notebooks move between anatomy, mechanics, water, and painting. Observation, craft, mathematics, and imagination reinforced one another.' },
          { heading: 'Why Italy first?', body: 'Geography mattered: ports, trade routes, merchants, and city-states gave patrons and practitioners room to exchange work. Other parts of Europe had Renaissance movements on different timelines.' },
          { heading: 'The bridge to now', body: 'Machiavelli wrote about power without pretending rulers were generous. Scientific work questioned inherited authority. The bridge to today is a habit of asking how things work, who benefits, and which assumptions deserve a fresh test.' }
        ], connections: ['Humanism influenced art and politics.', 'Observation connects to early modern science.', 'Printing spread new questions.'], uncertainty: 'Calling a period a rebirth can erase people and knowledge that do not fit the label.', career: 'Art history, design, linguistics, science communication, and institutions draw on this history.'
      }
    ] },
    { id: 'modern', title: 'The Modern Era', intro: 'Industry, empire, technology, and people renegotiating power.', topics: [
      { id: 'industrial-revolution', title: 'Industrial Revolution', kicker: 'Efficiency with a human cost', minutes: 14,
        story: 'Steam power made factories productive and cities crowded. The same transformation changed work, the cost of goods, and who bore risk.',
        sections: [
          { heading: 'Why it began', body: 'Coal, steam engines, improved textiles, capital, and markets reinforced one another. No single machine invented the modern world; resources, labour, and investment changed together.' },
          { heading: 'Jobs and conditions', body: 'Industrialisation created wealth and work that had not existed at that scale. It also produced dangerous factories, child labour, polluted cities, and harsh inequality. Progress and harm can be true in the same period.' },
          { heading: 'Capitalism and environment', body: 'Markets and private investment shaped the era, while slavery, empire, and colonial extraction supplied resources and markets. Fossil fuel use created environmental costs that remain today.' }
        ], connections: ['Energy systems shape economies.', 'Technology changes labour.', 'Extraction connects regions through unequal power.'], uncertainty: 'Industrialisation unfolded differently across regions and social groups.', career: 'Economic history, labour studies, environmental science, engineering ethics, and public policy study these connections.'
      },
      { id: 'modern-era', title: 'Modern Era', kicker: 'The story is still being written', minutes: 15,
        story: 'Wars, independence movements, electricity, computing, and the internet changed ordinary life, while questions about power returned in new forms.',
        sections: [
          { heading: 'World wars', body: 'The world wars were shaped by nationalism, imperial rivalry, industrial capacity, and political decisions. Consequences included redrawn borders, new international institutions, and civilian suffering that changed political memory.' },
          { heading: 'Decolonization', body: 'Colonial rule shaped economies, languages, borders, and identities. Independence movements were led by organisers, soldiers, students, workers, women, and communities. Independence is both a political victory and an unfinished process.' },
          { heading: 'Technology and globalization', body: 'Electricity, computing, and the internet made communication and commerce faster. Globalisation can spread medicine, knowledge, and opportunity while increasing dependency and pressure on cultures and ecosystems.' }
        ], connections: ['War redraws political maps.', 'Technology changes the scale of connection.', 'Globalisation joins economies and ecosystems.'], uncertainty: 'The recent past is contested because records are uneven and consequences continue today.', career: 'Policy, journalism, software, international relations, climate work, and education read change without flattening it.'
      }
    ] }
  ]
};

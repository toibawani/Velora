import type { DictionaryTerm } from './types';

/**
 * Curious Dictionary: Economics.
 *
 * Filed under the subject it belongs to rather than under whichever file
 * it happened to be typed into, so adding a term means opening one file and
 * the compiler checks it against DictionaryTerm while you type.
 */
export const ECONOMICS_TERMS: DictionaryTerm[] = [
{
    id: 'opportunity-cost',
    term: 'Opportunity Cost',
    subject: 'economics',
    letter: 'O',
    tagline: 'The real price of anything is what you gave up to get it.',
    explanation: 'Because time and resources are strictly finite, choosing one path always means sacrificing the next best alternative. Economists measure true cost not just in dollars handed over, but in the unlived opportunities forfeited by that choice.',
    example: 'If you spend an evening studying physics, the dollar cost is zero, but the opportunity cost is the two-hour dinner with your closest friend or the progress you could have made on your novel.',
    source: 'Friedrich von Wieser, Theorie der gesellschaftlichen Wirtschaft (1914)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Opportunity_cost',
  },

{
    id: 'comparative-advantage',
    term: 'Comparative Advantage',
    subject: 'economics',
    letter: 'C',
    tagline: 'Why people and nations benefit from trading even when one is better at everything.',
    explanation: 'Even if an expert lawyer is faster at typing legal briefs than their assistant, it makes economic sense for the lawyer to delegate the typing. The lawyer’s time is better spent on high-value casework where their relative advantage is greatest.',
    example: 'David Ricardo proved that if Portugal is better at making both wine and cloth than England, both nations still get richer by having Portugal concentrate on wine and England on cloth and trading between themselves.',
    source: 'David Ricardo, Principles of Political Economy and Taxation (1817)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Comparative_advantage',
  },

{
    id: 'inflation',
    term: 'Inflation',
    subject: 'economics',
    letter: 'I',
    tagline: 'Money buys less, for reasons that are usually about money.',
    explanation: 'Inflation is a sustained rise in the general price level, which is a monetary phenomenon: money itself is not worth more, it is worth less relative to goods. The common explanations are demand outrunning supply, or more money chasing the same goods.',
    example: 'Zimbabwe in 2008 reached a rate where a lifetime of savings bought a week of bread. Germany in 1923 reached roughly 29,500 percent a year, the most extreme case of a currency printing failure in a major economy.',
    source: 'Friedman, "The Counter-Revolution in Monetary Economics" (1968)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Inflation',
  },

{
    id: 'supply-and-demand',
    term: 'Supply and Demand',
    subject: 'economics',
    letter: 'S',
    tagline: 'The two forces that set almost every price you see.',
    explanation: 'Prices adjust until the quantity people want to buy matches the quantity sellers offer. It is a model, not a law, and it explains a great deal about ordinary markets while failing to explain price gouging and speculative bubbles.',
    example: 'A shortage from a port closure should raise prices and ration by price, but during the 2022 energy crisis European governments capped prices instead, which deliberately traded a shortage for a financial loss on every unit sold.',
    source: 'Smith, An Inquiry into the Nature and Causes of the Wealth of Nations (1776)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Supply_and_demand',
  },

{
    id: 'gdp',
    term: 'Gross Domestic Product',
    subject: 'economics',
    letter: 'G',
    tagline: 'What a country produced, measured with some things left out.',
    explanation: 'GDP is the total value of final goods and services produced in a country in a year, and it was designed as a wartime production measure rather than a measure of wellbeing. It counts disaster cleanup and counts nothing about distribution, leisure, or what the output was for.',
    example: 'A hurricane raises GDP, because spending money to repair damage is counted as output. The same is true of a health-related absence that briefly improves the unemployment rate, and a more expensive house is counted as more output than a cheaper one.',
    source: 'Simons, "Gross Domestic Product" (FRED, 1935)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Gross_domestic_product',
  },

{
    id: 'federal-reserve',
    term: 'Central Bank',
    subject: 'economics',
    letter: 'C',
    tagline: 'The institution that decides how much money is worth.',
    explanation: 'A central bank sets interest rates and controls the money supply, which in turn sets the price of borrowing for everyone else. It is independent of the government in most countries specifically so that it can tighten when that government would prefer to loosen.',
    example: 'The Federal Reserve raised its target from 0 to 5.25 percent in sixteen months in 2022-23, the fastest tightening since 1981, specifically to slow an inflation it had been late to treat as a problem.',
    source: 'Friedman and Schwartz, A Monetary History of the United States (1963)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Central_bank',
  },

{
    id: 'moral-hazard',
    term: 'Moral Hazard',
    subject: 'economics',
    letter: 'M',
    tagline: 'Insurance changes the behaviour it is meant to insure against.',
    explanation: 'When someone is protected from the consequences of a risk, their incentive to prevent it falls, and the effect is predictable and sometimes large. It is a rational response to the incentives, not a character flaw.',
    example: 'Banks that believed the US government would not let them fail kept making riskier loans through the 2000s, which is a case of moral hazard with a very high eventual cost. Deposit insurance solves a different problem and creates its own smaller version of the same one.',
    source: 'Arrow, "Uncertainty and the Welfare Economics of Medical Care" (1963)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Moral_hazard',
  },

{
    id: 'deadweight-loss',
    term: 'Deadweight Loss',
    subject: 'economics',
    letter: 'D',
    tagline: 'Welfare destroyed by a tax, over and above the revenue raised.',
    explanation: 'A tax transfers money from one side to the other and also destroys some of the trade that would have happened, and that destroyed trade is the deadweight loss. It is the part of the effect neither side receives, and it is the standard argument against distortionary taxes.',
    example: 'A per-unit tax rarely changes the quantity sold, so in that textbook case there is no deadweight loss at all. Real taxes change behaviour, which is why the estimated cost of one percentage point of income tax is far below what a flat rate would imply.',
    source: 'Harberger, "The Welfare Aspects of Taxes and Prices" (1938)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Deadweight_loss',
  },

{
    id: 'externalities',
    term: 'Externalities',
    subject: 'economics',
    letter: 'E',
    tagline: 'A cost or benefit that lands on someone who never agreed.',
    explanation: 'When your action changes someone else\'s welfare without being priced into the decision, the market is missing information and will systematically over- or under-produce. Negative externalities tend to be under-priced, which is why they accumulate.',
    example: 'A factory that can dump waste into a river pays less than the cost it imposes downstream, so the cheap good is not actually cheap. Carbon is the same problem, except the damage is global and the delay makes it invisible to voters.',
    source: 'Pigou, The Economics of Welfare (1920)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Externality',
  },

{
    id: 'hyperinflation',
    term: 'Hyperinflation',
    subject: 'economics',
    letter: 'H',
    tagline: 'When money stops working, and the default is to not use it.',
    explanation: 'Hyperinflation is a rate high enough that wages and prices must be renegotiated continuously, usually defined as over 50 percent a month. It almost always has a monetary cause, and it ends either by a currency reform or by someone imposing fiscal discipline.',
    example: 'People stopped holding Weimar marks within weeks and switched to goods, foreign currency, or barter, which is why the prices look so extreme. The shops had restocked daily because anything held was worthless by morning.',
    source: 'Cagan, "The Monetary History of the United States" (1956)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Hyperinflation',
  },

{
    id: 'opportunity-cost-econ',
    term: 'Sunk Cost Fallacy in Economics',
    subject: 'economics',
    letter: 'S',
    tagline: 'The costs that should not be counted, and usually are.',
    explanation: 'A sunk cost is one already incurred and unrecoverable, and a rational decision considers only future costs and benefits. The relevant figure for a continuing decision is the one that differs between continuing and stopping, which almost never includes what you already spent.',
    example: 'Continuing a coal plant costs fuel and maintenance; the capital was spent years ago. Shutting it down and buying gas instead compares those ongoing costs only, which is why decommissioning decisions routinely ignore the original build price on both sides.',
    source: 'Arkes and Blumer, "The Psychology of Sunk Cost" (1985)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Sunk_cost',
  },

{
    id: 'elasticity',
    term: 'Elasticity',
    subject: 'economics',
    letter: 'E',
    tagline: 'How much demand responds to a price change.',
    explanation: 'Elasticity measures the percentage change in quantity demanded per percentage change in price, and it is what lets you predict the effect of raising a price without knowing the demand curve. Demand for necessities tends to be inelastic; luxury goods tend to be elastic.',
    example: 'Insulin is famously price inelastic, which is precisely why pricing it was indefensible. Raising the fare on a commuter rail line 10 percent might cost 2 percent of passengers, and that asymmetry is why operators raise prices on captive riders.',
    source: 'Marshall, Principles of Economics (1895)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Price_elasticity_of_demand',
  },

{
    id: 'gini-coefficient',
    term: 'The Gini Coefficient',
    subject: 'economics',
    letter: 'G',
    tagline: 'One number for how unevenly something is shared.',
    explanation: 'The Gini coefficient summarises income or wealth distribution in a single figure from 0 to 1, where 0 is perfect equality and 1 is perfect concentration. It is useful for comparison over time and between countries, and it says nothing about absolute living standards.',
    example: 'A Gini of 0.30 means the average household in a country receives about 70 percent of the median household income. Both the US and Sweden moved this figure substantially over the twentieth century, in opposite directions, without either changing the definition.',
    source: 'Gini, "Variabilita e Mutabilita" (1912)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Gini_coefficient',
  },

{
    id: 'arbitrage',
    term: 'Arbitrage',
    subject: 'economics',
    letter: 'A',
    tagline: 'A free meal, which is always a sign something is missing.',
    explanation: 'Arbitrage is buying low in one market and selling high in another at the same moment, and a persistent opportunity means something is blocking it. In frictionless markets it cannot survive, which is why it mostly appears where trade is hard.',
    example: 'A US-listed share and its Hong Kong listing track the same company, and a gap between them is arbitraged within minutes by institutional traders. When a 30 percent gap sits open for a day, the explanation is almost always a capital restriction rather than a free profit.',
    source: 'Vince, "The Mathematics of Money Management" (1990)',
    sourceUrl: 'https://en.wikipedia.org/wiki/Arbitrage',
  },
];

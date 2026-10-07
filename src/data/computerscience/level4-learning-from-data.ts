import { CsLevel } from './schema';

/**
 * Level 4: systems that learn instead of being told.
 *
 * The level where the subject's evidence is weakest and its vocabulary is most
 * often abused. Every entry here is about the gap between a number that was
 * measured and a capability that exists, and that gap is where the contested and
 * machine-dependent labels earn their keep.
 *
 * The entries are deliberately in order of increasing scepticism: how the fitting
 * works, then the moment the field's assumptions visibly broke, then the question
 * of what the field is for at all.
 */
const LEVEL_4: CsLevel = {
  id: 'learning-from-data',
  number: 4,
  title: 'Learning from data',
  blurb: 'Fitting, testing, and the moment a field changed its mind.',
  intro:
    'The other levels ask whether something is true. This one asks whether a number means anything, which is a harder question, because a model can produce a perfect score and still have learned nothing. Every entry here is about the difference between the score and the capability, and the habit of asking which one you are looking at.',
  entries: [
    {
      id: 'machine-learning',
      name: 'Machine Learning',
      simple:
        'Instead of writing the rules, you show the computer examples and let it adjust until its guesses match. The trap is that a model can learn the examples perfectly - including the mistake in example 47 - and then be worse on anything new than a much simpler model.',
      deeper:
        'The fitting itself is not mysterious, and describing it precisely changes what the failures turn out to be. {{gradient descent}} means: measure how wrong the predictions are, work out which direction in each weight would have reduced the error, take a small step that way, repeat until the error stops improving. On a deep {{neural network}} that direction comes from {{backpropagation}}, working back from the error through every layer to compute a contribution for every weight - which is why a model with a hundred million parameters needs a hundred million numbers adjusted each step, and why training is expensive while running the model is cheap. The failure mode has a precise name. {{overfitting}} is what happens when a model with enough capacity to fit anything fits the training data so exactly that it absorbs its incidental features: the sensor noise, the particular way one photographer framed a class, the typos in the labels. Its training score keeps climbing, which looks like progress, and its score on new data gets worse. The defence is {{generalization}} - performance on data never seen during fitting - and it is the hardest number in the subject to get honestly, because the moment a person uses test results to make a decision, that test set has become part of training whether or not the code noticed. The field\'s quiet convention is to hold out a validation set for exactly this reason, and its quiet failure is that the held-out set gets consulted repeatedly until it stops being held out.',
      matters:
        'It changes what a reported score is evidence of. A number on a genuinely held-out set is evidence of capability; a number on a set that influenced your choices is evidence about your process rather than about the model, and the two are indistinguishable in a paper. It is also why "we tried a neural network and it did not work" carries so little information, since a model not helping is evidence about the data and the tuning rather than about the approach.',
      status: 'measured',
      source:
        'Overfitting, the train/validation/test distinction and benign overfitting: Wikipedia, "Overfitting", which cites the standard treatment including the reusable-holdout problem.',
      sourceUrl: 'https://en.wikipedia.org/wiki/Overfitting',
    },
    {
      id: 'deep-learning',
      name: 'Deep Learning',
      simple:
        'In 2012 a convolutional network won a large image-recognition contest by such a margin that the rest of the field changed its mind about what was possible, and almost every entry afterwards was a deep network. The margin was 15.3% error against 26.2% for the best system built the old way.',
      deeper:
        'The numbers are the hook, because they were measured on a public dataset under published rules and can be checked. ILSVRC 2012 asked teams to classify 1,000 object categories, scoring the rate of missing the correct answer within five guesses. AlexNet - from Alex Krizhevsky, Ilya Sutskever and Geoffrey Hinton - scored 0.15315. The best classical entry, ISI\'s ensemble of hand-designed features, scored 0.26172. A gap of more than ten percentage points between first and second place, on a benchmark whose field had improved for years by fractions of a point, is the whole event. What the network did differently was architectural rather than clever: it learned its own feature detectors from data instead of using features a person designed, it used rectified linear units rather than saturating ones so gradients would not vanish, and it was trained on two consumer graphics cards because nobody had thought to try. Three consequences followed. Large labelled datasets became the scarce resource rather than clever features. GPUs stopped being for graphics. And "it works if it is big enough" became the field\'s working hypothesis - a hypothesis, and the reason this entry is labelled measured rather than proved is that it describes a result, not a law. Why overparameterised models generalise at all is still not settled, and whether continued scale will substitute for understanding is an open empirical question that the 2012 result is routinely cited for and does not answer.',
      matters:
        'It is the clearest case in the subject of a measured result changing what a whole field believed, and it is worth knowing as a shape rather than a story: a public benchmark, published rules, a margin large enough to be unambiguous. When someone reports a benchmark win, this is the precedent that makes it credible - and the precedent that should make you ask what the benchmark actually measures. It is also why "deep learning" now names an architecture family rather than a method, which is why a reader should treat the terms as interchangeable at their peril.',
      status: 'measured',
      source:
        'ILSVRC 2012 Task 1 published results: SuperVision (AlexNet) top-5 error 0.15315; best classical entry (ISI) 0.26172. image-net.org.',
      sourceUrl: 'https://www.image-net.org/challenges/LSVRC/2012/results.html',
    },
    {
      id: 'artificial-intelligence',
      name: 'Artificial Intelligence',
      simple:
        'The field named itself in 1956 with a claim that every aspect of learning or any other feature of intelligence could in principle be so precisely described that a machine could be made to simulate it. Whether the field has kept that promise is not something the field agrees about.',
      deeper:
        'The 1956 founding document is worth quoting because it makes a promise the label on an entry should not blur. The proposal for the Dartmouth Summer Research Project, organised by John McCarthy, Marvin Minsky, Nathaniel Rochester and Claude Shannon, put forward the thesis that "every aspect of learning or any other feature of intelligence can in principle be so precisely described that a machine can be made to simulate it". That is a specific, falsifiable-sounding claim, and it is roughly what symbolic AI tried to deliver for three decades by writing rules - with the field\'s famous sequence of confident predictions failing to arrive, which is what produced the periods now called AI winters. The deep-learning turn changed the shape of the field without settling the question, by replacing hand-written rules with something whose workings nobody can state completely. What is genuinely contested today is not whether these systems do impressive things - they do - but whether what they do is what the word "intelligence" names. Some researchers argue that behaviour indistinguishable from understanding is understanding enough for engineering purposes and the question is beside the point. Others hold that a system which cannot tell you why it answered is not reasoning at all, and that calling it reasoning has already caused real harm in how systems are deployed. Separately, the term itself has drifted badly: its scope has been redrawn so often that a field which declared itself in 1956 is currently used for products with no learning in them at all.',
      matters:
        'It gives a reader the vocabulary for the most over-claimed word in the subject, and specifically the distinction between a system\'s capability and its explanation, which is the thing a reader can actually check: ask why it decided, and the answer is usually a correlation rather than a reason. It is also the level\'s honest end point, because the field\'s founding promise was about description and the field\'s current methods are precisely the ones that do not describe.',
      status: 'contested',
      source:
        'Dartmouth proposal and workshop: organised by John McCarthy, Marvin Minsky, Nathaniel Rochester and Claude Shannon; eight-week summer workshop, 1956; often called the "Constitutional Convention of AI". Wikipedia, "Dartmouth workshop".',
      sourceUrl: 'https://en.wikipedia.org/wiki/Dartmouth_workshop',
    },
  ],
};

export default LEVEL_4;
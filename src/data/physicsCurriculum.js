// Human-written curriculum for VELORA. These notes are written for a curious person, not a textbook dump.
export const PHYSICS_CURRICULUM = {
  name: 'Physics',
  description: 'The rules underneath everything, from a rolling ball to a warped universe.',
  modules: [
    { id: 'mechanics', title: 'Motion and forces', intro: 'Start with things you can push, pull, and watch change direction.', topics: [
      { id: 'newtons-laws', title: "Newton's Laws", kicker: 'Why a book keeps moving when you stop pushing it', minutes: 12,
        story: 'A hockey puck slides across smooth ice. Your hand gives it a push, then disappears. The puck keeps moving because changing motion requires a force.',
        sections: [
          { heading: 'First law: inertia', body: 'An object keeps doing what it is doing unless a net force changes it. Sit on a moving bus and your body keeps moving when the bus stops. Inertia is not a force; it is the tendency to resist a change in motion.' },
          { heading: 'Second law: F = ma', body: 'Push the same mass harder and it accelerates more. Give the same push to a heavier trolley and it accelerates less. Mass matters because changing more stuff takes more effort.' },
          { heading: 'Third law: pairs', body: 'Push a wall and it pushes back. A rocket pushes hot gas backward; the gas pushes the rocket forward. The forces act on different objects, so they do not cancel. This law is about contact forces, not moral balance.' },
          { heading: 'Where it fails', body: 'Newton is an excellent everyday map, not the whole territory. Relativity changes space and time near light speed. Quantum mechanics replaces a tiny particle with a probability distribution at small scales.' }
        ], connections: ['Inertia connects to momentum.', 'F = ma connects to rockets.', 'Relativity challenges absolute space and time.'], uncertainty: 'Quantum gravity is not settled. We lack one tested theory that works at a black-hole centre and on a table.', career: 'Robotics, aerospace, civil engineering, game physics, and climate modelling all begin by describing forces honestly.'
      },
      { id: 'light-waves', title: 'Light and Waves', kicker: 'The everyday particle that behaves like a wave', minutes: 14,
        story: 'A stone makes rings on a pond. Light also spreads in waves, but a lamp can send energy in packets called photons. The same light can show us both behaviours.',
        sections: [
          { heading: 'Amplitude, frequency, wavelength', body: 'Amplitude is wave height. Frequency is cycles per second. Wavelength is the distance between matching points, such as crest to crest. Shorter light wavelengths are blue; longer ones are red. A prism uses this difference to split white light.' },
          { heading: 'The double-slit experiment', body: 'Light through two narrow slits makes bright and dark interference bands. That is evidence that waves interfere. It does not mean each photon paints a little wave. Quantum objects are described by amplitudes, not ordinary little balls.' },
          { heading: 'The photoelectric effect', body: 'Light can knock electrons from metal. More intense light does not make those electrons much more energetic, but a bluer light does. Einstein said light arrives in packets, each with energy proportional to frequency: E = hf.' },
          { heading: 'Wave or particle?', body: 'Light does not switch costumes. Wave-like and particle-like descriptions work in different experiments. A string vibrates as a wave; a detector registers a click. Science is learning which description is useful without pretending it is the whole truth.' }
        ], connections: ['Waves describe interference.', 'Photons explain the photoelectric effect.', 'Quantum mechanics unites both descriptions.'], uncertainty: 'The single-particle double-slit experiment is still discussed. No one picture settles every philosophical question behind it.', career: 'Photography, medical imaging, telecommunications, semiconductors, and quantum computing use this bridge.'
      }
    ] },
    { id: 'spacetime', title: 'Space, time, and gravity', intro: 'Einstein changed what we mean by gravity.', topics: [{
      id: 'black-holes', title: 'Black Holes', kicker: 'Where our best physics runs out of road', minutes: 18,
      story: 'A collapsed star can make a region where even light cannot return. A black hole is not a vacuum cleaner; gravity has bent spacetime so much that paths point inward.',
      sections: [
        { heading: 'The event horizon', body: 'The event horizon is the boundary beyond which no future path leads back outside. It is not a solid surface. Sagittarius A*, at the centre of our galaxy, is about four million Suns heavy. We watch nearby stars orbit it, so we know the mass is there even though we cannot see it directly.' },
        { heading: 'The singularity', body: 'Classical general relativity predicts a singularity: equations become infinite and our picture of space and time stops working. Calling it an infinite-density ball is a failure of the theory, not a confirmed answer. Quantum gravity may change the story, but nobody has a tested theory that tells us how.' },
        { heading: 'Hawking radiation', body: 'Stephen Hawking’s 1974 calculation said a black hole should lose a tiny amount of energy as if it were glowing. Stellar black holes would be fantastically cold; small black holes would be hotter and, in principle, evaporate. This is theory, not something we have watched happen to a real black hole.' },
        { heading: 'Why gravity bends space', body: 'Einstein’s insight was that gravity is not a mysterious hand. Mass and energy describe how spacetime is curved, and objects follow paths through that geometry. A rubber sheet is only an analogy because time is part of the geometry too. It is useful, then incomplete.' }
      ], connections: ['Black holes are an extreme case of gravity.', 'General relativity explains the geometry.', 'Quantum mechanics complicates the inside.'], uncertainty: 'We have images of glowing material around black holes, not photographs of the inside. The interior remains an open problem.', career: 'Astronomers, mission engineers, data scientists, and theoretical physicists use the same evidence in different ways.'
    }] }
  ]
};

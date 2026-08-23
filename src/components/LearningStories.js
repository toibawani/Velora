import React, { useState } from 'react';
import '../styles/LearningStories.css';

/**
 * LearningStories Component
 * 
 * Reframes isolated curriculum lessons into gripping historical & scientific
 * narrative arcs. Learners follow how real humans struggled, failed, and broke
 * through dogma to discover the cosmos.
 */
function LearningStories({ onSelectStoryTopic }) {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);

  const stories = [
    {
      id: 'black-holes-discovery',
      title: 'The Story of How We Discovered Black Holes',
      subtitle: 'From 18th-century "Dark Stars" in church journals to the first photograph of an event horizon.',
      author: 'Curated by VELORA Astrophysics Archive',
      readTime: '8 min narrative',
      color: '#4f7df3',
      icon: '🌌',
      chapters: [
        {
          title: 'Chapter 1: The Clergyman & The Dark Stars (1783)',
          period: 'Late 18th Century',
          narrative: 'In November 1783, John Michell, an English clergyman and natural philosopher, sent a radical paper to the Royal Society of London. Using Newton’s corpuscular theory of light, Michell calculated that if a star were 500 times wider than the Sun with equal density, its gravitational pull would be so ferocious that its escape velocity would exceed light itself. Light emitted by the star would be dragged back down into total darkness.',
          insight: 'Michell called these hypothetical objects "dark stars"—the very first mathematical intuition of gravitational confinement.'
        },
        {
          title: 'Chapter 2: The Letter from the Russian Front (1916)',
          period: 'World War I',
          narrative: 'In November 1915, Albert Einstein published his monumental field equations for General Relativity. Just weeks later, while stationed with the German army on the frigid Russian front during WWI, physicist Karl Schwarzschild calculated the exact mathematical solution for the spacetime surrounding a single static mass. He wrote to Einstein: "As you see, the war treated me kindly enough, in spite of the heavy gunfire, to allow me to get away from it all and take this walk in the land of your ideas."',
          insight: 'Schwarzschild discovered the exact critical radius ($R_s = 2GM/c^2$) where spacetime folds in on itself—even though Einstein himself doubted such objects could physically exist.'
        },
        {
          title: 'Chapter 3: The Cygnus X-1 Wager (1974)',
          period: 'Cold War Era Astronomy',
          narrative: 'For decades, black holes remained mathematical curiosities. Then in 1971, rocket-borne X-ray detectors identified Cygnus X-1—an invisible object orbiting a massive blue supergiant star, emitting violent bursts of X-ray energy as it cannibalized its stellar companion. Stephen Hawking bet physicist Kip Thorne a year of Penthouse magazine that Cygnus X-1 was NOT a black hole (as an insurance policy). In 1990, Hawking finally conceded the bet.',
          insight: 'Observational astrophysics proved that black holes are real thermodynamic engines populating our galaxy.'
        },
        {
          title: 'Chapter 4: A Planet-Sized Telescope (2019)',
          period: 'Modern Era',
          narrative: 'To photograph the supermassive black hole at the center of galaxy M87, scientists synchronized atomic clocks across radio dishes stretching from Greenland and Chile to Hawaii and the South Pole. Together, they formed a virtual telescope the size of Planet Earth—resolving the glowing orange ring of photons orbiting 55 million light-years away.',
          insight: 'Einstein’s 103-year-old pencil-and-paper equations matched the physical radio shadow with stunning precision.'
        }
      ]
    },
    {
      id: 'ancient-philosophy-modern',
      title: 'Why Ancient Philosophers Still Matter Today',
      subtitle: 'How Socratic aporia, Plato’s cave, and Aristotle’s telos govern modern AI ethics and digital reality.',
      author: 'VELORA Philosophical Studies',
      readTime: '7 min narrative',
      color: '#af52de',
      icon: '🏛️',
      chapters: [
        {
          title: 'Chapter 1: The Marketplace Provocateur (399 BCE)',
          period: 'Classical Athens',
          narrative: 'Socrates walked barefoot through the Agora of Athens, asking merchants, generals, and politicians deceptively simple questions: "What is justice? What is courage?" By systematically exposing the contradictions in their unexamined assumptions, he drove them into a state of *aporia*—a state of profound intellectual confusion that marks the beginning of true wisdom.',
          insight: 'True learning begins not with accumulating facts, but with dismantling unjustified certainties.'
        },
        {
          title: 'Chapter 2: The Allegory of the Algorithmic Cave',
          period: 'Platonic Idealism',
          narrative: 'Plato described prisoners chained inside a dark cave, mistaking the flickering shadows projected onto the wall for absolute reality. When one prisoner escapes into the sunlit world above, the blinding truth is almost too painful to endure. Today, digital algorithms, algorithmic feeds, and generated synthetic media project digital shadows directly into our consciousness.',
          insight: 'Philosophy teaches us to question whether the interfaces we consume reflect physical truth or curated shadows.'
        },
        {
          title: 'Chapter 3: Aristotle & The Machine Telos',
          period: 'Modern Technology',
          narrative: 'Aristotle argued that every organism and artifact has an inherent purpose—a *telos*. An acorn’s telos is to flourish into an oak tree; an eye’s telos is to see clearly. As humanity builds autonomous artificial intelligence systems, we face an urgent Aristotelian dilemma: What is the true telos of automated intelligence, and how do we align it with human flourishing (*eudaimonia*)?',
          insight: 'Ancient ethics is the indispensable blueprint for modern algorithmic governance.'
        }
      ]
    },
    {
      id: 'telescope-revolution',
      title: 'How the Telescope Changed Everything',
      subtitle: 'From Galileo’s glass tube in Venice to James Webb staring into Cosmic Dawn.',
      author: 'VELORA History of Science',
      readTime: '6 min narrative',
      color: '#ff9f0a',
      icon: '🔭',
      chapters: [
        {
          title: 'Chapter 1: Looking Up in Padua (1609)',
          period: 'Renaissance Italy',
          narrative: 'When Galileo Galilei ground his own convex and concave optical lenses and pointed them at the night sky, Aristotelian cosmology was instantly shattered. The Moon was not a perfect celestial crystal; it was rugged with craters and mountains. Jupiter had four companion moons orbiting it, proving that Earth was not the center of all celestial motion.',
          insight: 'Empirical observation with simple instruments shattered two millennia of unassailable doctrine.'
        },
        {
          title: 'Chapter 2: Expanding the Cosmic Horizon (1929)',
          period: 'Mount Wilson Observatory',
          narrative: 'Using the 100-inch Hooker telescope atop Mount Wilson, Edwin Hubble observed Cepheid variable stars in the Andromeda nebula, realizing it was not a cloud of gas within the Milky Way, but an entire separate island universe millions of light-years away. Even more shockingly, distant galaxies were all receding—the fabric of spacetime itself was expanding.',
          insight: 'Humanity suddenly woke up in an evolving, boundless universe.'
        },
        {
          title: 'Chapter 3: Staring into Cosmic Dawn (2022–Present)',
          period: 'Lagrange Point 2 ($L_2$)',
          narrative: 'The James Webb Space Telescope unfolded its 6.5-meter gold-coated beryllium mirror 1.5 million kilometers from Earth. Peering in infrared through cosmic dust lanes, it captured light emitted over 13.5 billion years ago—revealing mature, massive galaxies that ignited just a few hundred million years after the Big Bang.',
          insight: 'Looking deeper into space is physically equivalent to looking backward through time.'
        }
      ]
    }
  ];

  const activeStory = stories[selectedStoryIndex];

  return (
    <div className="learning-stories-container">
      {/* Section Header */}
      <div className="stories-section-header">
        <div>
          <span className="stories-overline">NARRATIVE LEARNING</span>
          <h2 className="stories-title">Learning Stories: How We Learned the Universe</h2>
          <p className="stories-sub">
            Concepts become unforgettable when framed as human journeys of doubt, struggle, and discovery.
          </p>
        </div>
      </div>

      {/* Story Selector Cards */}
      <div className="stories-cards-row">
        {stories.map((story, idx) => (
          <div
            key={story.id}
            className={`story-summary-card ${selectedStoryIndex === idx ? 'active-story' : ''}`}
            onClick={() => { setSelectedStoryIndex(idx); setCurrentChapter(0); }}
          >
            <div className="story-card-top">
              <span className="story-icon-badge" style={{ background: `${story.color}15`, color: story.color }}>
                {story.icon}
              </span>
              <span className="story-read-time">{story.readTime}</span>
            </div>
            <h3 className="story-card-title">{story.title}</h3>
            <p className="story-card-sub">{story.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Active Story Reader */}
      <div className="story-reader-card">
        <div className="reader-header">
          <span className="chapter-count-indicator">
            {activeStory.title} · Chapter {currentChapter + 1} of {activeStory.chapters.length}
          </span>
          <div className="chapter-stepper-dots">
            {activeStory.chapters.map((_, i) => (
              <button
                key={i}
                className={`stepper-dot ${currentChapter === i ? 'current' : ''}`}
                onClick={() => setCurrentChapter(i)}
              />
            ))}
          </div>
        </div>

        <div className="chapter-body-content">
          <span className="chapter-period-badge">
            {activeStory.chapters[currentChapter].period}
          </span>
          <h3 className="chapter-heading">
            {activeStory.chapters[currentChapter].title}
          </h3>
          <p className="chapter-narrative-text">
            {activeStory.chapters[currentChapter].narrative}
          </p>

          <div className="chapter-takeaway-box" style={{ borderLeftColor: activeStory.color }}>
            <span className="takeaway-tag" style={{ color: activeStory.color }}>Core Philosophical Lesson</span>
            <p className="takeaway-body">
              {activeStory.chapters[currentChapter].insight}
            </p>
          </div>
        </div>

        <div className="reader-navigation-footer">
          <button
            className="reader-prev-btn"
            disabled={currentChapter === 0}
            onClick={() => setCurrentChapter(prev => prev - 1)}
          >
            ← Previous Chapter
          </button>

          {currentChapter < activeStory.chapters.length - 1 ? (
            <button
              className="reader-next-btn"
              onClick={() => setCurrentChapter(prev => prev + 1)}
            >
              Continue Chapter {currentChapter + 2} →
            </button>
          ) : (
            <button
              className="reader-next-btn"
              onClick={() => onSelectStoryTopic && onSelectStoryTopic(activeStory.id)}
            >
              Explore Topic in Depth →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LearningStories;

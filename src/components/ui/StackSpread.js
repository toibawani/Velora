import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import '../../styles/ui/StackSpread.css';

/**
 * The hero plate field: eight subject plates resting in a leaning fan, which
 * tidy themselves into a grid as you scroll past.
 *
 * The plates live in /public/hero-plates as drawings rather than linking out to
 * a photo library, so nothing here can rot into a dead hotlink or turn into
 * stock photography of a telescope that has nothing to do with the subject.
 *
 * Layout lives in CSS; motion only drives the difference between the resting
 * fan and the tidied grid. Two habits worth keeping:
 *  - prefers-reduced-motion renders the tidied grid as plain positioned markup.
 *    No scroll subscription, no pointer tracking, no springs. The alternate
 *    render is not a gentler animation, it is the end state, still.
 *  - pointer parallax only attaches for a real mouse, and only while the
 *    pointer is over the stage. A phone scrolling past should not run eight
 *    springs for a pointer that cannot produce a useful position.
 */

const PLATE_BASE = `${process.env.PUBLIC_URL}/hero-plates`;

/**
 * A tidy four-across grid, jittered enough that it does not look printed.
 * The rows sit at plus and minus 26% because the plates are 4:5, which makes
 * them taller than a comfortable reading gap. Closer together and the second
 * row hides behind the first.
 */
const SPREAD = [
  { x: -30, y: -26, r: -3, w: 19 },
  { x: -10, y: -28, r: 2, w: 17 },
  { x: 10, y: -27, r: -2, w: 18 },
  { x: 30, y: -25, r: 3, w: 16 },
  { x: -30, y: 27, r: 3, w: 17 },
  { x: -10, y: 25, r: -3, w: 18 },
  { x: 10, y: 28, r: 2, w: 16 },
  { x: 30, y: 26, r: -3, w: 19 },
];

/** Two across and four down, so the grid still reads on a narrow phone. */
const SPREAD_COMPACT = [
  { x: -23, y: -33, r: -3, w: 40 },
  { x: 23, y: -33, r: 2, w: 40 },
  { x: -23, y: -11, r: 2, w: 40 },
  { x: 23, y: -11, r: -2, w: 40 },
  { x: -23, y: 11, r: -2, w: 40 },
  { x: 23, y: 11, r: 3, w: 40 },
  { x: -23, y: 33, r: 3, w: 40 },
  { x: 23, y: 33, r: -3, w: 40 },
];

/** The resting pose: a leaning pile, so the hero is not eight neat squares. */
const REST = [
  { x: -4, y: -1, r: -11 },
  { x: 5, y: 2, r: 7 },
  { x: -6, y: 3, r: 4 },
  { x: 4, y: -3, r: -6 },
  { x: 0, y: 4, r: 9 },
  { x: -5, y: -4, r: -4 },
  { x: 6, y: 1, r: 5 },
  { x: 1, y: 5, r: -8 },
];

const PLATES = [
  { file: 'pendulum.svg', subject: 'Physics', alt: 'A pendulum drawn hanging straight down with the two extremes of its swing ghosted in and a dashed arc between them.' },
  { file: 'interference.svg', subject: 'Physics', alt: 'Two waves drawn on top of one another adding up to a single larger wave, then drawn out of step adding up to a flat line.' },
  { file: 'prism.svg', subject: 'Optics', alt: 'A white beam entering a prism and leaving as a spread of separate colours.' },
  { file: 'orbit.svg', subject: 'Astronomy', alt: 'A planet on an elliptical path with the star sitting off-centre at one focus, and an arrow showing the direction of travel.' },
  { file: 'column.svg', subject: 'Philosophy', alt: 'A fluted column with a capital and a base, drawn as a simple outline.' },
  { file: 'manuscript.svg', subject: 'History', alt: 'A page of text with a reader’s note marked in the margin.' },
  { file: 'helix.svg', subject: 'Biology', alt: 'Two strands crossing each other repeatedly and joined by short rungs.' },
  { file: 'lattice.svg', subject: 'Chemistry', alt: 'A grid of nine atoms joined by bonds, with the middle one picked out.' },
];

/** Matches a media query and stays in step with it. */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const list = window.matchMedia(query);
    const sync = () => setMatches(list.matches);
    sync();
    list.addEventListener('change', sync);
    return () => list.removeEventListener('change', sync);
  }, [query]);

  return matches;
}

/** The stage's own size, so a percentage offset can be turned into pixels. */
function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box) setSize({ width: box.width, height: box.height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

function PlateArtwork({ plate, index }) {
  return (
    <img
      src={`${PLATE_BASE}/${plate.file}`}
      alt={plate.alt}
      width="400"
      height="520"
      loading={index < 4 ? 'eager' : 'lazy'}
      decoding="async"
      draggable="false"
    />
  );
}

/**
 * One plate. The tidied position is CSS; `dx`, `dy` and `dr` are only the
 * leftover journey from the resting fan, so they shrink to zero on arrival.
 */
function Plate({ plate, index, spread, rest, stage, scrollYProgress, pointerX, pointerY, animate }) {
  // How far this plate has to travel, in pixels, from its tidied home back to
  // where it sits in the fan.
  const offsetX = ((rest.x - spread.x) / 100) * stage.width;
  const offsetY = ((rest.y - spread.y) / 100) * stage.height;
  const angle = rest.r - spread.r;

  const spring = { stiffness: 110, damping: 24, mass: 0.5 };
  const travelX = useSpring(useTransform(scrollYProgress, [0, 1], [offsetX, 0]), spring);
  const travelY = useSpring(useTransform(scrollYProgress, [0, 1], [offsetY, 0]), spring);
  const travelR = useSpring(useTransform(scrollYProgress, [0, 1], [angle, 0]), spring);

  // Per-plate pointer depth, so the field turns as a fan rather than sliding
  // sideways like one rigid sheet. The back plate barely moves, the front one
  // moves most.
  const depthX = 3 + index * 1.1;
  const depthY = 2 + index * 0.7;

  const x = useTransform([travelX, pointerX], ([travel, pointer]) => travel + pointer * depthX);
  const y = useTransform([travelY, pointerY], ([travel, pointer]) => travel + pointer * depthY);

  const style = {
    left: `calc(50% + ${spread.x}%)`,
    top: `calc(50% + ${spread.y}%)`,
    width: `${spread.w}%`,
    rotate: `${spread.r}deg`,
    zIndex: PLATES.length - index,
  };

  if (!animate) {
    return (
      <div className="stack-plate stack-plate-still" style={style}>
        <PlateArtwork plate={plate} index={index} />
        <span className="stack-plate-tag">{plate.subject}</span>
      </div>
    );
  }

  return (
    <motion.div className="stack-plate stack-plate-moving" style={{ ...style, x, y, rotateZ: travelR }}>
      <PlateArtwork plate={plate} index={index} />
      <span className="stack-plate-tag">{plate.subject}</span>
    </motion.div>
  );
}

export default function StackSpread() {
  // motion's own useReducedMotion samples the preference once when its module
  // loads, which makes it awkward to exercise and means a change made during
  // the session is missed. Reading it live is both testable and more correct.
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const finePointer = useMediaQuery('(pointer: fine)');
  const compact = useMediaQuery('(max-width: 720px)');

  const containerRef = React.useRef(null);
  const stage = useElementSize(containerRef);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.94', 'start 0.3'],
  });

  const rawPointerX = useMotionValue(0);
  const rawPointerY = useMotionValue(0);
  const pointerX = useSpring(rawPointerX, { stiffness: 60, damping: 18 });
  const pointerY = useSpring(rawPointerY, { stiffness: 60, damping: 18 });

  const animate = !reduceMotion;
  const tracksPointer = animate && finePointer;
  const targets = compact ? SPREAD_COMPACT : SPREAD;

  const handlePointerMove = (event) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawPointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    rawPointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const recentre = () => {
    rawPointerX.set(0);
    rawPointerY.set(0);
  };

  return (
    <div className={`stack-field${animate ? "" : " stack-field--still"}`}>
      <div
        className="stack-field-stage"
        ref={containerRef}
        {...(tracksPointer
          ? { onPointerMove: handlePointerMove, onPointerLeave: recentre }
          : {})}
        // A group rather than a single image: the eight plates below carry
        // their own descriptions, and wrapping them in role="img" would hide
        // those and announce one picture instead.
        role="group"
        aria-label="Eight drawn plates, one for each field: physics, optics, astronomy, philosophy, history, biology and chemistry."
      >
        {PLATES.map((plate, index) => (
          <Plate
            key={plate.file}
            plate={plate}
            index={index}
            spread={targets[index]}
            rest={REST[index]}
            stage={stage}
            animate={animate}
            scrollYProgress={scrollYProgress}
            pointerX={pointerX}
            pointerY={pointerY}
          />
        ))}
      </div>

      <p className="stack-field-note">
        Scroll, and the pile tidies itself into a grid. That is more or less what the
        curriculum looks like from the outside.
      </p>
    </div>
  );
}

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { advanceSpring, SpringState, SpringConfig } from '../../utils/spring';
import '../../styles/ui/StackSpread.css';

/**
 * The hero plate field: eight subject plates resting in a leaning fan, which
 * tidy themselves into a grid as you scroll past.
 *
 * This version uses plain JS/CSS with requestAnimationFrame instead of motion/react
 * to reduce bundle weight. The spring physics from utils/spring.ts handles the
 * smooth animations.
 *
 * The plates live in /public/hero-plates as drawings rather than linking out to
 * a photo library, so nothing here can rot into a dead hotlink or turn into
 * stock photography of a telescope that has nothing to do with the subject.
 *
 * Layout lives in CSS; JS only drives the difference between the resting
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
  { file: 'manuscript.svg', subject: 'History', alt: 'A page of text with a reader\'s note marked in the margin.' },
  { file: 'helix.svg', subject: 'Biology', alt: 'Two strands crossing each other repeatedly and joined by short rungs.' },
  { file: 'lattice.svg', subject: 'Chemistry', alt: 'A grid of nine atoms joined by bonds, with the middle one picked out.' },
];

const SPRING_CONFIG: SpringConfig = { stiffness: 110, damping: 24, mass: 0.5 };
const POINTER_SPRING_CONFIG: SpringConfig = { stiffness: 60, damping: 18, mass: 0.5 };

interface PlateTransform {
  x: number;
  y: number;
  r: number;
}

interface StackSpreadProps {
  // No props needed for now
}

function PlateArtwork({ plate, index }: { plate: typeof PLATES[0]; index: number }) {
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
 * One plate. The tidied position is CSS; we only apply the leftover journey
 * from the resting fan via transform.
 */
function Plate({
  plate,
  index,
  spread,
  rest,
  stage,
  transform,
  animate
}: {
  plate: typeof PLATES[0];
  index: number;
  spread: typeof SPREAD[0];
  rest: typeof REST[0];
  stage: { width: number; height: number };
  transform: PlateTransform;
  animate: boolean;
}) {
  const baseStyle = {
    left: `calc(50% + ${spread.x}%)`,
    top: `calc(50% + ${spread.y}%)`,
    width: `${spread.w}%`,
    rotate: `${spread.r}deg`,
    zIndex: PLATES.length - index,
  };

  if (!animate) {
    return (
      <div className="stack-plate stack-plate-still" style={baseStyle}>
        <PlateArtwork plate={plate} index={index} />
        <span className="stack-plate-tag">{plate.subject}</span>
      </div>
    );
  }

  // Calculate the offset from spread position to rest position
  const offsetX = ((rest.x - spread.x) / 100) * stage.width;
  const offsetY = ((rest.y - spread.y) / 100) * stage.height;
  const angle = rest.r - spread.r;

  // Apply the spring-driven transform on top of the base position
  const motionStyle = {
    ...baseStyle,
    transform: `translate(-50%, -50%) translate3d(${transform.x + offsetX}px, ${transform.y + offsetY}px, 0) rotate(${transform.r + angle}deg)`,
  };

  return (
    <div className="stack-plate stack-plate-moving" style={motionStyle}>
      <PlateArtwork plate={plate} index={index} />
      <span className="stack-plate-tag">{plate.subject}</span>
    </div>
  );
}

export default function StackSpread(_props: StackSpreadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState({ width: 0, height: 0 });
  const [transforms, setTransforms] = useState<PlateTransform[]>(
    PLATES.map(() => ({ x: 0, y: 0, r: 0 }))
  );
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });

  // Media queries
  const [reduceMotion, setReduceMotion] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const [compact, setCompact] = useState(false);

  // Spring states for each plate
  const springStatesRef = useRef<SpringState[]>(
    PLATES.map(() => ({ value: 0, velocity: 0 }))
  );
  const pointerSpringRef = useRef<SpringState>({ value: 0, velocity: 0 });
  const pointerYSpringRef = useRef<SpringState>({ value: 0, velocity: 0 });

  // Scroll and pointer tracking
  const scrollProgressRef = useRef(0);
  const targetPointerXRef = useRef(0);
  const targetPointerYRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Check media queries on mount and when they change
  useEffect(() => {
    const checkMediaQueries = () => {
      setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      setFinePointer(window.matchMedia('(pointer: fine)').matches);
      setCompact(window.matchMedia('(max-width: 720px)').matches);
    };

    checkMediaQueries();

    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(pointer: fine)'),
      window.matchMedia('(max-width: 720px)'),
    ];

    const handlers = mediaQueries.map((mq) => {
      const handler = () => checkMediaQueries();
      mq.addEventListener('change', handler);
      return { mq, handler };
    });

    return () => {
      handlers.forEach(({ mq, handler }) => mq.removeEventListener('change', handler));
    };
  }, []);

  // Measure stage size
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const measure = () => {
      const rect = node.getBoundingClientRect();
      setStage({ width: rect.width, height: rect.height });
    };

    measure();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure);
      observer.observe(node);
      return () => observer.disconnect();
    }
    return undefined;
  }, []);

  // Scroll tracking
  useEffect(() => {
    if (reduceMotion) return;

    const node = containerRef.current;
    if (!node) return;

    const handleScroll = () => {
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress: 0 when section is at bottom of viewport,
      // 1 when section has scrolled up to 30% of viewport
      const start = viewportHeight * 0.94;
      const end = viewportHeight * 0.3;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      
      scrollProgressRef.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial measurement

    return () => window.removeEventListener('scroll', handleScroll);
  }, [reduceMotion]);

  // Pointer tracking
  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (!finePointer || reduceMotion) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    targetPointerXRef.current = (event.clientX - rect.left) / rect.width - 0.5;
    targetPointerYRef.current = (event.clientY - rect.top) / rect.height - 0.5;
  }, [finePointer, reduceMotion]);

  const handlePointerLeave = useCallback(() => {
    targetPointerXRef.current = 0;
    targetPointerYRef.current = 0;
  }, []);

  // Animation loop
  useEffect(() => {
    if (reduceMotion) return;

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      // Update scroll springs for each plate
      const newTransforms: PlateTransform[] = PLATES.map((_, index) => {
        const state = springStatesRef.current[index];
        const target = scrollProgressRef.current;
        
        // Apply spring physics (mutates state in place)
        advanceSpring(state, target, SPRING_CONFIG, deltaTime);
        
        // The transform value goes from 1 (at rest) to 0 (spread)
        const t = 1 - state.value;
        
        return { x: 0, y: 0, r: t };
      });

      // Update pointer springs (mutates in place)
      advanceSpring(pointerSpringRef.current, targetPointerXRef.current, POINTER_SPRING_CONFIG, deltaTime);
      advanceSpring(pointerYSpringRef.current, targetPointerYRef.current, POINTER_SPRING_CONFIG, deltaTime);

      setPointerOffset({ x: pointerSpringRef.current.value, y: pointerYSpringRef.current.value });
      setTransforms(newTransforms);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [reduceMotion]);

  const animate = !reduceMotion;
  const tracksPointer = animate && finePointer;
  const targets = compact ? SPREAD_COMPACT : SPREAD;

  // Apply pointer parallax to each plate based on depth
  const finalTransforms = transforms.map((transform, index) => {
    const depthX = 3 + index * 1.1;
    const depthY = 2 + index * 0.7;
    return {
      x: pointerOffset.x * depthX * 50, // Scale up for visible effect
      y: pointerOffset.y * depthY * 50,
      r: transform.r,
    };
  });

  return (
    <div className={`stack-field${animate ? "" : " stack-field--still"}`}>
      <div
        className="stack-field-stage"
        ref={containerRef}
        {...(tracksPointer
          ? { onPointerMove: handlePointerMove, onPointerLeave: handlePointerLeave }
          : {})}
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
            transform={finalTransforms[index]}
            animate={animate}
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

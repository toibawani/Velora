import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from 'motion/react';
import '../../styles/ui/StackSpread.css';

// Using curated educational photography fitting VELORA's subjects
const IMG = {
  physics: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=800&fit=crop',
  philosophy: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=800&fit=crop',
  mathematics: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=800&fit=crop',
  biology: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&h=800&fit=crop',
  history: 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=600&h=800&fit=crop',
  chemistry: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=800&fit=crop',
  astronomy: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=800&fit=crop',
  literature: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=800&fit=crop',
};

const SCALE = {
  1: 0.9,
  2: 0.8,
  3: 0.9,
  4: 0.8,
  5: 0.8,
  6: 0.9,
  7: 0.9,
  8: 0.7,
};

const s = (i) => SCALE[i] ?? 1;

// array order = stack order, back (z 2) -> front (z 9)
const CARDS = [
  {
    item: { src: IMG.literature, alt: 'Literature and primary texts' },
    stackOffset: { x: -8, y: -10 },
    stackRotate: -18,
    target: { x: -20, y: -34, rotate: 0, scale: s(8), w: 17, h: 22 },
    targetSm: { x: -22, y: -36 },
    z: 2,
  },
  {
    item: { src: IMG.astronomy, alt: 'Astronomy and deep space' },
    stackOffset: { x: 14, y: -10 },
    stackRotate: 20,
    target: { x: 32, y: -30, rotate: 0, scale: s(7), w: 18, h: 32 },
    targetSm: { x: 22, y: -36 },
    z: 3,
  },
  {
    item: { src: IMG.chemistry, alt: 'Molecular structures and chemistry' },
    stackOffset: { x: -16, y: 0 },
    stackRotate: -4,
    target: { x: -36, y: -2, rotate: 0, scale: s(6), w: 15, h: 32 },
    targetSm: { x: -22, y: -18 },
    z: 4,
  },
  {
    item: { src: IMG.history, alt: 'Historical archives and artifacts' },
    stackOffset: { x: 1, y: -10 },
    stackRotate: -2,
    target: { x: 6, y: -32, rotate: 0, scale: s(5), w: 25, h: 30 },
    targetSm: { x: 22, y: -18 },
    z: 5,
  },
  {
    item: { src: IMG.biology, alt: 'Cellular biology and living systems' },
    stackOffset: { x: 18, y: 1 },
    stackRotate: 6,
    target: { x: 37, y: 6, rotate: 0, scale: s(4), w: 18, h: 32 },
    targetSm: { x: -22, y: 18 },
    z: 6,
  },
  {
    item: { src: IMG.mathematics, alt: 'Mathematical geometry and proofs' },
    stackOffset: { x: -6, y: 10 },
    stackRotate: 6,
    target: { x: -24, y: 34, rotate: 0, scale: s(3), w: 22, h: 25 },
    targetSm: { x: 22, y: 18 },
    z: 7,
  },
  {
    item: { src: IMG.philosophy, alt: 'Epistemology and classical philosophy' },
    stackOffset: { x: 8, y: 7 },
    stackRotate: 3,
    target: { x: 2, y: 36, rotate: 0, scale: s(2), w: 20, h: 26 },
    targetSm: { x: -22, y: 36 },
    z: 8,
  },
  {
    item: { src: IMG.physics, alt: 'Theoretical physics and relativity' },
    stackOffset: { x: 20, y: 12 },
    stackRotate: -7,
    target: { x: 30, y: 34, rotate: 0, scale: s(1), w: 16, h: 20 },
    targetSm: { x: 22, y: 36 },
    z: 9,
  },
];

/**
 * Individual animated card with dedicated hook calls
 */
function ScatterCard({ card, scrollYProgress, isMobile, mouseX, mouseY }) {
  const target = isMobile ? card.targetSm : card.target;
  const targetX = target.x;
  const targetY = target.y;
  const targetRotate = target.rotate || 0;
  const targetScale = target.scale || 1;

  // Scroll transforms
  const scrollX = useTransform(scrollYProgress, [0.1, 0.9], [card.stackOffset.x * (isMobile ? 0.6 : 1), targetX]);
  const scrollY = useTransform(scrollYProgress, [0.1, 0.9], [card.stackOffset.y * (isMobile ? 0.6 : 1), targetY]);
  const scrollRotate = useTransform(scrollYProgress, [0.1, 0.9], [card.stackRotate, targetRotate]);
  const scrollScale = useTransform(scrollYProgress, [0.1, 0.9], [1, targetScale]);

  // Spring physics for natural organic feel
  const springX = useSpring(scrollX, { stiffness: 90, damping: 22 });
  const springY = useSpring(scrollY, { stiffness: 90, damping: 22 });
  const springRotate = useSpring(scrollRotate, { stiffness: 90, damping: 22 });
  const springScale = useSpring(scrollScale, { stiffness: 90, damping: 22 });

  // Optional subtle pointer parallax based on card depth
  const parallaxFactor = (card.z - 1) * (isMobile ? 0 : 0.015);
  const parallaxX = useTransform(mouseX, [-0.5, 0.5], [-20 * parallaxFactor, 20 * parallaxFactor]);
  const parallaxY = useTransform(mouseY, [-0.5, 0.5], [-20 * parallaxFactor, 20 * parallaxFactor]);
  const springParallaxX = useSpring(parallaxX, { stiffness: 120, damping: 25 });
  const springParallaxY = useSpring(parallaxY, { stiffness: 120, damping: 25 });

  const finalX = useTransform([springX, springParallaxX], ([sX, pX]) => `${sX + pX}%`);
  const finalY = useTransform([springY, springParallaxY], ([sY, pY]) => `${sY + pY}%`);

  const cardWidth = isMobile ? '38vw' : `${target.w || 18}vw`;
  const cardHeight = isMobile ? '48vw' : `${target.h || 26}vw`;

  return (
    <motion.div
      className="stack-card"
      style={{
        left: '50%',
        top: '50%',
        x: '-50%',
        y: '-50%',
        translateX: finalX,
        translateY: finalY,
        rotate: springRotate,
        scale: springScale,
        zIndex: card.z,
        width: cardWidth,
        height: cardHeight,
        maxWidth: isMobile ? '160px' : '260px',
        maxHeight: isMobile ? '220px' : '360px',
      }}
    >
      <img
        src={card.item.src}
        alt={card.item.alt}
        loading="lazy"
        draggable={false}
      />
    </motion.div>
  );
}

function StackSpread() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Pointer position for desktop parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile || prefersReducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xRatio);
    mouseY.set(yRatio);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Respect prefers-reduced-motion: render clean, accessible static composition
  if (prefersReducedMotion) {
    return (
      <div className="stack-spread-container" ref={containerRef}>
        <div className="stack-spread-reduced">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="stack-card-static"
              style={{
                transform: `translate(${card.stackOffset.x * 2}px, ${card.stackOffset.y * 2}px) rotate(${card.stackRotate}deg)`,
                zIndex: card.z,
              }}
            >
              <img src={card.item.src} alt={card.item.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="stack-spread-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="stack-spread-wrapper">
        {CARDS.map((card, i) => (
          <ScatterCard
            key={i}
            card={card}
            scrollYProgress={scrollYProgress}
            isMobile={isMobile}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        ))}
      </div>
    </div>
  );
}

export default StackSpread;

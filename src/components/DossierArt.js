/**
 * DossierArt - the plate at the head of a dossier.
 *
 * Every dossier gets a drawing generated from its own subject rather than a
 * stock illustration: a horizon for the Unruh effect, a split disc for
 * Banach-Tarski, a tape for Turing, a network for the mycorrhiza. The geometry
 * is deterministic from the dossier id, so a given essay always has the same
 * plate, and it is drawn in the theme's own ink and ember rather than shipped
 * as a bitmap that would fight the paper palette.
 *
 * Decorative by design: the article's heading already names the subject, so the
 * plate is hidden from assistive technology instead of given alt text that
 * repeats the title.
 */
import React from 'react';
import '../styles/DossierArt.css';

const seeded = (text) => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const arcs = (r) => (
  <g>
    {Array.from({ length: 15 }, (_, i) => (
      <circle
        key={i}
        cx="500"
        cy="360"
        r={40 + i * 24}
        fill="none"
        strokeWidth={i % 4 === 0 ? 1.4 : 0.7}
        style={{ opacity: 0.18 + i * 0.028 }}
      />
    ))}
    {Array.from({ length: 46 }, (_, i) => {
      const angle = (Math.PI * i) / 45;
      const inner = 40 + r() * 70;
      const outer = 200 + r() * 150;
      return (
        <line
          key={`s${i}`}
          x1={500 + Math.cos(angle) * inner}
          y1={360 - Math.sin(angle) * inner}
          x2={500 + Math.cos(angle) * outer}
          y2={360 - Math.sin(angle) * outer}
          strokeWidth="0.6"
          style={{ opacity: 0.1 + r() * 0.18 }}
        />
      );
    })}
    <line x1="60" y1="360" x2="940" y2="360" strokeWidth="1.2" className="dart-draw" />
  </g>
);

const interference = (r) => (
  <g>
    {Array.from({ length: 18 }, (_, i) => {
      const phase = r() * Math.PI * 2;
      const amp = 18 + r() * 42;
      const points = Array.from({ length: 61 }, (_, k) => {
        const x = 40 + k * 15.5;
        const y = 170 + Math.sin((k / 60) * Math.PI * 4 + phase) * amp * Math.sin((k / 60) * Math.PI);
        return `${k === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      return (
        <path
          key={i}
          d={points}
          fill="none"
          strokeWidth={i % 3 === 0 ? 1.3 : 0.7}
          style={{ opacity: 0.12 + (i % 6) * 0.06 }}
        />
      );
    })}
  </g>
);

const lattice = (r) => (
  <g>
    {Array.from({ length: 30 }, (_, row) =>
      Array.from({ length: 58 }, (_, col) => {
        const x = 20 + col * 17;
        const y = 30 + row * 10;
        const wave = Math.sin(col / 5 + row / 3) * 0.5 + 0.5;
        return (
          <circle
            key={`${row}-${col}`}
            cx={x}
            cy={y}
            r={1 + wave * 3.1}
            style={{ opacity: 0.12 + wave * 0.5 }}
          />
        );
      })
    )}
    <path d="M0,120 C220,40 380,250 560,160 S860,70 1000,170" fill="none" strokeWidth="1.6" className="dart-draw" />
  </g>
);

const split = () => (
  <g>
    <circle cx="390" cy="170" r="120" fill="none" strokeWidth="1.4" />
    <circle cx="610" cy="170" r="120" fill="none" strokeWidth="1.4" style={{ opacity: 0.55 }} />
    <circle cx="500" cy="170" r="120" fill="none" strokeWidth="0.9" strokeDasharray="9 7" style={{ opacity: 0.4 }} />
    {Array.from({ length: 7 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 7;
      return (
        <line
          key={i}
          x1="500"
          y1="170"
          x2={500 + Math.cos(a) * 120}
          y2={170 + Math.sin(a) * 120}
          strokeWidth="0.7"
          style={{ opacity: 0.4 }}
        />
      );
    })}
    <path d="M470,110 L520,120 L530,175 L485,205 L440,170 Z" fill="currentColor" style={{ opacity: 0.12 }} />
  </g>
);

const diagonal = (r) => (
  <g>
    {Array.from({ length: 11 }, (_, row) =>
      Array.from({ length: 34 }, (_, col) => {
        const filled = col === row * 3 || (row === 10 && col > 27);
        return (
          <rect
            key={`${row}-${col}`}
            x={24 + col * 28}
            y={12 + row * 30}
            width="24"
            height="26"
            fill={filled ? 'currentColor' : 'none'}
            strokeWidth="0.5"
            style={{ opacity: filled ? 0.2 + r() * 0.15 : 0.18 }}
          />
        );
      })
    )}
  </g>
);

const network = (r) => {
  const nodes = Array.from({ length: 34 }, () => ({
    x: 60 + r() * 880,
    y: 30 + r() * 280,
    s: 1.4 + r() * 3.4,
  }));
  return (
    <g>
      {nodes.map((a, i) =>
        nodes.slice(i + 1).map((b, j) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > 120) return null;
          return (
            <line
              key={`${i}-${j}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              strokeWidth="0.5"
              style={{ opacity: 0.32 - d / 420 }}
            />
          );
        })
      )}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.s} style={{ opacity: 0.6 }} />
      ))}
    </g>
  );
};

const orbit = (r) => (
  <g>
    {Array.from({ length: 9 }, (_, i) => (
      <ellipse
        key={i}
        cx="500"
        cy="170"
        rx={90 + i * 24}
        ry={50 + i * 12}
        fill="none"
        strokeWidth="0.8"
        transform={`rotate(${i * 11} 500 170)`}
        style={{ opacity: 0.14 + i * 0.04 }}
      />
    ))}
    <circle cx="500" cy="170" r="5" fill="currentColor" />
    {Array.from({ length: 24 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 24;
      const rad = 260 + r() * 60;
      return <circle key={`p${i}`} cx={500 + Math.cos(a) * rad} cy={170 + Math.sin(a) * rad * 0.4} r={1.6} style={{ opacity: 0.5 }} />;
    })}
  </g>
);

const tape = () => (
  <g>
    {Array.from({ length: 20 }, (_, i) => (
      <g key={i}>
        <rect x={i * 50} y="120" width="50" height="80" fill="none" strokeWidth="0.8" style={{ opacity: 0.32 }} />
        <circle cx={i * 50 + 25} cy="160" r={i % 3 === 0 ? 7 : 3} fill="currentColor" style={{ opacity: i % 3 === 0 ? 0.5 : 0.22 }} />
      </g>
    ))}
    <path d="M940,160 L960,140 L960,180 Z" fill="currentColor" style={{ opacity: 0.7 }} />
    <line x1="0" y1="120" x2="1000" y2="120" strokeWidth="1.1" />
    <line x1="0" y1="200" x2="1000" y2="200" strokeWidth="1.1" />
  </g>
);

const helix = () => (
  <g>
    {Array.from({ length: 34 }, (_, i) => {
      const x = 40 + i * 27;
      const y1 = 110 + Math.sin(i / 3) * 52;
      const y2 = 110 - Math.sin(i / 3) * 52;
      return <line key={i} x1={x} y1={y1} x2={x} y2={y2} strokeWidth="0.7" style={{ opacity: 0.3 }} />;
    })}
    <path
      d={`M${Array.from({ length: 61 }, (_, i) => `${40 + i * 15.3},${110 + Math.sin(i / 5) * 52}`).join(' L')}`}
      fill="none"
      strokeWidth="1.5"
      className="dart-draw"
    />
    <path
      d={`M${Array.from({ length: 61 }, (_, i) => `${40 + i * 15.3},${110 - Math.sin(i / 5) * 52}`).join(' L')}`}
      fill="none"
      strokeWidth="1.5"
      style={{ opacity: 0.55 }}
    />
  </g>
);

const crystal = () => (
  <g>
    {Array.from({ length: 9 }, (_, row) =>
      Array.from({ length: 18 }, (_, col) => {
        const x = 30 + col * 54 + (row % 2 ? 27 : 0);
        const y = 30 + row * 38;
        return (
          <polygon
            key={`${row}-${col}`}
            points={`${x},${y - 17} ${x + 16},${y} ${x},${y + 17} ${x - 16},${y}`}
            fill="none"
            strokeWidth="0.7"
            style={{ opacity: 0.2 + ((row + col) % 4) * 0.07 }}
          />
        );
      })
    )}
    <polygon points="500,40 560,170 500,300 440,170" fill="currentColor" style={{ opacity: 0.08 }} />
  </g>
);

const gears = () => (
  <g>
    {[
      { cx: 290, cy: 160, r: 95, teeth: 20 },
      { cx: 540, cy: 160, r: 66, teeth: 14 },
      { cx: 700, cy: 215, r: 38, teeth: 9 },
    ].map((gear, index) => (
      <g key={index}>
        <circle cx={gear.cx} cy={gear.cy} r={gear.r} fill="none" strokeWidth="1.2" style={{ opacity: 0.5 - index * 0.08 }} />
        <circle cx={gear.cx} cy={gear.cy} r={gear.r * 0.2} fill="none" strokeWidth="1.4" style={{ opacity: 0.6 }} />
        {Array.from({ length: gear.teeth }, (_, i) => {
          const a = (Math.PI * 2 * i) / gear.teeth;
          return (
            <line
              key={i}
              x1={gear.cx + Math.cos(a) * gear.r}
              y1={gear.cy + Math.sin(a) * gear.r}
              x2={gear.cx + Math.cos(a) * (gear.r + 10)}
              y2={gear.cy + Math.sin(a) * (gear.r + 10)}
              strokeWidth="2"
              style={{ opacity: 0.45 }}
            />
          );
        })}
      </g>
    ))}
  </g>
);

const strata = () => (
  <g>
    {Array.from({ length: 11 }, (_, i) => {
      const y = 20 + i * 30;
      return (
        <path
          key={i}
          d={`M0,${y} C180,${y - 12} 320,${y + 14} 500,${y} S820,${y - 10} 1000,${y + 4}`}
          fill="none"
          strokeWidth={i % 3 === 0 ? 1.5 : 0.7}
          style={{ opacity: 0.14 + (i % 4) * 0.08 }}
        />
      );
    })}
    {Array.from({ length: 26 }, (_, i) => (
      <circle key={`d${i}`} cx={20 + i * 38} cy={40 + (i % 9) * 32} r={i % 4 === 0 ? 3 : 1.4} style={{ opacity: 0.35 }} />
    ))}
  </g>
);

const field = () => (
  <g>
    {Array.from({ length: 34 }, (_, row) =>
      Array.from({ length: 60 }, (_, col) => {
        const x = 8 + col * 17;
        const y = 10 + row * 10;
        const bend = Math.exp(-(((x - 500) / 210) ** 2) - (((y - 170) / 120) ** 2));
        return <circle key={`${row}-${col}`} cx={x} cy={y} r={1.1 + bend * 2.2} style={{ opacity: 0.1 + bend * 0.55 }} />;
      })
    )}
    <circle cx="500" cy="170" r="9" fill="none" strokeWidth="1.6" style={{ opacity: 0.8 }} />
    <ellipse cx="500" cy="170" rx="150" ry="70" fill="none" strokeWidth="0.8" strokeDasharray="5 6" style={{ opacity: 0.4 }} />
  </g>
);

const MOTIFS = { arcs, interference, lattice, split, diagonal, network, orbit, tape, helix, crystal, gears, strata, field };

/**
 * Which drawing belongs to which essay. Kept next to the drawings rather than
 * in the prose data: a motif is a presentation decision, and the essays should
 * not have to carry a layout word to be readable as text.
 */
export const MOTIF_BY_ID = {
  'unruh-effect': 'arcs',
  'casimir-effect': 'interference',
  'quantum-zeno': 'orbit',
  'landauer-principle': 'diagonal',
  'time-crystals': 'crystal',
  'banach-tarski': 'split',
  'godel-incompleteness': 'diagonal',
  'slime-mould': 'network',
  'mycorrhizal-networks': 'network',
  'arrow-of-time': 'orbit',
  'false-vacuum': 'lattice',
  'spin-ice': 'crystal',
  'p-adic-numbers': 'arcs',
  'monty-hall': 'split',
  'continuum-hypothesis': 'diagonal',
  'turing-halting': 'tape',
  'horizontal-gene-transfer': 'helix',
  'predictive-processing': 'network',
  'belousov-zhabotinsky': 'interference',
  chirality: 'split',
  'haber-bosch': 'lattice',
  'hubble-tension': 'arcs',
  'dark-matter': 'field',
  'cosmological-constant': 'lattice',
  'antikythera-mechanism': 'gears',
  'year-536': 'strata',
  'library-of-alexandria': 'strata',
  'personal-identity': 'split',
  'epistemic-injustice': 'network',
  'is-ought-gap': 'diagonal',
};

export const motifFor = (id) => MOTIF_BY_ID[id] || 'arcs';

export default function DossierArt({ motif = 'arcs', seed = 'velora', label }) {
  const draw = MOTIFS[motif] || MOTIFS.arcs;
  return (
    <figure className={`dart dart--${motif}`} aria-hidden="true">
      <svg viewBox="0 0 1000 340" preserveAspectRatio="xMidYMid slice" role="presentation" focusable="false">
        <g stroke="currentColor" fill="currentColor" strokeLinecap="round">
          {draw(seeded(`${seed}-${motif}`))}
        </g>
      </svg>
      {label ? <figcaption className="dart-label">{label}</figcaption> : null}
    </figure>
  );
}

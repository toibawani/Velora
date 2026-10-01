import { render, screen, fireEvent } from '@testing-library/react';
import UniverseBuilder, { findFreeSpot } from './UniverseBuilder';

const NODE_RADIUS = 24;
const NODE_LABEL_DROP = 36;
const LABEL_HALF_HEIGHT = 4.7;

// The rule the placement has to satisfy, written once and used by both tests.
const isClear = (candidate, existing) =>
  !existing.some((node) => {
    const dx = candidate.x - node.position.x;
    const dy = candidate.y - node.position.y;
    if (Math.hypot(dx, dy) < NODE_RADIUS * 2) return true;
    const labelTop = node.position.y + NODE_LABEL_DROP - LABEL_HALF_HEIGHT;
    const labelBottom = node.position.y + NODE_LABEL_DROP + LABEL_HALF_HEIGHT;
    return Math.abs(dx) < 100 && candidate.y > labelTop - 8 && candidate.y < labelBottom + 8;
  });

const grid = [
  { position: { x: 140, y: 120 } },
  { position: { x: 320, y: 180 } },
  { position: { x: 200, y: 260 } },
  { position: { x: 380, y: 300 } },
  { position: { x: 90, y: 300 } },
];

test('places a new node clear of every existing node and label', () => {
  // Each existing node in turn is also the seed point: the worst case, where the
  // naive placement would have dropped the new node exactly on top of one.
  for (const node of grid) {
    const spot = findFreeSpot(grid, node.position);
    expect(isClear(spot, grid)).toBe(true);
  }
});

test('places a new node clear even when the seed sits on a node', () => {
  const crowded = [...grid, { position: { x: 270, y: 190 } }];
  const spot = findFreeSpot(crowded, { x: 270, y: 190 });
  expect(isClear(spot, crowded)).toBe(true);
});

test('is deterministic for the same seed', () => {
  expect(findFreeSpot(grid, { x: 55, y: 95 })).toEqual(findFreeSpot(grid, { x: 55, y: 95 }));
});

test('keeps the placement inside the SVG viewBox', () => {
  const spot = findFreeSpot(grid, { x: 540, y: 380 });
  expect(spot.x).toBeLessThanOrEqual(540);
  expect(spot.y).toBeLessThanOrEqual(380);
  expect(spot.x).toBeGreaterThan(0);
  expect(spot.y).toBeGreaterThan(0);
});

test('adding ten concepts never places a node on another', () => {
  render(<UniverseBuilder />);
  fireEvent.click(screen.getByRole('button', { name: /add concept node/i }));

  const names = [
    'Quantum Tunneling',
    'Plate Tectonics',
    'The Cogito',
    'Entropy',
    'Natural Selection',
    'Dialectic',
    'Wave Function',
    'Gene Expression',
    'Sovereignty',
    'Field Theory',
  ];

  names.forEach((name) => {
    fireEvent.change(screen.getByLabelText(/Concept Name/i), { target: { value: name } });
    fireEvent.click(screen.getByRole('button', { name: /add node & connect/i }));
    fireEvent.click(screen.getByRole('button', { name: /add concept node/i }));
  });

  // Read the positions straight out of the rendered SVG. Before collision
  // avoidance this test could not exist: positions were Math.random(), so
  // placing ten nodes produced overlaps roughly a fifth of the time per node.
  const svg = document.querySelector('.topology-svg');
  const nodes = [...svg.querySelectorAll('g.topology-node')].map((g) => {
    const [, x, y] = g.getAttribute('transform').match(/translate\(([-\d.]+),\s*([-\d.]+)\)/);
    return { position: { x: Number(x), y: Number(y) } };
  });

  expect(nodes.length).toBe(14); // four seeds plus the ten added here
  for (let i = 0; i < nodes.length; i += 1) {
    expect(isClear(nodes[i], nodes.filter((_, j) => j !== i))).toBe(true);
  }
});
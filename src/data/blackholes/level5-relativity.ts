import { BlackHoleLevel } from './schema';

/**
 * Level 5: the relativity you need for the rest of the subject.
 *
 * Level 1 gave the escape-velocity picture, which is the right way in. This
 * level replaces the picture with the mechanism, because Levels 6 onwards need
 * the mechanism rather than the intuition. Each entry says what the older way of
 * thinking got wrong, because the failure of the Newtonian version is usually
 * clearer than the new idea on its own.
 */
const LEVEL_5: BlackHoleLevel = {
  id: 'relativity',
  number: 5,
  title: 'Relativity, properly',
  blurb: 'Geodesics, proper time, light cones, lensing, frame dragging, the Penrose process.',
  intro:
    'Everything so far used the escape-velocity picture, which gets the right answer for the wrong reason. That is not a criticism: it is how physics is normally taught, and it works right up to the point where it does not. This level is about what is actually going on, because the next levels need it.',
  entries: [
    {
      id: 'geodesics',
      name: 'Geodesics',
      simple:
        'In curved space the straightest path is not straight. Mass curves space, so objects follow the straightest route through that curve.',
      deeper:
        'A {{geodesic}} is a straight line in a flat space and the most nearly straight path in a curved one. This is the whole of general relativity in one substitution: Newton said gravity is a force and objects accelerate towards masses; Einstein said mass curves {{spacetime}} and objects move along geodesics, which in curved space are not straight. Nobody is being pushed. A satellite in orbit is not being pulled in by anything: it is coasting along the straightest line available through a curved space, and that line happens to curve round the Earth. It is the difference between sliding down a hillside and following a contour line. Nothing is pulling you, and you still end up lower.',
      matters:
        'It removes forces from the story of gravity entirely, and it is why gravity can be unified with the other three forces rather than left as an ad-hoc addition bolted onto a Newtonian framework. It also explains why the escape-velocity story stops working: there is no velocity being compared against a threshold, only which directions still lead out.',
      status: 'established',
      source: 'Einstein (1916); the equivalence principle and geodesic motion are standard',
      sourceUrl: 'https://en.wikipedia.org/wiki/Geodesic',
    },
    {
      id: 'proper-time',
      name: 'Proper time',
      simple:
        'Time is not the same for everyone. Two people can agree on an event and still disagree about how long it took to happen.',
      deeper:
        '{{proper time}} is the time measured by a clock that is actually present at the event, and it is the only time in physics that is unambiguously real. Given two events and a path between them, different clocks report different elapsed times, and all of them are correct. This happens for two separate reasons. A clock moving fast runs slow compared with one that is not, and it makes no difference which you call stationary. And a clock deep in a gravitational field runs slow compared with one higher up. The first is special relativity, a decade before general relativity; the second is the part that matters for black holes. Neither is a fault of a cheap clock. It is what a good clock does.',
      matters:
        'It is why "time stops at the event horizon" is wrong and also, in a different way, nearly right. To a distant observer an infalling clock does appear to slow without limit. To the infalling person their clock ticks normally and they cross the horizon in a finite instant of their own time. Both are correct, and reconciling them is what the next entry is for.',
      status: 'established',
      source: 'Minkowski (1908) and Einstein (1916); GPS timing depends on both effects and would drift by kilometres per day without them',
      sourceUrl: 'https://en.wikipedia.org/wiki/Proper_time',
    },
    {
      id: 'light-cones',
      name: 'Light cones',
      simple:
        'A diagram of what can still reach you and what never can, drawn as light spreading out from one moment.',
      deeper:
        'Draw light spreading outwards from a single event and you get a cone, because light is the fastest thing there is and nothing outruns it. Inside that cone, at that moment, is everything that can still influence you. Outside it, nothing ever can. This gives the event horizon exactly, without ever mentioning gravity: a point is inside a black hole when no future light cone starting there can reach the outside world. It also makes the time asymmetry of the subject visible. Nothing inside your cone can ever reach you, which is a statement about the shape of spacetime rather than about anyone trying hard enough, and it is why Level 7\'s problem is a problem rather than a misunderstanding.',
      matters:
        'It gives a definition of the horizon involving no force, no speed threshold and no arithmetic, only the causal structure of spacetime. It is also the reason information cannot escape, which is the physical content underneath Level 7.',
      status: 'established',
      source: 'Standard causal structure of Minkowski and Schwarzschild spacetime',
      sourceUrl: 'https://en.wikipedia.org/wiki/Light_cone',
    },
    {
      id: 'lensing',
      name: 'Gravitational lensing',
      simple:
        'Light bends around mass. Bend it enough and you can see light that came from behind something.',
      deeper:
        'Light passing near a massive object follows a {{geodesic}}, and a geodesic in curved space is not straight, so the light arrives somewhere you would not have predicted. The effect is tiny for ordinary objects and enormous near a black hole. It comes in three kinds. Deflection is the bending itself, and around a black hole light can be bent through any angle, including a full circle back to where it started. Lensing is when one object appears in several places, because light reaches you by several routes. And what produces the EHT images is lensing on a huge scale: light from the accretion disk behind the black hole bent round so far that the far side of the disk appears above and below the shadow.',
      matters:
        'It is why black holes are visible at all, and why the first image is a ring rather than a picture of the thing itself. Lensing has also become a tool in its own right: a distant galaxy behind a foreground mass is magnified and distorted, so lensing is now used to weigh dark matter and to measure distances to stars a telescope cannot otherwise resolve.',
      status: 'established',
      source: 'Deflection measured at the 1919 eclipse; the ring structure in the EHT images follows from bending at the photon sphere',
      sourceUrl: 'https://en.wikipedia.org/wiki/Gravitational_lensing',
    },
    {
      id: 'frame-dragging',
      name: 'Frame dragging',
      simple:
        'A spinning mass drags space around it, so nearby things turn even while holding still.',
      deeper:
        'A rotating body cannot rotate without also rotating the space around it, because {{spacetime}} has no separate "space" and "rotation" to be dragged: the geometry itself carries the rotation. The effect was predicted by Lense and Thirring in 1918 and measured around Earth by Gravity Probe B in 2011, finding the frame-dragging contribution to Earth\'s rotation to be about a fortieth of a percent per year. Near a spinning black hole the effect is enormous. It is not merely that nearby objects orbit: all space is dragged, including objects holding completely still relative to a distant observer. It produces the outer shape of a Kerr black hole, which is flattened like a spinning planet, and it is what makes the {{ergosphere}} possible.',
      matters:
        'It is the first place where relativity says a rotating mass distorts something that is not made of matter, which has no Newtonian equivalent at all. It is also the mechanism behind the Penrose process below, and behind the jets from Level 3: both are powered by rotation.',
      status: 'established',
      source: 'Lense-Thirring (1918); Gravity Probe B measured the effect around Earth, confirming it to about 19 percent in 2011',
      sourceUrl: 'https://en.wikipedia.org/wiki/Frame-dragging',
    },
    {
      id: 'penrose-process',
      name: 'The Penrose process',
      simple:
        'Inside the ergosphere of a spinning black hole, a particle can end up with more energy than it started with. The extra comes out of the black hole.',
      deeper:
        'The {{Penrose process}} is a genuinely odd result. A spacecraft enters the {{ergosphere}} of a rotating black hole and splits in two. One piece falls in. The other piece leaves. Ordinarily the escaping piece has less energy than the two started with. Here, it can have more, because the infalling piece had to co-rotate with the black hole, which costs it rotational energy, and that energy can end up in the escaping piece. Nothing is violated: total energy is conserved, and the black hole has lost mass and spin. In principle this could be a reactionless drive, since the energy comes from the black hole rather than from fuel. In practice the best efficiency available from a single event is about 20 percent, the rest of the energy going into heating the escaping debris, and nobody has worked out a practical spacecraft design. It remains a clean demonstration that general relativity permits extracting energy from a rotating black hole.',
      matters:
        'It turns a black hole from a purely passive object into a reservoir that pays out, if only barely. It is also the cleanest example in the subject of a prediction that follows directly from the geometry and has no Newtonian analogue at all, which is the sort of thing general relativity is judged on.',
      status: 'theoretical',
      source: 'Penrose (1969). The maximum idealised efficiency is about 20.7 percent; no practical extraction scheme has been demonstrated',
      sourceUrl: 'https://en.wikipedia.org/wiki/Penrose_process',
    },
  ],
};

export default LEVEL_5;
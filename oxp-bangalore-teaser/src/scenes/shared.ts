import { Layout } from '../lib/layout';

/** Where Scene 3 types "But this time," (Scene 2's full stop flies here). */
export const teaseType = (L: Layout) => ({ x: L.X(0.0), y: L.Y(0.15), size: L.P(62) });

/** Scene 3's Vidhana Soudha crop; Scene 6 pulls back from exactly here. */
export const teaseMonument = (L: Layout) => {
  const width = L.W * (L.wide ? 1.25 : 2.1);
  return { width, domeX: L.X(L.wide ? 0.7 : 0.66), domeY: L.Y(L.wide ? 0.34 : 0.3), opacity: 0.3 };
};

/** The metro-line route that Scene 5's purple collapses into and Scene 6 rides. */
export const routeLine = (L: Layout) => ({ y: L.Y(L.wide ? 0.5 : 0.415), thickness: L.P(12) });

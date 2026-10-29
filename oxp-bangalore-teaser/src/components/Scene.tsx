import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { SCENES, SceneId, b } from '../config';

/** Renders a scene only inside its window (start - lead .. end + tail). Frames stay absolute. */
export const SceneWindow: React.FC<{ id: SceneId; children: React.ReactNode }> = ({ id, children }) => {
  const f = useCurrentFrame();
  const s = SCENES[id];
  if (f < b(s.start) - s.lead || f > b(s.end) + s.tail) return null;
  return <AbsoluteFill style={{ pointerEvents: 'none' }}>{children}</AbsoluteFill>;
};

/** Absolutely positioned block at (x, y) px. */
export const At: React.FC<{ x: number; y: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ x, y, style, children }) => (
  <div style={{ position: 'absolute', left: x, top: y, ...style }}>{children}</div>
);

/** Clip that hides glyphs pushed below the line (mask reveal), keeps descenders. */
export const lineMask = (size: number): React.CSSProperties => ({
  clipPath: `inset(${-0.45 * size}px ${-0.6 * size}px ${-0.25 * size}px ${-0.6 * size}px)`,
});

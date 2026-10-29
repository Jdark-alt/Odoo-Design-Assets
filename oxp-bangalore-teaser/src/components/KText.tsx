import React from 'react';
import { FONTS } from '../config';
import { measure } from '../lib/fonts';

export type CharInfo = { ch: string; i: number; n: number; word: number; x: number; w: number };
export type CharStyleFn = (c: CharInfo) => React.CSSProperties;

export type KTextProps = {
  text: string;
  size: number;
  weight?: number;
  family?: 'sans' | 'hand';
  color?: string;
  /** letter-spacing in em (display type uses -0.02em) */
  tracking?: number;
  /** per-character style: transforms, opacity, blur... */
  charStyle?: CharStyleFn;
  style?: React.CSSProperties;
  className?: string;
};

const familyOf = (f: 'sans' | 'hand') => (f === 'hand' ? FONTS.hand : FONTS.sans);

/**
 * Lays out characters with the font's own kerning (measured on a canvas) and
 * positions each one absolutely, so every character can move on its own
 * without the word losing its shape.
 */
export const layoutChars = (text: string, size: number, weight: number, family: 'sans' | 'hand', tracking: number) => {
  const fam = familyOf(family);
  const chars = Array.from(text);
  let word = 0;
  const out: CharInfo[] = chars.map((ch, i) => {
    const prefix = chars.slice(0, i).join('');
    const x = measure(prefix, size, weight, fam) + tracking * size * i;
    const w = measure(ch, size, weight, fam);
    if (ch === ' ' && i > 0) word++;
    return { ch, i, n: chars.length, word, x, w };
  });
  const width = measure(text, size, weight, fam) + tracking * size * Math.max(0, chars.length - 1);
  return { chars: out, width, words: word + 1 };
};

export const textWidth = (text: string, size: number, weight = 700, family: 'sans' | 'hand' = 'sans', tracking = 0) =>
  layoutChars(text, size, weight, family, tracking).width;

export const KText: React.FC<KTextProps> = ({ text, size, weight = 700, family = 'sans', color = '#fff', tracking = 0, charStyle, style, className }) => {
  const { chars, width } = layoutChars(text, size, weight, family, tracking);
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        height: size,
        fontFamily: familyOf(family),
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1,
        color,
        whiteSpace: 'pre',
        fontKerning: 'none',
        ...style,
      }}
    >
      {chars.map((c) =>
        c.ch === ' ' ? null : (
          <span
            key={c.i}
            style={{
              position: 'absolute',
              left: c.x,
              top: 0,
              display: 'block',
              transformOrigin: '50% 60%',
              willChange: 'transform',
              ...(charStyle ? charStyle(c) : null),
            }}
          >
            {c.ch}
          </span>
        ),
      )}
    </div>
  );
};

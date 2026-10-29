// ---------------------------------------------------------------------------
// Odoo Experience Bangalore teaser: the one place for tempo, cues, colours,
// fonts and formats. Every animation and the generated music read from here.
//
// To re-sync to a different track: change BPM (and BEAT_OFFSET_FRAMES if the
// first downbeat of the new track is not at 0:00). All cues are in BEATS, so
// the whole video follows. Scene lengths are in beats too.
// ---------------------------------------------------------------------------

export const FPS = 30;
export const BPM = 120;
/** Shift the whole beat grid if the music's first downbeat is late. */
export const BEAT_OFFSET_FRAMES = 0;
export const FRAMES_PER_BEAT = (FPS * 60) / BPM; // 15 at 120 BPM
export const TOTAL_BEATS = 60; // 30 seconds

/** beats -> frames on the grid */
export const b = (beats: number) => Math.round(beats * FRAMES_PER_BEAT) + BEAT_OFFSET_FRAMES;
/** beats -> seconds (for notes and the audio generator) */
export const sec = (beats: number) => (beats * 60) / BPM + BEAT_OFFSET_FRAMES / FPS;

export const DURATION_FRAMES = b(TOTAL_BEATS);

// ---- Scenes (beats, absolute) ---------------------------------------------
// lead/tail: frames a scene may draw before its start / after its end, so one
// line can hand off into the next instead of cutting.
export const SCENES = {
  love: { start: 0, end: 12, lead: 0, tail: 18, title: 'Scene 1 · Love for the event' },
  drop: { start: 12, end: 17, lead: 0, tail: 8, title: 'Scene 2 · The drop' },
  tease: { start: 17, end: 26, lead: 4, tail: 22, title: 'Scene 3 · The tease' },
  reveal: { start: 26, end: 34, lead: 0, tail: 4, title: 'Scene 4 · The reveal' },
  rapid: { start: 34, end: 46, lead: 0, tail: 14, title: 'Scene 5 · Rapid fire' },
  outro: { start: 46, end: 60, lead: 6, tail: 0, title: 'Scene 6 · On tour' },
} as const;
export type SceneId = keyof typeof SCENES;

// ---- Cue sheet (beats, absolute) ------------------------------------------
export const CUES = {
  love: {
    everyYear: 0, // "Every year," punches in, small, off-centre
    india: 2, // "India" lands big; the map starts drawing
    mapDone: 4.5,
    loves: 4, // heart pulse + hearts rising from the map
    lovesPulse2: 5,
    toGather: 6, // pins appear across India...
    converge: 6.5, // ...and converge on Gujarat
    forThe: 8,
    odooExperience: 9, // logo + "Experience." sweeps in
  },
  drop: {
    slowdown: 12, // half a second of deceleration, music thins into a riser
    drop: 13, // "So we are back." takes the frame
    pulses: [14, 15, 16],
    collapse: 16.5, // everything but the full stop collapses away
  },
  tease: {
    butThisTime: 17.5, // types in, small
    hold: 19, // suspense
    something: 21, // "something is different." reveals slowly
    different: 22.5,
    monumentStart: 17, // partial Vidhana Soudha trace (to MONUMENT_TEASE)
    monumentEnd: 26,
  },
  reveal: {
    we: 26,
    are: 26.5,
    bringing: 27,
    the: 28,
    odooExperience: 28.5,
    toYou: 30, // hero: burst + radiating shapes
    monumentGone: 27.5, // partial outline dissolves away
  },
  rapid: {
    items: [34, 35, 36, 37, 38, 39], // Odoo 20 · Live demos · Success stories · Expert sessions · Networking · Community
    and: 40, // tiny, a breath
    so: 41,
    much: 42,
    more: 43, // the biggest moment in the video
    settle: 45,
  },
  outro: {
    onTour: 46, // "The Odoo Experience is on tour."
    nextStop: 50,
    bangalore: 51,
    monumentStart: 50, // full Vidhana Soudha trace
    monumentEnd: 54,
    lockup: 54, // Odoo Experience lockup
    comingSoon: 55,
  },
} as const;

/** How much of the Vidhana Soudha is traced in the Scene 3 tease (0..1). */
export const MONUMENT_TEASE = 0.48;

// ---- Audio cue points ------------------------------------------------------
// The generated placeholder track (scripts/make-music.ts) is built from these.
// When a real track arrives, line these moments up with it (or move the beats
// above to match the track).
export type AudioCue = { beat: number; kind: 'hit' | 'impact' | 'riser' | 'drop' | 'whoosh' | 'dropout' | 'section'; label: string; to?: number };
export const AUDIO_CUES: AudioCue[] = [
  { beat: 0, kind: 'section', label: 'Intro build: kick from the first frame, filter opening', to: 12 },
  { beat: 0, kind: 'hit', label: '"Every year," punch' },
  { beat: 2, kind: 'impact', label: '"India" lands' },
  { beat: 4, kind: 'hit', label: '"loves" heart pulse' },
  { beat: 5, kind: 'hit', label: 'second heart pulse' },
  { beat: 6, kind: 'whoosh', label: '"to gather": pins converge', to: 7.5 },
  { beat: 9, kind: 'impact', label: '"Odoo Experience." sweep' },
  { beat: 10, kind: 'riser', label: 'Riser builds under the last bar', to: 13 },
  { beat: 12, kind: 'dropout', label: 'Slowdown: drums out, music thins (half a second)', to: 13 },
  { beat: 13, kind: 'drop', label: 'THE DROP: "So we are back."' },
  { beat: 16.5, kind: 'whoosh', label: 'Collapse into the tease (downlifter)', to: 17 },
  { beat: 17, kind: 'section', label: 'Tease: low pulse, near silence', to: 26 },
  { beat: 24, kind: 'riser', label: 'Tension riser into the reveal', to: 26 },
  { beat: 26, kind: 'impact', label: 'Energy back: "We are bringing..."' },
  { beat: 28.5, kind: 'hit', label: '"Odoo Experience"' },
  { beat: 29.5, kind: 'dropout', label: 'Half-beat gap before the hero', to: 30 },
  { beat: 30, kind: 'impact', label: '"to you": hero hit, confetti' },
  { beat: 34, kind: 'impact', label: '"Odoo 20"' },
  { beat: 35, kind: 'hit', label: '"Live demos"' },
  { beat: 36, kind: 'hit', label: '"Success stories"' },
  { beat: 37, kind: 'hit', label: '"Expert sessions"' },
  { beat: 38, kind: 'hit', label: '"Networking"' },
  { beat: 39, kind: 'hit', label: '"Community"' },
  { beat: 40, kind: 'dropout', label: '"and": drums out, snare roll riser', to: 41 },
  { beat: 41, kind: 'impact', label: '"So" hit 1' },
  { beat: 42, kind: 'impact', label: '"much" hit 2 (bigger)' },
  { beat: 43, kind: 'drop', label: '"more." hit 3: biggest moment' },
  { beat: 45, kind: 'whoosh', label: 'Downlifter into the outro', to: 46 },
  { beat: 46, kind: 'section', label: 'Outro: confident, softer groove', to: 54 },
  { beat: 51, kind: 'impact', label: '"Bangalore" lands (soft boom)' },
  { beat: 54, kind: 'section', label: 'Resolve: final chord rings out under the lockup', to: 60 },
];

// ---- Camera shake and flashes (beats) --------------------------------------
export const SHAKES: { beat: number; amp: number; frames: number }[] = [
  { beat: 2, amp: 6, frames: 8 },
  { beat: 13, amp: 26, frames: 14 },
  { beat: 26, amp: 8, frames: 8 },
  { beat: 30, amp: 16, frames: 12 },
  { beat: 34, amp: 10, frames: 8 },
  { beat: 41, amp: 14, frames: 9 },
  { beat: 42, amp: 22, frames: 11 },
  { beat: 43, amp: 34, frames: 18 },
];
export const FLASHES: { beat: number; color: 'purple' | 'white'; peak: number; frames: number }[] = [
  { beat: 13, color: 'purple', peak: 1, frames: 9 },
  { beat: 30, color: 'white', peak: 0.35, frames: 6 },
  { beat: 41, color: 'white', peak: 0.3, frames: 5 },
  { beat: 42, color: 'white', peak: 0.45, frames: 6 },
  { beat: 43, color: 'white', peak: 0.8, frames: 8 },
];

// ---- Brand: colours (from the Odoo Experience India design system) --------
export const COLORS = {
  purple: '#714B67', // Primary Purple: main colour of every layout
  green: '#017E84', // Secondary Green: never text on purple
  textBlack: '#21272B',
  logoGray: '#8F8F8F',
  shapeGray: '#F3F4F6',
  red: '#FC787D', // additional: highlights, doodle fills only
  yellow: '#FBB130', // additional: night accent word
  teal: '#00CEB3', // additional
  cyan: '#1BB6F9', // additional
  white: '#FFFFFF',
  night950: '#03060F',
  night900: '#0B1120',
  frame: '#161C2E',
  inkMuted: '#A7AEBD',
} as const;
export type PaletteName = 'yellow' | 'teal' | 'cyan' | 'red' | 'purple' | 'white';

// ---- Brand: fonts ----------------------------------------------------------
// Inter Light / Regular / Bold for everything; Caveat Bold, lowercase, for one
// highlighted word at a time and always with a graphic element.
export const FONTS = {
  sans: 'Inter',
  hand: 'Caveat',
  files: {
    Inter: { file: 'brand/fonts/Inter-Variable.woff2', weight: '100 900' },
    Caveat: { file: 'brand/fonts/Caveat-Variable.woff2', weight: '400 700' },
  },
  weight: { light: 300, regular: 400, bold: 700 },
  displayTracking: '-0.02em',
} as const;

// ---- Formats ---------------------------------------------------------------
// Layouts are authored on a 920 x 1190 design box (the 4:5 safe area) and are
// positioned relatively, so the other formats render from the same scenes.
export const SAFE_PADDING = 80;
export const DESIGN_BOX = { w: 920, h: 1190 };
export const FORMATS = {
  '4x5': { width: 1080, height: 1350 },
  '1x1': { width: 1080, height: 1080 },
  '16x9': { width: 1920, height: 1080 },
} as const;
export type FormatId = keyof typeof FORMATS;

/** Optional end-card details: fill these in when the date or venue is confirmed. */
export const END_CARD = {
  dateLine: '', // e.g. '12 Dec 2026 · 10:00 AM IST'
  detailLine: '', // e.g. 'Register free at odoo.com/india'
};

/** Beats on which the pulli dot grid (the brand's background texture) flashes. */
export const PULLI_BEATS = [0, 1, 14, 15, 16];

// ---------------------------------------------------------------------------
// Odoo Experience Bangalore teaser: the one place for tempo, cues, colours,
// fonts and formats. Every animation and the generated music read from here.
//
// To re-sync to a different track: change BPM (and BEAT_OFFSET_FRAMES if the
// first downbeat of the new track is not at 0:00), or keep the grid and set
// MUSIC.offsetSec. All cues are in BEATS, so the whole video follows.
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
  love: { start: 0, end: 12, lead: 0, tail: 15, title: 'Scene 1 · India loves the Odoo Experience' },
  drop: { start: 12, end: 17, lead: 0, tail: 2, title: 'Scene 2 · So we are back' },
  tease: { start: 17, end: 26, lead: 0, tail: 22, title: 'Scene 3 · The tease' },
  reveal: { start: 26, end: 34, lead: 0, tail: 4, title: 'Scene 4 · The reveal' },
  rapid: { start: 34, end: 44, lead: 0, tail: 6, title: 'Scene 5 · Rapid fire' },
  outro: { start: 44, end: 60, lead: 2, tail: 0, title: 'Scene 6 · On tour' },
} as const;
export type SceneId = keyof typeof SCENES;

// ---- Cue sheet (beats, absolute) ------------------------------------------
export const CUES = {
  love: {
    india: 0, // "India" lands from the first frame; the map starts drawing from Gujarat
    mapDone: 2.5,
    loves: 3, // "loves" in Caveat; hearts rise from cities across the map
    pins: 5, // pins appear across India...
    converge: 6, // ...and gather into a heart over Gujarat
    the: 8,
    odooExperience: 9, // the anchor: logo + "Experience."
    heartbeats: [8, 9, 10, 11],
  },
  drop: {
    push: 11.5, // the camera eases toward the E of "Experience"
    dive: 12.5, // ...then dives into it
    drop: 13, // the E fills the frame; "So we are back." is cut out of its arms
    exit: 16.5, // fly through the E into the dark
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
    odooExperience: 28.5, // the anchor of the line
    to: 29,
    you: 30, // the only highlighted word: pops come out of it
    monumentGone: 27.5, // partial outline dissolves away
  },
  rapid: {
    items: [34, 35, 36, 37, 38, 39], // Odoo 20 · Live demos · Success stories · Expert sessions · Networking · Community
    more: 40, // "And so much more." one line, on the beat
    moreOut: 43.25,
  },
  outro: {
    onTour: 44, // "The Odoo Experience is on tour."
    nextStop: 48,
    bangalore: 49,
    monumentStart: 48, // full Vidhana Soudha trace
    monumentEnd: 52,
    lockup: 52, // Odoo Experience lockup: the anchor
    comingSoon: 55, // smallest, last
  },
} as const;

/** How much of the Vidhana Soudha is traced in the Scene 3 tease (0..1). */
export const MONUMENT_TEASE = 0.48;

// ---- Audio -----------------------------------------------------------------
// Two tracks: a music bed and a sound-effects layer, mixed in the video.
// Drop a generated or licensed track into public/audio/ and point MUSIC at it;
// set offsetSec so the track's first downbeat lands on 0:00 (negative = trim
// the track's start), and volume to sit it under the effects.
export const MUSIC = { file: 'audio/music-placeholder.wav', offsetSec: 0, volume: 0.78 };
export const SFX = { file: 'audio/sfx.wav', volume: 0.9 };

export type AudioCue = { beat: number; kind: 'hit' | 'impact' | 'riser' | 'lift' | 'whoosh' | 'swell' | 'pop' | 'tick' | 'section'; label: string; to?: number };
/** Moments the music should mark, and the effects the SFX track plays. */
export const AUDIO_CUES: AudioCue[] = [
  { beat: 0, kind: 'section', label: 'Intro: friendly groove from the first frame', to: 12 },
  { beat: 0, kind: 'hit', label: '"India" lands (soft thump)' },
  { beat: 3, kind: 'pop', label: '"loves": hearts rise (light pops)' },
  { beat: 5, kind: 'pop', label: 'Pins appear across India' },
  { beat: 6, kind: 'whoosh', label: 'Pins gather into a heart over Gujarat (soft air)', to: 7.3 },
  { beat: 9, kind: 'hit', label: '"Odoo Experience." lands' },
  { beat: 11.5, kind: 'lift', label: 'Music lifts / thins; camera eases in', to: 12.5 },
  { beat: 12.5, kind: 'whoosh', label: 'Dive into the E', to: 13 },
  { beat: 13, kind: 'impact', label: 'DROP: "So we are back." (full groove)' },
  { beat: 16.5, kind: 'whoosh', label: 'Fly through the E into the dark', to: 17 },
  { beat: 17, kind: 'section', label: 'Tease: near silence, a low pulse', to: 26 },
  { beat: 17.5, kind: 'tick', label: 'Soft keystrokes: "But this time,"' },
  { beat: 22.5, kind: 'swell', label: '"different." fades up (soft airy swell, no clicks)', to: 25.5 },
  { beat: 24, kind: 'riser', label: 'Gentle build back in', to: 26 },
  { beat: 26, kind: 'hit', label: 'Groove returns: "We are bringing..."' },
  { beat: 28.5, kind: 'hit', label: '"Odoo Experience"' },
  { beat: 30, kind: 'impact', label: '"you": the hero, confetti sparkle' },
  { beat: 34, kind: 'hit', label: '"Odoo 20"' },
  { beat: 35, kind: 'pop', label: '"Live demos"' },
  { beat: 36, kind: 'pop', label: '"Success stories"' },
  { beat: 37, kind: 'pop', label: '"Expert sessions"' },
  { beat: 38, kind: 'pop', label: '"Networking"' },
  { beat: 39, kind: 'pop', label: '"Community"' },
  { beat: 40, kind: 'hit', label: '"And so much more." (one line)' },
  { beat: 44, kind: 'section', label: 'Outro: warm, lighter groove', to: 52 },
  { beat: 49, kind: 'hit', label: '"Bangalore" lands' },
  { beat: 52, kind: 'section', label: 'Resolve: final chord under the lockup, rings out', to: 60 },
];

// ---- Camera shake and flashes (beats) --------------------------------------
export const SHAKES: { beat: number; amp: number; frames: number }[] = [
  { beat: 13, amp: 6, frames: 8 },
  { beat: 26, amp: 5, frames: 7 },
  { beat: 30, amp: 7, frames: 9 },
  { beat: 34, amp: 6, frames: 7 },
];
export const FLASHES: { beat: number; color: 'purple' | 'white'; peak: number; frames: number }[] = [{ beat: 30, color: 'white', peak: 0.14, frames: 6 }];

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
export const PULLI_BEATS = [0, 1];

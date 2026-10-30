// ---------------------------------------------------------------------------
// Odoo Experience Bangalore teaser: the one place for tempo, cues, colours,
// fonts and formats. Every animation and the generated music read from here.
//
// The music is an edit of "Open Invitation" (120 BPM), cut on bar lines by
// scripts/edit-music.ts from MUSIC_EDIT below. All cues are in BEATS, so the
// picture, the effects and the music edit all follow the same grid.
// ---------------------------------------------------------------------------

export const FPS = 30;
export const BPM = 120;
/** Shift the whole beat grid if the music's first downbeat is late. */
export const BEAT_OFFSET_FRAMES = 0;
export const FRAMES_PER_BEAT = (FPS * 60) / BPM; // 15 at 120 BPM
export const TOTAL_BEATS = 42; // 21 seconds

/** beats -> frames on the grid */
export const b = (beats: number) => Math.round(beats * FRAMES_PER_BEAT) + BEAT_OFFSET_FRAMES;
/** beats -> seconds (for notes and the audio generator) */
export const sec = (beats: number) => (beats * 60) / BPM + BEAT_OFFSET_FRAMES / FPS;

export const DURATION_FRAMES = b(TOTAL_BEATS);

// ---- Scenes (beats, absolute) ---------------------------------------------
// lead/tail: frames a scene may draw before its start / after its end, so one
// line can hand off into the next instead of cutting.
export const SCENES = {
  love: { start: 0, end: 7.5, lead: 0, tail: 8, title: 'Scene 1 · India loves the Odoo Experience' },
  drop: { start: 7.5, end: 12, lead: 0, tail: 1, title: 'Scene 2 · So We Are Back!' },
  tease: { start: 12, end: 18, lead: 0, tail: 14, title: 'Scene 3 · The tease' },
  reveal: { start: 18, end: 24, lead: 0, tail: 3, title: 'Scene 4 · The reveal' },
  rapid: { start: 24, end: 33, lead: 0, tail: 4, title: 'Scene 5 · Rapid fire' },
  outro: { start: 33, end: 42, lead: 1, tail: 0, title: 'Scene 6 · On tour' },
} as const;
export type SceneId = keyof typeof SCENES;

// ---- Cue sheet (beats, absolute) ------------------------------------------
export const CUES = {
  love: {
    india: 0, // "India" lands from the first frame; the map draws itself
    mapDone: 1.6,
    loves: 1, // "loves"; hearts pop up across the map
    pin: 2.5, // a glowing pin drops onto Gujarat
    the: 3,
    odooExperience: 3.5, // the anchor: logo + "Experience."
    pinPulses: [4, 5, 6],
  },
  drop: {
    push: 5.5, // the camera eases toward the bottom stroke of the E
    dive: 6.5, // ...then dives into it
    whiteout: 8, // the white of the E takes over the screen (the drop)
    words: 7.75, // "So We Are Back!" pops up as negative space
    exit: 11, // zoom into the negative space (the B) into Scene 3
  },
  tease: {
    butThisTime: 12.5, // types in, small
    something: 14.5, // "something is different." reveals
    different: 15.25,
    monumentStart: 12, // partial Vidhana Soudha trace (to MONUMENT_TEASE)
    monumentEnd: 18,
  },
  reveal: {
    we: 18,
    are: 18.5,
    bringing: 19,
    the: 19.5,
    odooExperience: 20, // the anchor of the line
    to: 21,
    you: 22, // the only highlighted word, on the chorus drop
    monumentGone: 19,
  },
  rapid: {
    items: [24, 25, 26, 27, 28, 29], // Odoo 20 · Live demos · Success stories · Expert sessions · Networking · Community
    more: 30, // "And so much more!" one line, on the beat
    moreOut: 32.4,
  },
  outro: {
    onTour: 33, // "The Odoo Experience is on tour."
    nextStop: 35,
    bangalore: 35.75,
    monumentStart: 35, // full Vidhana Soudha trace
    monumentEnd: 38,
    lockup: 38, // end card, on the track's last hit
    comingSoon: 39.25, // bottom centre, smallest, last
  },
} as const;

/** How much of the Vidhana Soudha is traced in the Scene 3 tease (0..1). */
export const MONUMENT_TEASE = 0.48;

// ---- Audio -----------------------------------------------------------------
// Two tracks: the music edit and a sound-effects layer, mixed in the video.
export const MUSIC = { file: 'audio/music-edit.wav', offsetSec: 0, volume: 0.85 };
export const SFX = { file: 'audio/sfx.wav', volume: 0.85 };

/**
 * The music edit. The source runs at 120 BPM with its first downbeat at
 * firstDownbeatSec; `from` counts source beats from there. Each segment is
 * placed at video beat `at`, cut on the beat with a short crossfade.
 */
export const MUSIC_SOURCE = { file: 'assets/audio/open-invitation.mp3', bpm: 120, firstDownbeatSec: 1.831 };
export const MUSIC_EDIT: { at: number; from: number; beats: number; note: string }[] = [
  { at: 0, from: 4, beats: 12, note: 'intro, swell, first drop on the whiteout' },
  { at: 12, from: 50, beats: 6, note: 'drumless breakdown under the tease' },
  { at: 18, from: 72, beats: 15, note: 'the stop, then the chorus drop on "you" and the montage' },
  { at: 33, from: 103, beats: 9, note: 'last chorus bar, final hit on the end card, ring-out' },
];

export type AudioCue = { beat: number; kind: 'hit' | 'impact' | 'riser' | 'lift' | 'whoosh' | 'swell' | 'pop' | 'tick' | 'section' | 'cut'; label: string; to?: number };
/** What the music does under the picture, and the effects the SFX track plays. */
export const AUDIO_CUES: AudioCue[] = [
  { beat: 0, kind: 'section', label: 'Music: intro (soft plucks)', to: 4 },
  { beat: 0, kind: 'hit', label: '"India" lands (soft thump)' },
  { beat: 1, kind: 'pop', label: 'Hearts pop up across the map' },
  { beat: 2.5, kind: 'pop', label: 'Glowing pin drops on Gujarat' },
  { beat: 3.5, kind: 'hit', label: '"Odoo Experience." lands' },
  { beat: 4, kind: 'lift', label: 'Music: the swell builds', to: 8 },
  { beat: 6.5, kind: 'whoosh', label: 'Dive into the bottom stroke of the E', to: 8 },
  { beat: 8, kind: 'impact', label: 'Music drop: white takes over, "So We Are Back!"' },
  { beat: 11, kind: 'whoosh', label: 'Zoom into the negative space', to: 12 },
  { beat: 12, kind: 'cut', label: 'Music cut: drumless breakdown', to: 18 },
  { beat: 12.5, kind: 'tick', label: 'Soft keystrokes: "But this time,"' },
  { beat: 15, kind: 'swell', label: '"different." fades up (soft swell)', to: 18 },
  { beat: 18, kind: 'cut', label: 'Music cut: the stop (sustained hit), then a fill' },
  { beat: 22, kind: 'impact', label: 'Music: chorus drop on "you", sparkle' },
  { beat: 24, kind: 'pop', label: 'Montage: a light pop per item', to: 29 },
  { beat: 30, kind: 'hit', label: '"And so much more!"' },
  { beat: 33, kind: 'cut', label: 'Music cut: last chorus bar with its fill' },
  { beat: 35.75, kind: 'hit', label: '"Bangalore" lands' },
  { beat: 38, kind: 'section', label: 'Music: final hit, rings out under the end card', to: 42 },
];

// ---- Camera shake and flashes (beats) --------------------------------------
export const SHAKES: { beat: number; amp: number; frames: number }[] = [
  { beat: 18, amp: 5, frames: 7 },
  { beat: 22, amp: 7, frames: 9 },
  { beat: 24, amp: 5, frames: 6 },
];
export const FLASHES: { beat: number; color: 'purple' | 'white'; peak: number; frames: number }[] = [];

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
export const PULLI_BEATS = [0];

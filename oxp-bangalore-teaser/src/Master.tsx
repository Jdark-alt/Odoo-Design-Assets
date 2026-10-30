import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { CUES, FPS, MUSIC, PULLI_BEATS, SCENES, SFX, b } from './config';
import { FontGate } from './lib/fonts';
import { E, tw } from './lib/motion';
import { Flashes, Grain, Ground, PulliPulse, useShake } from './components/Graphics';
import { useLayout } from './lib/layout';
import { Scene1Love } from './scenes/Scene1Love';
import { Scene2Drop } from './scenes/Scene2Drop';
import { Scene3Tease } from './scenes/Scene3Tease';
import { Scene4Reveal } from './scenes/Scene4Reveal';
import { Scene5RapidFire } from './scenes/Scene5RapidFire';
import { Scene6Outro } from './scenes/Scene6Outro';

/** The night ground darkens for the tease and lifts again on the reveal. */
const useGroundDim = () => {
  const f = useCurrentFrame();
  const inTease = tw(f, b(SCENES.tease.start) - 4, b(SCENES.tease.start) + 20, 0, 0.5, E.inOut);
  const outTease = tw(f, b(CUES.reveal.we) - 2, b(CUES.reveal.we) + 6, 0, 0.5, E.out);
  return Math.max(0, inTease - outTease);
};

const Scenes: React.FC = () => {
  const shake = useShake();
  const L = useLayout();
  return (
    <AbsoluteFill style={{ transform: `translate(${shake.x}px, ${shake.y}px) rotate(${shake.r}deg)` }}>
      <PulliPulse beats={PULLI_BEATS} pitch={L.P(48)} />
      <Scene1Love />
      <Scene2Drop />
      <Scene3Tease />
      <Scene4Reveal />
      <Scene5RapidFire />
      <Scene6Outro />
    </AbsoluteFill>
  );
};

export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dim = useGroundDim();
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: '#0B1120' }}>
      <Ground dim={dim} />
      <FontGate>{children}</FontGate>
      <Flashes />
      <Grain />
    </AbsoluteFill>
  );
};

/** Music bed and sound effects as two tracks (see MUSIC / SFX in config.ts). */
const Soundtrack: React.FC = () => {
  const shift = Math.round(MUSIC.offsetSec * FPS);
  return (
    <>
      {shift >= 0 ? (
        <Sequence from={shift}>
          <Audio src={staticFile(MUSIC.file)} volume={MUSIC.volume} />
        </Sequence>
      ) : (
        <Audio src={staticFile(MUSIC.file)} volume={MUSIC.volume} startFrom={-shift} />
      )}
      <Audio src={staticFile(SFX.file)} volume={SFX.volume} />
    </>
  );
};

export const Master: React.FC<{ music?: boolean }> = ({ music = true }) => (
  <Stage>
    <Scenes />
    {music ? <Soundtrack /> : null}
  </Stage>
);

import React from 'react';
import { Composition, Sequence } from 'remotion';
import { DURATION_FRAMES, FORMATS, FPS, SCENES, SceneId, b } from './config';
import { Master, Stage } from './Master';
import { Scene1Love } from './scenes/Scene1Love';
import { Scene2Drop } from './scenes/Scene2Drop';
import { Scene3Tease } from './scenes/Scene3Tease';
import { Scene4Reveal } from './scenes/Scene4Reveal';
import { Scene5RapidFire } from './scenes/Scene5RapidFire';
import { Scene6Outro } from './scenes/Scene6Outro';

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  love: Scene1Love,
  drop: Scene2Drop,
  tease: Scene3Tease,
  reveal: Scene4Reveal,
  rapid: Scene5RapidFire,
  outro: Scene6Outro,
};

/** One scene on its own: shifted so its frames stay on the master's beat grid. */
const SceneSolo: React.FC<{ id: SceneId }> = ({ id }) => {
  const s = SCENES[id];
  const Comp = SCENE_COMPONENTS[id];
  return (
    <Stage>
      <Sequence from={-(b(s.start) - s.lead)}>
        <Comp />
      </Sequence>
    </Stage>
  );
};

export const RemotionRoot: React.FC = () => (
  <>
    {(Object.keys(FORMATS) as (keyof typeof FORMATS)[]).map((id) => (
      <Composition key={id} id={`Teaser-${id}`} component={Master} durationInFrames={DURATION_FRAMES} fps={FPS} width={FORMATS[id].width} height={FORMATS[id].height} defaultProps={{ music: true }} />
    ))}
    {(Object.keys(SCENES) as SceneId[]).map((id, i) => {
      const s = SCENES[id];
      return (
        <Composition
          key={id}
          id={`Scene${i + 1}-${id}`}
          component={SceneSolo}
          durationInFrames={b(s.end) + s.tail - (b(s.start) - s.lead)}
          fps={FPS}
          width={FORMATS['4x5'].width}
          height={FORMATS['4x5'].height}
          defaultProps={{ id }}
        />
      );
    })}
  </>
);

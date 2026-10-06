import { useEffect, useRef, useState } from 'preact/hooks';
import { animationSvg, play } from './lib/motion';
import motionData from './motion-data.json';

const css =
  '.gl{stroke:#bdbdb9;stroke-width:1.5}.gv{transform-box:fill-box;transform-origin:50% 0}.gh{transform-box:fill-box;transform-origin:0 50%}';
const markup = animationSvg(motionData);

export default function LogoMotion() {
  const stage = useRef<HTMLDivElement>(null);
  const running = useRef<Animation[]>([]);
  const [still, setStill] = useState(false);

  const run = () => {
    const node = stage.current;
    if (!node) return;
    running.current.forEach(animation => animation.cancel());
    running.current = play(node);
  };

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setStill(reduced);
    if (!reduced) run();
    return () => running.current.forEach(animation => animation.cancel());
  }, []);

  return (
    <div class="motion">
      <style>{css}</style>
      <div ref={stage} class="motion__stage" dangerouslySetInnerHTML={{ __html: markup }} />
      {!still && (
        <button type="button" class="motion__replay" onClick={run}>
          Odtwórz jeszcze raz
        </button>
      )}
    </div>
  );
}

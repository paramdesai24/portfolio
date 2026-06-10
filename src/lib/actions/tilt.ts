import type { Action } from 'svelte/action';

interface TiltOptions {
  max?:    number;  // max rotation degrees (default 14)
  speed?:  number;  // transition ms while moving (default 80)
  reset?:  number;  // transition ms on reset (default 450)
  scale?:  number;  // scale on hover (default 1.03)
}

export const tilt: Action<HTMLElement, TiltOptions> = (node, options = {}) => {
  let { max = 14, speed = 80, reset = 450, scale = 1.03 } = options;

  node.style.transformStyle = 'preserve-3d';
  node.style.willChange     = 'transform';

  function onMove(e: PointerEvent) {
    const rect = node.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);

    node.style.transition = `transform ${speed}ms linear`;
    node.style.transform  =
      `rotateX(${-dy * max}deg) rotateY(${dx * max}deg) scale(${scale})`;
  }

  function onLeave() {
    node.style.transition = `transform ${reset}ms cubic-bezier(0.23,1,0.32,1)`;
    node.style.transform  = 'rotateX(0deg) rotateY(0deg) scale(1)';
  }

  node.addEventListener('pointermove', onMove);
  node.addEventListener('pointerleave', onLeave);

  return {
    update(newOptions) {
      ({ max = 14, speed = 80, reset = 450, scale = 1.03 } = newOptions || {});
    },
    destroy() {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
    }
  };
};

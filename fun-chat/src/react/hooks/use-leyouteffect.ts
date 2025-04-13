import { global_object } from '../global';
import { sameArray } from '../helpers';
import type { EffectCallback, EffectHook, FiberNode } from '../types';

export function useLayoutEffect<S>(
  effect: EffectCallback,
  deps: unknown[]
): void {
  const fiberNode: FiberNode<S> = global_object.wipFiber as FiberNode<S>;
  const oldHook = fiberNode.alternate?.hooks?.[
    global_object.hookIndex
  ] as EffectHook;

  const hasChanged = !oldHook || !deps || !sameArray(deps, oldHook.hookDeps);

  const hook: EffectHook = oldHook
    ? { ...oldHook, create: effect, hookDeps: deps, tag: 'layout-effect' }
    : {
        tag: 'layout-effect',
        hookDeps: deps,
        create: effect,
        destroy: undefined,
      };

  if (hasChanged) {
    fiberNode.pendingLayoutEffects ||= [];
    fiberNode.pendingLayoutEffects.push(hook);
  }

  if (!fiberNode.hooks) fiberNode.hooks = [];
  fiberNode.hooks.push(hook);
  global_object.hookIndex += 1;
}

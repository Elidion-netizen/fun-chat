import { global_object } from '../global';
import { sameArray } from '../helpers';
import type { EffectCallback, EffectHook, FiberNode } from '../types';

export function useEffect<S>(effect: EffectCallback, deps: unknown[]): void {
  const fiberNode: FiberNode<S> = global_object.wipFiber as FiberNode<S>;
  const hook: EffectHook = fiberNode?.alternate?.hooks
    ? (fiberNode.alternate.hooks[global_object.hookIndex] as EffectHook)
    : ({
        tag: 'effect',
        hookDeps: deps,
        destroy: undefined,
        create: effect,
      } as unknown as EffectHook);

  if (
    !fiberNode.alternate?.hooks ||
    !deps ||
    (deps && !sameArray(deps, hook.hookDeps))
  ) {
    fiberNode.pendingEffects ||= [];
    fiberNode.pendingEffects.push(hook);
  }

  if (fiberNode.hooks === undefined) {
    fiberNode.hooks = [];
  }

  fiberNode.hooks.push(hook);
  global_object.hookIndex += 1;
}

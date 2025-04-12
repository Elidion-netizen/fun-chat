import { global_object } from '../global';
import { sameArray } from '../helpers';
import type { EffectCallback, EffectHook, FiberNode } from '../types';

const effectHooks: EffectHook[] = [];

const update = (
  hook: EffectHook,
  effect: EffectCallback,
  deps: unknown[]
): void => {
  hook.hookDeps = deps;
  hook.hooksCleanup = effect();
  effectHooks.push(hook);
};

export function useEffect<S>(effect: EffectCallback, deps: unknown[]): void {
  const fiberNode: FiberNode<S> = global_object.wipFiber as FiberNode<S>;
  const hook: EffectHook = fiberNode?.alternate?.hooks
    ? (fiberNode.alternate.hooks[global_object.hookIndex] as EffectHook)
    : ({
        tag: 'effect',
        hookDeps: [],
        hooksCleanup: undefined,
      } as unknown as EffectHook);

  if (
    (fiberNode?.alternate?.hooks && !deps) ||
    (deps && !sameArray(deps, hook.hookDeps))
  ) {
    if (hook.hooksCleanup) {
      hook.hooksCleanup();
    }
    update(hook, effect, deps);
  }

  if (fiberNode.hooks === undefined) {
    fiberNode.hooks = [];
  }

  fiberNode.hooks.push(hook);
  global_object.hookIndex += 1;
}

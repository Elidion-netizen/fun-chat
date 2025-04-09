import { global_object } from '../global';
import { sameArray } from '../helpers';
import type { EffectCallback, EffectHook, FiberNode } from '../types';

const channel = new MessageChannel();
const effectHooks: EffectHook[] = [];

channel.port2.onmessage = (): void => {
  while (effectHooks.length > 0) {
    const hook = effectHooks.shift();
    if (hook) {
      hook.hooksCleanup = hook.hooksCleanup() ?? ((): void => {});
    }
  }
};

const update = (
  hook: EffectHook,
  effect: EffectCallback,
  deps: unknown[]
): void => {
  hook.hookDeps = deps;
  hook.hooksCleanup = effect;
  effectHooks.push(hook);
  channel.port1.postMessage(null);
};

export function useEffect<S>(effect: EffectCallback, deps: unknown[]): void {
  const fiberNode: FiberNode<S> = global_object.wipFiber as FiberNode<S>;
  const hook: EffectHook = fiberNode?.alternate?.hooks
    ? (fiberNode.alternate.hooks[global_object.hookIndex] as EffectHook)
    : ({
        hookDeps: [],
        hooksCleanup: undefined,
      } as unknown as EffectHook);

  if (fiberNode?.alternate?.hooks) {
    if (!deps || (deps && !sameArray(deps, hook.hookDeps))) {
      if (hook.hooksCleanup) {
        hook.hooksCleanup();
      }
      update(hook, effect, deps);
    }
  } else {
    update(hook, effect, deps);
  }

  if (fiberNode.hooks === undefined) {
    fiberNode.hooks = [];
  }

  fiberNode.hooks.push(hook);
  global_object.hookIndex += 1;
}

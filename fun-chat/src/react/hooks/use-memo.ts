import { global_object } from '../global';
import type { FiberNode, MemoHook } from '../types';

export function useMemo<S, T>(factory: () => S, deps: T[]): S {
  const fiberNode: FiberNode<S> = global_object.wipFiber as FiberNode<S>;
  const hook: MemoHook<S> = fiberNode?.alternate?.hooks
    ? (fiberNode.alternate.hooks[global_object.hookIndex] as MemoHook<S>)
    : {
        tag: 'memo',
        value: factory(),
        deps: [],
      };

  const hasChanged =
    !hook.deps || deps.some((dep, i) => !Object.is(dep, hook.deps[i]));

  if (hasChanged) {
    hook.value = factory();
    hook.deps = deps;
  }

  if (fiberNode.hooks === undefined) {
    fiberNode.hooks = [];
  }

  fiberNode.hooks.push(hook);
  global_object.hookIndex += 1;

  return hook.value;
}

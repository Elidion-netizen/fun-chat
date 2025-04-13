import { global_object } from '../global';
import { scheduleUpdate } from '../helpers';
import type { FiberNode, StateHook } from '../types';

export function useState<S>(
  initState: S
): [S, (value: S | ((value: S) => S)) => void] {
  const fiberNode: FiberNode<S> = global_object.wipFiber as FiberNode<S>;
  const hook: StateHook<S> = fiberNode?.alternate?.hooks
    ? (fiberNode.alternate.hooks[global_object.hookIndex] as StateHook<S>)
    : {
        tag: 'state',
        state: initState,
        queue: [],
      };

  while (hook.queue.length > 0) {
    let newState = hook.queue.shift();
    if (isPlainObject(hook.state) && isPlainObject(newState)) {
      newState = { ...hook.state, ...newState };
    }
    hook.state = newState as S;
  }

  if (fiberNode.hooks === undefined) {
    fiberNode.hooks = [];
  }

  fiberNode.hooks.push(hook);
  global_object.hookIndex += 1;

  const setState = (value: S | ((value: S) => S)): void => {
    const newState = transformState(value, hook.state);
    hook.queue.push(newState);

    scheduleUpdate();
  };

  return [hook.state, setState];
}

const isPlainObject = (val: unknown): val is Record<string, unknown> => {
  if (val === null) {
    return false;
  }
  const proto: unknown = Object.getPrototypeOf(val); // TODO error in state
  return (
    Object.prototype.toString.call(val) === '[object Object]' &&
    typeof proto === 'object' &&
    [Object.prototype, null].includes(proto)
  );
};

function transformState<S>(state: S | ((prev: S) => S), prevState: S): S {
  if (typeof state === 'function') {
    return (state as (prev: S) => S)(prevState);
  }
  return state;
}

import { global_object } from '../global';
import { scheduleUpdate } from '../helpers';
import type { FiberNode, ReducerHook } from '../types';

export function useReducer<S, A>(
  reducer: (state: S, action: A) => S,
  initialState: S,
  initialAction?: A
): [S, (action: A) => void] {
  const fiberNode: FiberNode<S> = global_object.wipFiber as FiberNode<S>;
  const hook: ReducerHook<S, A> = fiberNode?.alternate?.hooks
    ? (fiberNode.alternate.hooks[global_object.hookIndex] as ReducerHook<S, A>)
    : {
        tag: 'reducer',
        state: initialAction
          ? reducer(initialState, initialAction)
          : initialState,
        queue: [],
      };

  while (hook.queue.length > 0) {
    const action = hook.queue.shift() as A;
    hook.state = reducer(hook.state, action);
  }

  if (fiberNode.hooks === undefined) {
    fiberNode.hooks = [];
  }

  fiberNode.hooks.push(hook);
  global_object.hookIndex += 1;

  const dispatch = (action: A): void => {
    hook.queue.push(action);

    scheduleUpdate();
  };

  return [hook.state, dispatch];
}

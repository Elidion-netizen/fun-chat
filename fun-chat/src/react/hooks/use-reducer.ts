import { global_object } from '../global';
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

    if (global_object.currentRoot) {
      global_object.wipRoot = {
        type: global_object.currentRoot.type,
        dom: global_object.currentRoot.dom,
        props: global_object.currentRoot.props,
        alternate: global_object.currentRoot,
        context: global_object.context,
      };
      global_object.nextUnitOfWork = global_object.wipRoot;
      global_object.deletions = [];
      global_object.currentRoot = null;
    }
  };

  return [hook.state, dispatch];
}

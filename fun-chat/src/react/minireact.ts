import { commitRoot } from './commit';
import { createDOM, createTextElement, isVirtualElement } from './create-dom';
import { global_object } from './global';
import { reconcileChildren } from './reconsile-dhildren';
import type { ComponentFunction, FiberNode } from './types';

// Support React.Fragment syntax.
export const Fragment = Symbol.for('react.fragment');

// Enhanced requestIdleCallback.
((global: Window): void => {
  const id = 1;
  const fps = 1e3 / 60;
  let frameDeadline: number;
  let pendingCallback: IdleRequestCallback;
  const channel = new MessageChannel();
  const timeRemaining = (): number => frameDeadline - window.performance.now();

  const deadline = {
    didTimeout: false,
    timeRemaining,
  };

  channel.port2.onmessage = (): void => {
    if (typeof pendingCallback === 'function') {
      pendingCallback(deadline);
    }
  };

  global.requestIdleCallback = (callback: IdleRequestCallback): number => {
    global.requestAnimationFrame((frameTime) => {
      frameDeadline = frameTime + fps;
      pendingCallback = callback;
      channel.port1.postMessage(null);
    });
    return id;
  };
})(window);

// Execute each unit task and return to the next unit task.
// Different processing according to the type of fiber node.
const performUnitOfWork = (fiberNode: FiberNode): FiberNode | null => {
  const { type } = fiberNode;
  switch (typeof type) {
    case 'function': {
      global_object.wipFiber = fiberNode;
      global_object.wipFiber.hooks = [];
      global_object.hookIndex = 0;

      const children: ReturnType<ComponentFunction> = type(fiberNode.props);
      reconcileChildren(fiberNode, [
        isVirtualElement(children)
          ? children
          : createTextElement(String(children)),
      ]);
      break;
    }

    case 'number':
    case 'string': {
      if (!fiberNode.dom) {
        fiberNode.dom = createDOM(fiberNode);
      }
      reconcileChildren(fiberNode, fiberNode.props.children);
      break;
    }
    case 'symbol': {
      if (type === Fragment) {
        reconcileChildren(fiberNode, fiberNode.props.children);
      }
      break;
    }
    default: {
      if (fiberNode.props !== undefined) {
        reconcileChildren(fiberNode, fiberNode.props.children);
      }
      break;
    }
  }

  if (fiberNode.child) {
    return fiberNode.child;
  }

  let nextFiberNode: FiberNode | undefined = fiberNode;

  while (nextFiberNode !== undefined) {
    if (nextFiberNode.sibling) {
      return nextFiberNode.sibling;
    }

    nextFiberNode = nextFiberNode.return;
  }

  return null;
};

// Initial or reset.
export const render = (
  element: React.JSX.Element,
  container: Element
): void => {
  global_object.currentRoot = null;
  global_object.wipRoot = {
    type: 'div',
    dom: container,
    props: {
      children: [{ ...element }],
    },
    alternate: global_object.currentRoot,
    context: global_object.context,
  };
  global_object.nextUnitOfWork = global_object.wipRoot;
  global_object.deletions = [];
};

// Use requestIdleCallback to query whether there is currently a unit task
// and determine whether the DOM needs to be updated.
const workLoop: IdleRequestCallback = (deadline) => {
  while (global_object.nextUnitOfWork && deadline.timeRemaining() > 1) {
    global_object.nextUnitOfWork = performUnitOfWork(
      global_object.nextUnitOfWork
    );
  }

  if (!global_object.nextUnitOfWork && global_object.wipRoot) {
    commitRoot();
  }

  window.requestIdleCallback(workLoop);
};

// Start the engine!
void (function main(): void {
  window.requestIdleCallback(workLoop);
})();

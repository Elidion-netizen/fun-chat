import { global_object } from './global';
import { isDefine } from './helpers';
import type { FiberNode, FiberNodeDOM } from './types';
import { updateDOM } from './update-dom';

export const commitDeletion = (
  parentDOM: FiberNodeDOM,
  DOM: NonNullable<FiberNodeDOM>
): void => {
  if (isDefine(parentDOM)) {
    DOM.remove();
  }
};

export const commitReplacement = (
  parentDOM: FiberNodeDOM,
  DOM: NonNullable<FiberNodeDOM>
): void => {
  if (isDefine(parentDOM) && parentDOM instanceof Element) {
    parentDOM.append(DOM);
  }
};

// Change the DOM based on fiber node changes.
// Note that we must complete the comparison of all fiber nodes before commitRoot.
// The comparison of fiber nodes can be interrupted, but the commitRoot cannot be interrupted.
export const commitRoot = (): void => {
  const commitWork = (fiberNode?: FiberNode): void => {
    if (fiberNode) {
      if (fiberNode.dom) {
        const parentFiber = findParentFiber(fiberNode);
        const parentDOM = parentFiber?.dom;

        switch (fiberNode.effectTag) {
          case 'REPLACEMENT': {
            commitReplacement(parentDOM, fiberNode.dom);
            break;
          }
          case 'UPDATE': {
            updateDOM(
              fiberNode.dom,
              fiberNode.alternate ? fiberNode.alternate.props : {},
              fiberNode.props
            );
            break;
          }
          default: {
            break;
          }
        }
      }

      commitWork(fiberNode.child);
      commitWork(fiberNode.sibling);
    }
  };

  for (const deletion of global_object.deletions) {
    if (typeof deletion.type === 'function') {
      const parentFiber = findParentFiber(deletion.child);
      if (deletion.child?.dom) {
        commitDeletion(parentFiber?.dom, deletion.child?.dom);
      }
    }
    if (deletion.dom) {
      const parentFiber = findParentFiber(deletion);
      commitDeletion(parentFiber?.dom, deletion.dom);
    }
  }

  if (global_object.wipRoot !== null) {
    commitWork(global_object.wipRoot.child);
    global_object.currentRoot = global_object.wipRoot;
  }

  global_object.wipRoot = null;
};

const findParentFiber = <S>(
  fiberNode?: FiberNode<S>
): FiberNode<unknown> | null => {
  if (fiberNode) {
    let parentFiber = fiberNode.return;
    while (parentFiber && !parentFiber.dom) {
      parentFiber = parentFiber.return;
    }
    return parentFiber || null;
  }

  return null;
};

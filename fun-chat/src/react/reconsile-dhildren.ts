import { global_object } from './global';
import type { FiberNode, VirtualElement } from './types';

// Reconcile the fiber nodes before and after, compare and record the differences.
export const reconcileChildren = (
  fiberNode: FiberNode,
  elements: VirtualElement[] = []
): void => {
  let index = 0;
  let oldFiberNode: FiberNode | undefined = void 0;
  let prevSibling: FiberNode | undefined = void 0;
  const virtualElements = elements.flat(Infinity);

  if (fiberNode.alternate?.child) {
    oldFiberNode = fiberNode.alternate.child;
  }

  while (index < virtualElements.length || oldFiberNode !== undefined) {
    const virtualElement = virtualElements[index];
    let newFiber: FiberNode | undefined = void 0;

    const isSameType = Boolean(
      oldFiberNode &&
        virtualElement &&
        oldFiberNode.type === virtualElement.type
    );

    // const isSameKey = Boolean(
    //   oldFiberNode &&
    //     virtualElement &&
    //     oldFiberNode.props.key === virtualElement.props.key
    // );

    if (isSameType && oldFiberNode) {
      newFiber = {
        type: oldFiberNode.type,
        dom: oldFiberNode.dom,
        alternate: oldFiberNode,
        props: virtualElement.props,
        return: fiberNode,
        effectTag: 'UPDATE',
        context: global_object.context,
      };
    }
    if (!isSameType && Boolean(virtualElement)) {
      //TODO change boolean logic
      newFiber = {
        type: virtualElement.type,
        dom: null,
        alternate: null,
        props: virtualElement.props,
        return: fiberNode,
        effectTag: 'REPLACEMENT',
        context: global_object.context,
      };
    }
    if (!isSameType && oldFiberNode) {
      global_object.deletions.push(oldFiberNode);
    }

    if (oldFiberNode) {
      oldFiberNode = oldFiberNode.sibling;
    }

    if (index === 0) {
      fiberNode.child = newFiber;
    } else if (prevSibling !== undefined) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index += 1;
  }
};

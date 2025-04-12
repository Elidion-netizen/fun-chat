// Update DOM properties.
// For simplicity, we remove all the previous properties and add next properties.

import type {
  FiberNode,
  FiberNodeDOM,
  VirtualElement,
  VirtualElementType,
} from './types';
import { updateDOM } from './update-dom';
import { isRenderableElement } from './validators';

// Create DOM based on node type.
export const createDOM = (fiberNode: FiberNode): FiberNodeDOM => {
  const { type, props } = fiberNode;
  let DOM: FiberNodeDOM = null;

  if (type === 'TEXT') {
    DOM = document.createTextNode('');
  } else if (typeof type === 'string') {
    DOM = ['svg', 'path', 'g'].includes(type)
      ? document.createElementNS('http://www.w3.org/2000/svg', type)
      : document.createElement(type);
    if (typeof props === 'object' && props.ref) {
      props.ref.current = DOM;
    }
  }

  // Update properties based on props after creation.
  if (DOM !== null) {
    updateDOM(DOM, {}, props);
  }

  return DOM;
};

// Create custom JavaScript data structures.
export const createElement = (
  type: VirtualElementType,
  props: Record<string, unknown> = {},
  ...child: VirtualElement[] | unknown[]
): VirtualElement => {
  const children = child
    .filter((el) => isRenderableElement(el))
    .map((c) => (isVirtualElement(c) ? c : createTextElement(String(c)))); //TODO filter

  return {
    type,
    props: {
      ...props,
      children,
    },
  };
};

// Simple judgment of virtual elements.
export const isVirtualElement = (element: unknown): element is VirtualElement =>
  typeof element === 'object';

// Text elements require special handling.
export const createTextElement = (text: string): VirtualElement => ({
  type: 'TEXT',
  props: {
    nodeValue: text,
  },
});

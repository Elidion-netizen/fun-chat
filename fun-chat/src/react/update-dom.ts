import type { FiberNodeDOM, VirtualElementProps } from './types';

export const updateDOM = (
  DOM: NonNullable<FiberNodeDOM>,
  prevProps: VirtualElementProps,
  nextProps: VirtualElementProps
): void => {
  const defaultPropKeys = 'children';

  for (const [removePropKey, removePropValue] of Object.entries(prevProps)) {
    if (removePropKey.startsWith('on') && isEventListener(removePropValue)) {
      const eventKey = removePropKey.slice(2).toLowerCase();
      if (eventKey === 'change' && DOM.nodeName.toLowerCase() === 'input') {
        DOM.removeEventListener('input', removePropValue);
      } else {
        DOM.removeEventListener(
          removePropKey.slice(2).toLowerCase(),
          removePropValue
        );
      }
    } else if (removePropKey !== defaultPropKeys) {
      Object.assign(DOM, { removePropKey: '' });
    }
  }

  for (const [addPropKey, addPropValue] of Object.entries(nextProps)) {
    if (addPropKey.startsWith('on') && isEventListener(addPropValue)) {
      const eventKey = addPropKey.slice(2).toLowerCase();
      if (eventKey === 'change' && DOM.nodeName.toLowerCase() === 'input') {
        DOM.addEventListener('input', addPropValue);
      } else {
        DOM.addEventListener(addPropKey.slice(2).toLowerCase(), addPropValue);
      }
    } else if (addPropKey !== defaultPropKeys) {
      if (DOM instanceof SVGElement || DOM instanceof SVGPathElement) {
        DOM.setAttribute(addPropKey, String(addPropValue));
      } else if (
        addPropKey === 'style' &&
        typeof addPropValue === 'object' &&
        addPropValue
      ) {
        for (const [name, value] of Object.entries(addPropValue)) {
          if (DOM instanceof HTMLElement) {
            Object.assign(DOM.style, { [name]: String(value) });
          }
        }
      } else {
        Object.assign(DOM, { [addPropKey]: addPropValue });
      }
    }
  }
};

function isEventListener(value: unknown): value is EventListener {
  return typeof value === 'function';
}

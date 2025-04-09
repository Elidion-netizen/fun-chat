import { useState } from './use-state';

export function useRef<T>(initialValue: T | null): {
  current: T | null;
} {
  return useState({ current: initialValue })[0];
}

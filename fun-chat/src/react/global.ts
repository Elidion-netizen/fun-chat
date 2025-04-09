import type { FiberNode } from './types';

interface GlobalObject<T = unknown> {
  wipRoot: FiberNode | null;
  nextUnitOfWork: FiberNode | null;
  currentRoot: FiberNode | null;
  deletions: FiberNode[];
  wipFiber?: FiberNode;
  hookIndex: number;
  context: Map<number, T>;
}
export const global_object: GlobalObject = {
  wipRoot: null,
  nextUnitOfWork: null,
  currentRoot: null,
  deletions: [],
  hookIndex: 0,
  context: new Map(),
};

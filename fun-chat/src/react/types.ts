export interface ComponentFunction {
  (props: Record<string, unknown>): VirtualElement | string;
}
export type VirtualElementType = ComponentFunction | string;

interface RefObject<T> {
  current: T | null;
}

export interface VirtualElementProps {
  [propName: string]: unknown;
  ref?: RefObject<Element>;
  children?: VirtualElement[];
}
export interface VirtualElement {
  type: VirtualElementType;
  props: VirtualElementProps;
}

export type FiberNodeDOM = Element | Text | null | undefined;
export interface FiberNode<S = unknown, A = unknown, T = unknown>
  extends VirtualElement {
  alternate: FiberNode<S> | null;
  dom?: FiberNodeDOM;
  effectTag?: string;
  child?: FiberNode;
  return?: FiberNode;
  sibling?: FiberNode;
  hooks?: (StateHook<S> | EffectHook | ReducerHook<S, A> | MemoHook<A>)[];
  context: Map<number, T>;
  pendingEffects: EffectHook[];
  pendingLayoutEffects: EffectHook[];
}

export type StateHook<S> = {
  tag: HookTag;
  state: S;
  queue: S[];
};

export type EffectHook = {
  tag: HookTag;
  hookDeps: unknown[];
  create: EffectCallback;
  destroy: CleanupFunction | undefined;
};

export type ReducerHook<S, A> = {
  tag: HookTag;
  state: S;
  queue: A[];
};

export type MemoHook<S> = {
  tag: HookTag;
  value: S;
  deps: unknown[];
};

type HookTag = 'effect' | 'state' | 'memo' | 'reducer' | 'layout-effect';

export type EffectCallback = () => CleanupFunction | void;

export type CleanupFunction = () => void;

export interface ContextValue<T> {
  name: number;
  value: T;
}

export interface ContextType<T> {
  _value?: ContextValue<T>;
  _name: number;
  Provider: ({
    value,
    children,
  }: {
    value: T;
    children: React.ReactNode | React.ReactNode[];
  }) => React.ReactNode | React.ReactNode[];
}

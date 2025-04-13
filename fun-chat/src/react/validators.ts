import type { EffectHook, MemoHook, ReducerHook, StateHook } from './types';

export function isEffectHook(
  obj:
    | StateHook<unknown>
    | EffectHook
    | ReducerHook<unknown, unknown>
    | MemoHook<unknown>
): obj is EffectHook {
  return 'tag' in obj && (obj.tag === 'effect' || obj.tag === 'layout-effect');
}

export function isRenderableElement(el: unknown): boolean {
  return !(typeof el === 'boolean' || el === undefined || el === null);
}

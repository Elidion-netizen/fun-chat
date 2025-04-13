import { global_object } from './global';

export const isDefine = <T>(param: T): param is NonNullable<T> =>
  param !== void 0 && param !== null;

export function sameArray(arr1: unknown[], arr2: unknown[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (const [index, value] of arr1.entries()) {
    if (value !== arr2[index]) {
      return false;
    }
  }

  return true;
}
export function scheduleUpdate(): void {
  if (global_object.currentRoot) {
    global_object.wipRoot = {
      type: global_object.currentRoot.type,
      dom: global_object.currentRoot.dom,
      props: global_object.currentRoot.props,
      alternate: global_object.currentRoot,
      context: global_object.context,
      pendingEffects: global_object.currentRoot.pendingEffects || [],
      pendingLayoutEffects:
        global_object.currentRoot.pendingLayoutEffects || [],
    };
    global_object.nextUnitOfWork = global_object.wipRoot;
    global_object.deletions = [];
    global_object.currentRoot = null;
  }
}

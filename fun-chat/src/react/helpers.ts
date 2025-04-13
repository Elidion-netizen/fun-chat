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

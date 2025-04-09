import { global_object } from '../global';
import type { ContextType } from '../types';

export function useContext<S>(context: ContextType<S>): S {
  return global_object.context.get(context._name) as S;
}

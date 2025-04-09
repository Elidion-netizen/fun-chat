import { global_object } from './global';
import type { ContextType } from './types';

export function createContext<T>(defaultValue: T = {} as T): ContextType<T> {
  let name = 0;
  const context: ContextType<T> = {
    _value: { name: ++name, value: defaultValue },
    _name: name,
    Provider: ({ value, children }) => {
      context._value = { name, value: value };
      global_object.context.set(context._value.name, context._value.value);
      return children;
    },
  };
  return context;
}

import type { LoginResponseData } from './types';

export function isUserResponseData(data: unknown): data is LoginResponseData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'type' in data &&
    data.type === 'USER_LOGIN' &&
    'payload' in data &&
    typeof data.payload === 'object' &&
    data.payload !== null &&
    'user' in data.payload &&
    typeof data.payload.user === 'object' &&
    data.payload.user !== null &&
    'isLogined' in data.payload.user &&
    typeof data.payload.user.isLogined === 'boolean'
  );
}

import type { LoginResponse, LoginResponseData, LogoutResponse } from './types';

export function isUserLoginResponse(data: unknown): data is LoginResponse {
  return validUserResponse(data) && data.type === 'USER_LOGIN';
}

export function isUserLogoutResponse(data: unknown): data is LogoutResponse {
  return validUserResponse(data) && data.type === 'USER_LOGOUT';
}

const validUserResponse = (data: unknown): data is LoginResponseData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'type' in data &&
    'payload' in data &&
    typeof data.payload === 'object' &&
    data.payload !== null &&
    'user' in data.payload &&
    typeof data.payload.user === 'object' &&
    data.payload.user !== null &&
    'isLogined' in data.payload.user &&
    typeof data.payload.user.isLogined === 'boolean'
  );
};

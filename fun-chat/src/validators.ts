import type {
  ActiveUsers,
  AllUsers,
  InactiveUsers,
  LoginResponse,
  ResponseData,
  LogoutResponse,
  UserActivate,
} from './types';

export function isUserLoginResponse(data: unknown): data is LoginResponse {
  return (
    validUserResponse(data) &&
    typeof data.id === 'string' &&
    data.type === 'USER_LOGIN'
  );
}

export function isUserLogoutResponse(data: unknown): data is LogoutResponse {
  return (
    validUserResponse(data) &&
    typeof data.id === 'string' &&
    data.type === 'USER_LOGOUT'
  );
}

export function isAuthUsersResponse(data: unknown): data is ActiveUsers {
  return validUsers(data) && data.type === 'USER_ACTIVE';
}

export function isUnauthUsersResponse(data: unknown): data is InactiveUsers {
  return validUsers(data) && data.type === 'USER_INACTIVE';
}

export function isUserActive(data: unknown): data is UserActivate {
  return (
    validUserResponse(data) &&
    data.id === null &&
    data.type === 'USER_EXTERNAL_LOGIN'
  );
}

export function isUserInactive(data: unknown): data is UserActivate {
  return (
    validUserResponse(data) &&
    data.id === null &&
    data.type === 'USER_EXTERNAL_LOGOUT'
  );
}

const validUserResponse = (data: unknown): data is ResponseData => {
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

const validUsers = (data: unknown): data is AllUsers => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'type' in data &&
    'payload' in data &&
    typeof data.payload === 'object' &&
    data.payload !== null &&
    'users' in data.payload &&
    Array.isArray(data.payload.users) &&
    typeof data.payload.users[0] === 'object' &&
    'isLogined' in data.payload.users[0] &&
    'login' in data.payload.users[0]
  );
};

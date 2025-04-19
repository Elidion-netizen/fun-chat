import type {
  AllUsers,
  LoginResponse,
  ResponseData,
  LogoutResponse,
  UserActivate,
  Message,
  AllMessages,
  SingleMessage,
  MessageResponse,
  AuthMessage,
  SocketMessage,
  GetHistoryMessage,
  UserData,
  UpdateMessage,
  EditMessageResponse,
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

export function isAuthUsersResponse(data: unknown): data is AllUsers {
  return (
    validUsers(data) &&
    (data.type === 'USER_ACTIVE' || data.type === 'USER_INACTIVE')
  );
}

export function isActiveUser(data: unknown): data is UserActivate {
  return (
    validUserResponse(data) &&
    data.id === null &&
    (data.type === 'USER_EXTERNAL_LOGIN' ||
      data.type === 'USER_EXTERNAL_LOGOUT')
  );
}

export function isAllMessages(data: unknown): data is AllMessages {
  return (
    validMessageResponse(data) &&
    typeof data.id === 'string' &&
    data.type === 'MSG_FROM_USER' &&
    'messages' in data.payload &&
    Array.isArray(data.payload.messages) &&
    (data.payload.messages.length === 0 ||
      validMessage(data.payload.messages[0]))
  );
}

export function isAuthMessage(data: SocketMessage): data is AuthMessage {
  return (
    data.payload !== null &&
    data.type === 'USER_LOGIN' &&
    'user' in data.payload &&
    typeof data.payload.user === 'object' &&
    data.payload.user !== null &&
    'login' in data.payload.user &&
    'password' in data.payload.user &&
    typeof data.payload.user.login === 'string' &&
    typeof data.payload.user.password === 'string'
  );
}

export function isGetHistoryMessage(
  data: SocketMessage
): data is GetHistoryMessage {
  return (
    data.payload !== null &&
    data.type === 'MSG_FROM_USER' &&
    'user' in data.payload &&
    typeof data.payload.user === 'object' &&
    data.payload.user !== null &&
    'login' in data.payload.user &&
    typeof data.payload.user.login === 'string'
  );
}

export function isMessage(data: unknown): data is SingleMessage {
  return (
    validMessageResponse(data) &&
    data.type === 'MSG_SEND' &&
    'message' in data.payload &&
    validMessage(data.payload.message)
  );
}

export function isUser(user: unknown): user is UserData {
  return (
    typeof user === 'object' &&
    user !== null &&
    'login' in user &&
    'password' in user &&
    typeof user.login === 'string' &&
    typeof user.password === 'string'
  );
}

export const validMessageResponse = (
  data: unknown
): data is MessageResponse => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'type' in data &&
    'payload' in data &&
    typeof data.payload === 'object' &&
    data.payload !== null
  );
};

export const validUpdateMessage = (
  data: MessageResponse
): data is UpdateMessage => {
  return (
    data.payload !== null &&
    'message' in data.payload &&
    typeof data.payload.message === 'object' &&
    data.payload.message !== null
  );
};

export const validEditMessage = (
  data: MessageResponse
): data is EditMessageResponse => {
  return (
    validUpdateMessage(data) &&
    'text' in data.payload.message &&
    typeof data.payload.message.text === 'string' &&
    typeof data.payload.message.status === 'object' &&
    data.payload.message.status !== null &&
    'isEdited' in data.payload.message.status &&
    typeof data.payload.message.status.isEdited === 'boolean'
  );
};

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
    (data.payload.users.length === 0 ||
      (typeof data.payload.users[0] === 'object' &&
        'isLogined' in data.payload.users[0] &&
        'login' in data.payload.users[0]))
  );
};

const validMessage = (data: unknown): data is Message => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'from' in data &&
    typeof data.from === 'string' &&
    'to' in data &&
    typeof data.to === 'string' &&
    'text' in data &&
    typeof data.text === 'string' &&
    'datetime' in data &&
    typeof data.datetime === 'number' &&
    'status' in data &&
    typeof data.status === 'object' &&
    data.status !== null &&
    'isDelivered' in data.status &&
    typeof data.status.isDelivered === 'boolean' &&
    'isReaded' in data.status &&
    typeof data.status.isReaded === 'boolean' &&
    'isEdited' in data.status &&
    typeof data.status.isEdited === 'boolean'
  );
};

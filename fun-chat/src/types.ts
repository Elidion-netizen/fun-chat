export type WebSocketHook = {
  connect: () => void;
  sendMessage: (message: SocketMessage) => void;
  disconnect: () => void;
  isConnected: boolean;
  userData: UserData | null;
  userlist: User[];
};

export type SocketMessage = {
  type: string;
  payload: Record<string, unknown> | null;
};

export type LoginResponse = ResponseData & { id: string; type: 'USER_LOGIN' };

export type LogoutResponse = ResponseData & { id: string; type: 'USER_LOGOUT' };

export type UserActivate = ResponseData & {
  id: null;
  type: 'USER_EXTERNAL_LOGIN';
};

export type UserInactive = ResponseData & {
  id: null;
  type: 'USER_EXTERNAL_LOGOUT';
};

export type User = {
  login: string;
  isLogined: boolean;
};

export type ResponseData = {
  id: string | null;
  type:
    | 'USER_LOGIN'
    | 'USER_LOGOUT'
    | 'USER_EXTERNAL_LOGIN'
    | 'USER_EXTERNAL_LOGOUT';
  payload: {
    user: User;
  };
};

export type LoginResponseError = {
  id: string;
  type: 'ERROR';
  payload: {
    error: string;
  };
};

export type UserData = {
  login: string;
  password: string;
};

export type ActiveUsers = AllUsers & { type: 'USER_ACTIVE' };

export type InactiveUsers = AllUsers & { type: 'USER_INACTIVE' };

export type AllUsers = {
  id: string;
  type: 'USER_ACTIVE' | 'USER_INACTIVE';
  payload: {
    users: User[];
  };
};

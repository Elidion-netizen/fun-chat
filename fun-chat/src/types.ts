export type WebSocketHook = {
  connect: () => void;
  sendMessage: (message: SocketMessage) => void;
  disconnect: () => void;
  isConnected: boolean;
  userData: UserData | null;
};

export type SocketMessage = {
  type: string;
  payload: Record<string, unknown>;
};

export type LoginResponse = LoginResponseData & { type: 'USER_LOGIN' };

export type LogoutResponse = LoginResponseData & { type: 'USER_LOGOUT' };

export type LoginResponseData = {
  id: string;
  type: 'USER_LOGIN' | 'USER_LOGOUT';
  payload: {
    user: {
      login: string;
      isLogined: boolean;
    };
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

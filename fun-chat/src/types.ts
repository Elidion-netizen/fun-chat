export type WebSocketHook = {
  connect: () => void;
  sendMessage: (message: SocketMessage) => void;
  disconnect: () => void;
  isConnected: boolean;
};

export type SocketMessage = {
  type: string;
  payload: Record<string, unknown>;
};

export type LoginResponse = LoginResponseData | LoginResponseError;

export type LoginResponseData = {
  id: string;
  type: 'USER_LOGIN';
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
    error: 'a user with this login is already authorized';
  };
};

export type UserData = {
  login: string;
  password: string;
};

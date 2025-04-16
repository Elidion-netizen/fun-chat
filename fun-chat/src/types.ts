export type WebSocketHook = {
  connect: () => void;
  sendMessage: (message: SocketMessage) => void;
  disconnect: () => void;
  isConnected: boolean;
  currentUser: { current: UserData | null };
  userlist: User[];
  messages: MessageState;
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

export type MessageResponse = {
  id: null;
  type: 'MSG_SEND' | 'MSG_FROM_USER';
  payload: Record<string, unknown>;
};

export type AllMessages = MessageResponse & {
  type: 'MSG_FROM_USER';
  payload: {
    messages: Message[];
  };
};

export type SingleMessage = MessageResponse & {
  type: 'MSG_SEND';
  payload: {
    message: Message;
  };
};

export type MessageState = Record<string, Message[]>;

export type Message = {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
};

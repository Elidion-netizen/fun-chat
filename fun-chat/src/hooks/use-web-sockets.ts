import React from '@/react';
import { navigate } from '@/react/router';
import type {
  MessageState,
  SocketMessage,
  User,
  UserData,
  WebSocketHook,
} from '@/types';
import {
  isAllMessages,
  isAuthUsersResponse,
  isMessage,
  isUnauthUsersResponse,
  isUserActive,
  isUserInactive,
  isUserLoginResponse,
  isUserLogoutResponse,
} from '@/validators';

export function useWebSockets(): WebSocketHook {
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const [userlist, setUserlist] = React.useState<User[]>([]);
  const [messages, setMessages] = React.useState<MessageState>({});
  const socketRef = React.useRef<WebSocket | null>(null);
  const idRef = React.useRef<string | null>(null);
  const talker = React.useRef<User | null>(null);
  const currentUser = React.useRef<UserData | null>(null);

  const connect = React.useCallback(() => {
    if (socketRef.current) return;

    const ws = new WebSocket('ws://localhost:4000');
    let users: User[] = [];

    ws.onopen = (): void => {
      setIsConnected(true);
      socketRef.current = ws;
    };

    ws.onmessage = (message): void => {
      if (typeof message.data !== 'string') return;
      const data: unknown = JSON.parse(message.data);

      if (isUserLoginResponse(data)) {
        const isLog = data.payload.user.isLogined;
        if (isLog) {
          navigate('/chat');
          sendMessage({
            payload: null,
            type: 'USER_ACTIVE',
          });
          sendMessage({
            payload: null,
            type: 'USER_INACTIVE',
          });
        }
      }

      if (isAuthUsersResponse(data)) {
        users.push(...data.payload.users);
        setUserlist(users);
      }

      if (isUnauthUsersResponse(data)) {
        users.push(...data.payload.users);
        setUserlist(users);
      }

      if (isUserActive(data)) {
        setUserlist((pre) => {
          const user = data.payload.user;
          if (!pre.some((el) => el.login === user.login)) {
            return [...pre, user];
          }
          return pre.map((element) =>
            element.login === user.login ? data.payload.user : element
          );
        });
      }

      if (isUserInactive(data)) {
        setUserlist((pre) => {
          const user = data.payload.user;
          if (!pre.some((el) => el.login === user.login)) {
            return [...pre, user];
          }
          return pre.map((element) =>
            element.login === user.login ? data.payload.user : element
          );
        });
      }

      if (isAllMessages(data)) {
        const login = talker.current;
        if (!login) return;
        setMessages((prev) => {
          return { ...prev, [login.login]: data.payload.messages };
        });
      }

      if (isMessage(data)) {
        const user = currentUser.current?.login;
        if (!user) return;
        if (data.payload.message.from === user) {
          setMessages((pre) => {
            return {
              ...pre,
              [data.payload.message.to]: [
                ...pre[data.payload.message.to],
                data.payload.message,
              ],
            };
          });
        } else {
          setMessages((pre) => {
            return {
              ...pre,
              [data.payload.message.from]: [
                ...pre[data.payload.message.from],
                data.payload.message,
              ],
            };
          });
        }
      }

      if (isUserLogoutResponse(data)) {
        const isLog = data.payload.user.isLogined;
        if (!isLog) {
          users = [];
          navigate('/');
          setUserlist([]);
        }
      }
    };

    ws.onclose = (): void => {
      setIsConnected(false);
      socketRef.current = null;
    };

    ws.onerror = (error): void => {
      console.error(error);
    };
  }, []);

  const sendMessage = React.useCallback(
    (message: SocketMessage): void => {
      if (!idRef.current) {
        idRef.current = crypto.randomUUID();
      }
      if (
        message.payload !== null &&
        message.type === 'USER_LOGIN' &&
        message.payload.user &&
        typeof message.payload.user === 'object' &&
        message.payload.user !== null &&
        'login' in message.payload.user &&
        'password' in message.payload.user &&
        typeof message.payload.user.login === 'string' &&
        typeof message.payload.user.password === 'string'
      ) {
        currentUser.current = {
          login: message.payload.user.login,
          password: message.payload.user.password,
        };
      }

      const data = {
        ...message,
        id: idRef.current,
      };

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(JSON.stringify(data));
      } else {
        console.error('WebSocket is not open. Unable to send message.');
      }
    },
    [socketRef.current]
  );

  const disconnect = React.useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  }, [socketRef.current]);

  return {
    connect,
    sendMessage,
    disconnect,
    isConnected,
    currentUser,
    userlist,
    messages,
    talker,
  };
}

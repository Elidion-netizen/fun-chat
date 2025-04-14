import React from '@/react';
import { navigate } from '@/react/router';
import type { SocketMessage, User, UserData, WebSocketHook } from '@/types';
import {
  isAuthUsersResponse,
  isUnauthUsersResponse,
  isUserActive,
  isUserInactive,
  isUserLoginResponse,
  isUserLogoutResponse,
} from '@/validators';

export function useWebSockets(): WebSocketHook {
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [userlist, setUserlist] = React.useState<User[]>([]);
  const socketRef = React.useRef<WebSocket | null>(null);
  const idRef = React.useRef<string | null>(null);

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
  }, [userlist]);

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
        setUserData({
          login: message.payload.user.login,
          password: message.payload.user.password,
        });
      }

      const data = {
        ...message,
        id: idRef.current,
      };

      if (message.type === 'USER_LOGOUT') {
        data.payload = {
          user: {
            login: userData?.login,
            password: userData?.password,
          },
        };
      }

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(JSON.stringify(data));
      } else {
        console.error('WebSocket is not open. Unable to send message.');
      }
    },
    [socketRef.current, userData]
  );

  const disconnect = React.useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  }, [socketRef.current]);

  return { connect, sendMessage, disconnect, isConnected, userData, userlist };
}

import { getUserMessages, getUsersList } from '@/helpers/messages';
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
  isActiveUser,
  isUserLoginResponse,
  isUserLogoutResponse,
  isAuthMessage,
  isGetHistoryMessage,
} from '@/validators';

export function useWebSockets(): WebSocketHook {
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const [userlist, setUserlist] = React.useState<User[]>([]);
  const [messages, setMessages] = React.useState<MessageState>({});
  const socketRef = React.useRef<WebSocket | null>(null);
  const currentUser = React.useRef<UserData | null>(null);
  const usersMap = React.useRef<Map<string, string>>(new Map<string, string>());

  const connect = React.useCallback(() => {
    if (socketRef.current) return;

    const ws = new WebSocket('ws://localhost:4000');

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
          getUsersList(sendMessage);
        } else {
          currentUser.current = null;
        }
      }

      if (isAuthUsersResponse(data)) {
        setUserlist((pre) => [...pre, ...data.payload.users]);
        for (const user of data.payload.users) {
          if (user.login === currentUser.current?.login) {
            continue;
          }
          getUserMessages(sendMessage, user.login);
        }
      }

      if (isUnauthUsersResponse(data)) {
        setUserlist((pre) => [...pre, ...data.payload.users]);
        for (const user of data.payload.users) {
          if (user.login === currentUser.current?.login) {
            continue;
          }
          getUserMessages(sendMessage, user.login);
        }
      }

      if (isActiveUser(data)) {
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
        const login = usersMap.current?.get(data.id);

        usersMap.current?.delete(data.id);

        if (!login) return;
        setMessages((prev) => {
          return { ...prev, [login]: data.payload.messages };
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
                ...(pre[data.payload.message.to] || []),
                data.payload.message,
              ],
            };
          });
        } else {
          setMessages((pre) => {
            return {
              ...pre,
              [data.payload.message.from]: [
                ...(pre[data.payload.message.from] || []),
                data.payload.message,
              ],
            };
          });
        }
      }

      if (isUserLogoutResponse(data)) {
        const isLog = data.payload.user.isLogined;
        if (!isLog) {
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
      const id = crypto.randomUUID();

      if (isAuthMessage(message)) {
        currentUser.current = {
          login: message.payload.user.login,
          password: message.payload.user.password,
        };
      }

      const data = {
        ...message,
        id,
      };

      if (isGetHistoryMessage(message)) {
        usersMap.current?.set(id, message.payload.user.login);
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
  };
}

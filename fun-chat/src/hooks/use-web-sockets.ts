import { messagesReducer } from '@/helpers/reducer';
import { authService } from '@/services/local-storage.service';
import React from '@/react';
import type { SocketMessage, User, UserData, WebSocketHook } from '@/types';
import { isAuthMessage, isGetHistoryMessage } from '@/validators';
import { messageManager } from '@/services/message-manager.service';

export function useWebSockets(): WebSocketHook {
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const [userlist, setUserlist] = React.useState<User[]>([]);
  const [messages, dispatchMessages] = React.useReducer(messagesReducer, {});

  const socketRef = React.useRef<WebSocket | null>(null);
  const currentUserRef = React.useRef<UserData | null>(authService.getUser());
  const pendingMessagesMapRef = React.useRef<Map<string, string>>(
    new Map<string, string>()
  );

  const addUser = (user: User): void => {
    setUserlist((pre) => {
      if (!pre.some((el) => el.login === user.login)) {
        return [...pre, user];
      }
      return pre.map((element) =>
        element.login === user.login ? user : element
      );
    });
  };

  const addUsers = (data: User[]): void => {
    setUserlist((pre) => [...pre, ...data]);
  };

  const clearUsers = (): void => {
    setUserlist([]);
  };

  const connect = React.useCallback(() => {
    if (socketRef.current) return;

    const ws = new WebSocket('ws://localhost:4000');

    ws.onopen = (): void => {
      setIsConnected(true);

      socketRef.current = ws;
      console.log('open');
      if (currentUserRef.current !== null) {
        sendMessage({
          type: 'USER_LOGIN',
          payload: { user: currentUserRef.current },
        });
      }
    };

    ws.onmessage = (message): void => {
      if (typeof message.data !== 'string') return;
      const data: unknown = JSON.parse(message.data);

      messageManager(
        data,
        pendingMessagesMapRef,
        sendMessage,
        currentUserRef,
        dispatchMessages,
        addUser,
        addUsers,
        clearUsers
      );
    };

    ws.onclose = (): void => {
      setIsConnected(false);
      socketRef.current = null;
      clearUsers();
      connect();
    };

    ws.onerror = (error): void => {
      console.error(error);
    };
  }, []);

  const sendMessage = React.useCallback(
    (message: SocketMessage): void => {
      const id = crypto.randomUUID();

      const data = {
        ...message,
        id,
      };

      if (isGetHistoryMessage(message)) {
        pendingMessagesMapRef.current?.set(id, message.payload.user.login);
      }
      if (isAuthMessage(message)) {
        pendingMessagesMapRef.current?.set(
          id,
          JSON.stringify(message.payload.user)
        );
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
      socketRef.current = null;
    }
  }, [socketRef.current]);

  return {
    connect,
    sendMessage,
    disconnect,
    isConnected,
    currentUserRef,
    userlist,
    messages,
  };
}

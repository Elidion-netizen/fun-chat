import React from '@/react';
import { navigate } from '@/react/router';
import type { SocketMessage, UserData, WebSocketHook } from '@/types';
import { isUserLoginResponse, isUserLogoutResponse } from '@/validators';

export function useWebSockets(): WebSocketHook {
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const socketRef = React.useRef<WebSocket | null>(null);
  const idRef = React.useRef<string | null>(null);

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
        }
      }
      if (isUserLogoutResponse(data)) {
        const isLog = data.payload.user.isLogined;
        if (!isLog) {
          navigate('/');
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

  const sendMessage = (message: SocketMessage): void => {
    if (!idRef.current) {
      idRef.current = crypto.randomUUID();
    }
    if (
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

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not open. Unable to send message.');
    }
  };

  const disconnect = React.useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  }, [socketRef.current]);

  return { connect, sendMessage, disconnect, isConnected, userData };
}

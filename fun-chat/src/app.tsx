import React from '@/react';
import { Router } from '@react/router';
import { NotFound } from './pages/not-found-page';
import { Login } from './pages/login-page';
import { ChatPage } from './pages/chat-page';
import { useWebSockets } from './hooks/use-web-sockets';
import type { WebSocketHook } from './types';
import { AuthGuard } from './helpers/auth-guard';

const routes = [
  {
    path: '/',
    guard: (): boolean => !AuthGuard(),
    redirectTo: '/chat',
    component: <Login />,
  },
  {
    path: '/chat',
    guard: (): boolean => AuthGuard(),
    redirectTo: '/',
    component: <ChatPage />,
  },
];

export const Context = React.createContext<WebSocketHook>();
export function App(): React.JSX.Element {
  const {
    connect,
    sendMessage,
    disconnect,
    isConnected,
    currentUserRef,
    userlist,
    messages,
  } = useWebSockets();

  React.useEffect(() => {
    connect();
  }, [connect]);

  return (
    <main className="h-screen relative">
      <Context.Provider
        value={{
          connect,
          sendMessage,
          disconnect,
          isConnected,
          currentUserRef,
          userlist,
          messages,
        }}
      >
        <p
          className={`absolute left-1 bottom-2 z-10 ${isConnected ? 'text-green-500' : 'text-red-500'}`}
        >
          Connection
        </p>
        <Router routes={routes} fallback={<NotFound />} />
      </Context.Provider>
    </main>
  );
}

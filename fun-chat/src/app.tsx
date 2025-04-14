import React from '@/react';
import { Router } from '@react/router';
import { NotFound } from './pages/not-found';
import { Login } from './pages/login';
import { Chat } from './pages/chat';
import { useWebSockets } from './hooks/use-web-sockets';
import type { WebSocketHook } from './types';

const routes = [
  { path: '/', component: <Login /> },
  { path: '/chat', component: <Chat /> },
];

export const Context = React.createContext<WebSocketHook>();
export function App(): React.JSX.Element {
  const { connect, sendMessage, disconnect, isConnected } = useWebSockets();

  React.useEffect(() => {
    connect();
  }, [connect]);

  return (
    <main>
      <Context.Provider
        value={{ connect, sendMessage, disconnect, isConnected }}
      >
        <Router routes={routes} fallback={<NotFound />} />
        <p className={isConnected ? 'text-green-500' : 'text-red-500'}>
          Connection
        </p>
      </Context.Provider>
    </main>
  );
}

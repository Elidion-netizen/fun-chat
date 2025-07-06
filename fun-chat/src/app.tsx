import React from '@/react';
import { routes } from './router/routes';
import { Router } from '@react/router';
import { NotFound } from './pages/not-found-page';
import { useWebSockets } from './hooks/use-web-sockets';
import type { WebSocketHook } from './types';
import { ConnectionLost } from './components/connection-lost';

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
    error,
  } = useWebSockets();

  React.useEffect(() => {
    connect();
  }, [connect]);

  return (
    <main className="h-screen relative max-w-[1280px] mx-auto rounded shadow-xl">
      <Context.Provider
        value={{
          connect,
          sendMessage,
          disconnect,
          isConnected,
          currentUserRef,
          userlist,
          messages,
          error,
        }}
      >
        <p
          className={`hidden md:block absolute left-3 bottom-15 z-10 ${isConnected ? 'text-green-500' : 'text-red-500'}`}
        >
          Conn<span className="hidden md:inline">ection</span>
        </p>
        <Router routes={routes} fallback={<NotFound />} />
      </Context.Provider>
      {!isConnected && <ConnectionLost />}
    </main>
  );
}

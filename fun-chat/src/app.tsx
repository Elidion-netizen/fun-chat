import React from '@/react';
import { Router } from '@react/router';
import { NotFound } from './pages/not-found';
import { Login } from './pages/login';
import { Chat } from './pages/chat';

const routes = [
  { path: '/', component: <Login /> },
  { path: '/chat', component: <Chat /> },
];

export function App(): React.JSX.Element {
  return (
    <main>
      <Router routes={routes} fallback={<NotFound />} />
    </main>
  );
}

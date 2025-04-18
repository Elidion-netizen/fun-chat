import { AuthGuard } from '@/router/auth-guard';
import { ChatPage } from '@/pages/chat-page';
import { Login } from '@/pages/login-page';
import React from '@/react';

export const routes = [
  {
    path: '/',
    redirectTo: '/auth',
  },
  {
    path: '/auth',
    guard: (): boolean => !AuthGuard(),
    redirectTo: '/chat',
    component: <Login />,
  },
  {
    path: '/chat',
    guard: (): boolean => AuthGuard(),
    redirectTo: '/auth',
    component: <ChatPage />,
  },
];

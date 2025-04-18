import React from '@/react';
import { AuthGuard } from '@/router/auth-guard';
import { ChatPage } from '@/pages/chat-page';
import { Login } from '@/pages/login-page';
import { About } from '@/pages/about-page';

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
  {
    path: '/about',
    component: <About />,
  },
];

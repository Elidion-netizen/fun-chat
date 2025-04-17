import type { SocketMessage } from '@/types';

export function getUsersList(
  sendMessage: (message: SocketMessage) => void
): void {
  sendMessage({
    payload: null,
    type: 'USER_ACTIVE',
  });
  sendMessage({
    payload: null,
    type: 'USER_INACTIVE',
  });
}

export function getUserMessages(
  sendMessage: (message: SocketMessage) => void,
  login: string
): void {
  sendMessage({
    type: 'MSG_FROM_USER',
    payload: { user: { login } },
  });
}

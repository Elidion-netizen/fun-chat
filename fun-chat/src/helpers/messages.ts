import type { SocketMessage, User } from '@/types';

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
  users: User[]
): void {
  for (const user of users) {
    sendMessage({
      type: 'MSG_FROM_USER',
      payload: { user: { login: user.login } },
    });
  }
}

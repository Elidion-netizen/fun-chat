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

export function deleteMessage(
  sendMessage: (message: SocketMessage) => void,
  id: string
): void {
  sendMessage({
    type: 'MSG_DELETE',
    payload: {
      message: {
        id,
        status: {
          isDeleted: true,
        },
      },
    },
  });
}

export function sendEditedMessage(
  sendMessage: (message: SocketMessage) => void,
  id: string,
  text: string
): void {
  sendMessage({
    type: 'MSG_EDIT',
    payload: {
      message: {
        id,
        text,
      },
    },
  });
}

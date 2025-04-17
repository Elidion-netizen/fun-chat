import {
  isActiveUser,
  isAllMessages,
  isAuthUsersResponse,
  isMessage,
  isUser,
  isUserLoginResponse,
  isUserLogoutResponse,
  validMessageResponse,
  validUpdateMessage,
} from '@/validators';
import { authService } from './local-storage.service';
import { navigate } from '@/react/router';
import { getUserMessages, getUsersList } from '@/helpers/messages';
import type { MessageAction, SocketMessage, User, UserData } from '@/types';

export function messageManager(
  data: unknown,
  pendingMessagesMapRef: {
    current: Map<string, string> | null;
  },
  sendMessage: (message: SocketMessage) => void,
  currentUserRef: {
    current: UserData | null;
  },
  dispatchMessages: (action: MessageAction) => void,
  addUser: (data: User) => void,
  addUsers: (data: User[]) => void,
  clearUsers: () => void
): void {
  if (!validMessageResponse(data)) {
    return;
  }
  switch (data.type) {
    case 'USER_LOGIN': {
      if (!isUserLoginResponse(data)) return;

      const isLog = data.payload.user.isLogined;
      if (!isLog) return;

      const userDataString = pendingMessagesMapRef.current?.get(data.id);
      if (!userDataString) return;

      const userData: unknown = JSON.parse(userDataString);

      if (!isUser(userData)) return;

      authService.signIn(userData);
      currentUserRef.current = userData;

      pendingMessagesMapRef.current?.delete(data.id);
      navigate('/chat');
      getUsersList(sendMessage);

      break;
    }
    case 'USER_ACTIVE':
    case 'USER_INACTIVE': {
      if (!isAuthUsersResponse(data)) return;

      const users = data.payload.users.filter(
        (user) => user.login !== currentUserRef.current?.login
      );

      addUsers(users);

      getUserMessages(sendMessage, users);
      break;
    }
    case 'USER_EXTERNAL_LOGIN':
    case 'USER_EXTERNAL_LOGOUT': {
      if (!isActiveUser(data)) return;

      addUser(data.payload.user);

      break;
    }
    case 'MSG_FROM_USER': {
      if (!isAllMessages(data)) return;

      const login = pendingMessagesMapRef.current?.get(data.id);

      pendingMessagesMapRef.current?.delete(data.id);
      if (!login) return;

      dispatchMessages({
        type: 'SET_ALL_MESSAGES',
        login,
        messages: data.payload.messages,
      });

      break;
    }
    case 'MSG_SEND': {
      if (!isMessage(data)) return;

      const user = currentUserRef.current?.login;
      if (!user) return;

      if (data.payload.message.from === user) {
        dispatchMessages({
          type: 'ADD_MESSAGE',
          login: data.payload.message.to,
          message: data.payload.message,
        });
      } else {
        dispatchMessages({
          type: 'ADD_MESSAGE',
          login: data.payload.message.from,
          message: data.payload.message,
        });
      }
      break;
    }
    case 'MSG_DELIVER':
    case 'MSG_READ': {
      if (!validUpdateMessage(data)) return;

      dispatchMessages({
        type: 'UPDATE_MESSAGE',
        message: data.payload.message,
      });
      break;
    }
    case 'USER_LOGOUT': {
      if (!isUserLogoutResponse(data)) return;

      const isLog = data.payload.user.isLogined;
      if (!isLog) {
        authService.signOut();
        currentUserRef.current = null;
        navigate('/');
        clearUsers();
      }
      break;
    }
  }
}

import { Context } from '@/app';
import { Chat } from '@/components/chat-room';
import { UserList } from '@/components/list-of-users';
import React from '@/react';
import type { User } from '@/types';
export function ChatPage(): React.JSX.Element {
  const { sendMessage, currentUser, userlist, talker } =
    React.useContext(Context);

  function logout(): void {
    if (!currentUser.current) return;
    sendMessage({
      type: 'USER_LOGOUT',
      payload: { user: currentUser.current },
    });
  }

  function activateChat(user: User): void {
    if (currentUser.current?.login === user.login) return;
    sendMessage({
      type: 'MSG_FROM_USER',
      payload: { user: { login: user.login } },
    });
    talker.current = user;
  }

  return (
    <section className="flex h-full relative">
      <UserList
        currentUser={currentUser.current?.login}
        activateChat={activateChat}
        userlist={userlist}
      />

      <Chat />

      <button className="absolute top-5 right-5" onClick={() => logout()}>
        Logout
      </button>
    </section>
  );
}

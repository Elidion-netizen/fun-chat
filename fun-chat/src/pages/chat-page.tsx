import { Context } from '@/app';
import { Chat } from '@/components/chat-room';
import { UserList } from '@/components/list-of-users';
import React from '@/react';
import type { User } from '@/types';
export function ChatPage(): React.JSX.Element {
  const { sendMessage, currentUser, userlist } = React.useContext(Context);
  const [talker, setTalker] = React.useState<User | null>(null);

  function logout(): void {
    if (!currentUser.current) return;
    sendMessage({
      type: 'USER_LOGOUT',
      payload: { user: currentUser.current },
    });
  }

  function activateChat(user: User): void {
    setTalker(user);
  }

  return (
    <section className="flex h-full relative">
      <UserList
        currentUser={currentUser.current?.login}
        activateChat={activateChat}
        userlist={userlist}
      />

      <Chat talker={talker} />

      <button className="absolute top-5 right-5" onClick={() => logout()}>
        Logout
      </button>
    </section>
  );
}

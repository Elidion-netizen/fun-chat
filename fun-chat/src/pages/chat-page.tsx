import { Context } from '@/app';
import { Chat } from '@/components/chat-room';
import { UserList } from '@/components/list-of-users';
import React from '@/react';
import type { Message, User } from '@/types';
export function ChatPage(): React.JSX.Element {
  const { sendMessage, currentUserRef, userlist, messages } =
    React.useContext(Context);
  const [talker, setTalker] = React.useState<User | null>(null);

  const { filteredMessages, unreadCounts } = React.useMemo(() => {
    const filteredMessages: Record<string, Record<string, Message[]>> = {};
    const unreadCounts: Record<string, number> = {};
    for (const user in messages) {
      const unread: Message[] = [];
      const read: Message[] = [];

      for (const message of messages[user]) {
        if (message.status.isReaded) {
          read.push(message);
        } else {
          unread.push(message);
        }
      }

      filteredMessages[user] = { unread, read };
      unreadCounts[user] = unread.length;
    }
    return { filteredMessages, unreadCounts };
  }, [messages]);
  function logout(): void {
    if (!currentUserRef.current) return;
    sendMessage({
      type: 'USER_LOGOUT',
      payload: { user: currentUserRef.current },
    });
  }

  function activateChat(user: User): void {
    setTalker(user);
  }

  return (
    <section className="flex h-full relative">
      <UserList
        currentUser={currentUserRef.current?.login}
        activateChat={activateChat}
        userlist={userlist}
        unreadCounts={unreadCounts}
      />

      <Chat talker={talker} filteredMessages={filteredMessages} />

      <button className="absolute top-5 right-5" onClick={() => logout()}>
        Logout
      </button>
    </section>
  );
}

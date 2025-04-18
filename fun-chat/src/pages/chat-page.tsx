import { Context } from '@/app';
import { Chat } from '@/components/chat-room';
import { UserList } from '@/components/list-of-users';
import React from '@/react';
import { Link } from '@/react/router/link';
import type { Message, User } from '@/types';

export function ChatPage(): React.JSX.Element {
  const { sendMessage, currentUserRef, userlist, messages } =
    React.useContext(Context);
  const [talker, setTalker] = React.useState<User | null>(null);
  const [autoReadEnabled, setAutoReadEnabled] = React.useState(false);

  function activeateChat(): void {
    setAutoReadEnabled(true);
  }

  const { filteredMessages, unreadCounts } = React.useMemo(() => {
    const filteredMessages: Record<string, Record<string, Message[]>> = {};
    const unreadCounts: Record<string, number> = {};
    for (const user in messages) {
      const unread: Message[] = [];
      const read: Message[] = [];

      for (const message of messages[user]) {
        if (
          message.status.isReaded ||
          message.from === currentUserRef.current?.login
        ) {
          read.push(message);
        } else {
          if (autoReadEnabled && message.from === talker?.login) {
            message.status.isReaded = true;
            sendMessage({
              type: 'MSG_READ',
              payload: {
                message: {
                  id: message.id,
                },
              },
            });
            read.push(message);
          } else {
            unread.push(message);
          }
        }
      }
      if (
        unread.length === 0 &&
        !autoReadEnabled &&
        talker &&
        talker.login === user
      ) {
        activeateChat();
      }

      filteredMessages[user] = { unread, read };
      unreadCounts[user] = unread.length;
    }
    return { filteredMessages, unreadCounts };
  }, [messages, autoReadEnabled, talker]);

  function logout(): void {
    if (!currentUserRef.current) return;
    sendMessage({
      type: 'USER_LOGOUT',
      payload: { user: currentUserRef.current },
    });
  }

  function activateChat(user: User): void {
    setTalker(user);
    setAutoReadEnabled(false);
  }

  return (
    <section className="h-screen">
      <header className="flex justify-between items-center px-5 py-2">
        <p>Current user: {currentUserRef.current?.login}</p>
        <h1>FUN CHAT</h1>
        <div className="flex align-middle">
          <Link to="/about" className="flex items-center">
            About
          </Link>
          <button
            className="ml-3 py-2 px-4 bg-indigo-500 text-white font-bold w-full text-center rounded hover:bg-indigo-600 transition-colors delay-150"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>
      <div className="flex h-[calc(100%-3.5em)]">
        <UserList
          currentUser={currentUserRef.current?.login}
          activateChat={activateChat}
          userlist={userlist}
          unreadCounts={unreadCounts}
        />

        <Chat
          talker={talker}
          activeateChat={activeateChat}
          filteredMessages={filteredMessages}
        />
      </div>
    </section>
  );
}

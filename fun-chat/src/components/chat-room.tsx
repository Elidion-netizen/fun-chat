import { Context } from '@/app';
import React from '@/react';
import { Messages } from './messages';
import type { Message, User } from '@/types';

export function Chat({
  talker,
  filteredMessages,
  activateChatEvent,
}: {
  talker: User | null;
  filteredMessages: Record<string, Record<string, Message[]>>;
  activateChatEvent: () => void;
}): React.JSX.Element {
  const { sendMessage, userlist } = React.useContext(Context);
  const [chatMessage, setChatMessage] = React.useState('');

  React.useEffect(() => {
    setChatMessage('');
  }, [talker]);

  function sendNewMessage(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (chatMessage.length === 0 || talker === null) return;
    activateChatEvent();
    sendMessage({
      type: 'MSG_SEND',
      payload: {
        message: {
          to: talker.login,
          text: chatMessage,
        },
      },
    });
    setChatMessage('');
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {talker && (
        <div className="p-4 bg-blue-100 border-b border-blue-300 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-blue-700">
            Chat with{' '}
            <span
              className={
                userlist.find((el) => el.login === talker.login)?.isLogined
                  ? 'text-green-600'
                  : 'text-gray-400'
              }
            >
              {talker.login}
            </span>
          </h3>
        </div>
      )}

      <Messages
        activateChatEvent={activateChatEvent}
        talker={talker}
        filteredMessages={filteredMessages}
      />

      <form
        onSubmit={sendNewMessage}
        className="p-4 bg-gray-50 border-gray-200 border-t flex"
      >
        <input
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder="Write message..."
          className="flex-1 p-2 border border-gray-300 rounded"
          disabled={!talker}
        />
        <button
          type="submit"
          className="inline-flex ml-4 justify-center p-2 text-blue-600 rounded-full not-disabled:cursor-pointer not-disabled:hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600 rotate-90 transition-colors duration-500 ease-in-out"
          disabled={!talker || chatMessage.length === 0}
        >
          <svg width={24} height={24} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
}

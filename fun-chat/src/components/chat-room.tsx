import { Context } from '@/app';
import React from '@/react';
import { Messages } from './messages';

export function Chat(): React.JSX.Element {
  const { sendMessage, userlist, talker } = React.useContext(Context);
  const [chatMessage, setChatMessage] = React.useState('');

  function sendNewMessage(): void {
    if (chatMessage.length === 0 || talker.current === null) return;
    sendMessage({
      type: 'MSG_SEND',
      payload: {
        message: {
          to: talker.current.login,
          text: chatMessage,
        },
      },
    });
    setChatMessage('');
  }

  return (
    <div className="flex-1 flex flex-col">
      {talker.current && (
        <div className="p-4 bg-blue-100 border-b border-blue-300 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-blue-700">
            Chat with{' '}
            <span
              className={
                userlist.find((el) => el.login === talker.current?.login)
                  ?.isLogined
                  ? 'text-green-600'
                  : 'text-gray-400'
              }
            >
              {talker.current?.login}
            </span>
          </h3>
        </div>
      )}

      <Messages />

      <div className="p-4 bg-gray-200 flex">
        <input
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder="Write message..."
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button
          className="ml-2 p-2 bg-blue-500 text-white rounded"
          onClick={sendNewMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

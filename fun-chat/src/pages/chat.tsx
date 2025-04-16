import { Context } from '@/app';
import { UserList } from '@/components/list-of-users';
import React from '@/react';
import type { User } from '@/types';
export function Chat(): React.JSX.Element {
  const { sendMessage, currentUser, userlist, messages, talker } =
    React.useContext(Context);
  const [chatMessage, setChatMessage] = React.useState('');

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
    <section className="flex h-full relative">
      <UserList
        currentUser={currentUser.current?.login}
        activateChat={activateChat}
        userlist={userlist}
      />

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

        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {talker.current !== null &&
            `${talker.current.login}` in messages &&
            messages[talker.current.login].length > 0 &&
            messages[talker.current.login].map((el) => (
              <div
                key={el.id}
                className={`flex ${
                  el.from === currentUser.current?.login
                    ? 'justify-end'
                    : 'justify-start'
                } mb-4`}
              >
                <div
                  className={`relative max-w-xs rounded-lg px-3 pt-3 pb-6 shadow-md ${
                    el.from === currentUser.current?.login
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {el.from === currentUser.current?.login
                          ? 'You'
                          : el.from}
                      </span>
                      <div className="flex gap-2 items-center">
                        <span
                          className={`text-xs ${
                            el.from === currentUser.current?.login
                              ? 'text-white/70'
                              : 'text-gray-400'
                          }`}
                        >
                          {new Date(el.datetime).toLocaleTimeString()}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          el.status.isDelivered
                            ? el.from === currentUser.current?.login
                              ? 'text-green-300'
                              : 'text-green-600'
                            : el.from === currentUser.current?.login
                              ? 'text-yellow-200'
                              : 'text-yellow-600'
                        }`}
                      >
                        {el.status.isDelivered ? 'Delivered' : 'Sending...'}
                      </span>
                    </div>
                  </div>
                  <p className="break-words pr-8">{el.text}</p>
                  <div className="flex justify-end mt-2 text-xs">
                    <span
                      className={`${
                        el.from === currentUser.current?.login
                          ? 'text-white/70'
                          : 'text-gray-400'
                      }`}
                    >
                      {el.status.isReaded ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>

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

      <button className="absolute top-5 right-5" onClick={() => logout()}>
        Logout
      </button>
    </section>
  );
}

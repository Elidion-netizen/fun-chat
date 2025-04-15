import { Context } from '@/app';
import React from '@/react';
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

  function activateChat(login: string): void {
    if (currentUser.current?.login === login) return;
    sendMessage({ type: 'MSG_FROM_USER', payload: { user: { login } } });
    talker.current = login;
  }

  function sendNewMessage(): void {
    if (chatMessage.length === 0 || talker.current === null) return;
    sendMessage({
      type: 'MSG_SEND',
      payload: {
        message: {
          to: talker.current,
          text: chatMessage,
        },
      },
    });
    setChatMessage('');
  }

  return (
    <section className="flex h-full">
      <div className="w-1/4 bg-gray-200 p-4 border-r">
        <h3 className="font-bold mb-2">List of users</h3>
        <ul>
          {userlist
            .sort((a, b) =>
              a.isLogined === b.isLogined ? 0 : a.isLogined ? -1 : 1
            )
            .filter((el) => el.login !== currentUser.current?.login)
            .map((el) => (
              <li
                className={`cursor-pointer ${el.isLogined ? 'text-green-600' : 'text-gray-400'}`}
                onClick={() => activateChat(el.login)}
              >
                {el.login}
              </li>
            ))}
        </ul>
      </div>
      <div className="flex-1 flex flex-col">
        {talker.current && <h3>Chat with {talker.current}</h3>}
        <div className="flex-1 p-4 overflow-y-auto bg-white">
          {talker.current &&
            `${talker.current}` in messages &&
            messages[talker.current].length > 0 &&
            messages[talker.current].map((el) => (
              <div>
                <p>{el.from}</p>
                <p>{el.to}</p>
                <p>{el.text}</p>
              </div>
            ))}
        </div>

        <div className="p-4 bg-gray-200 flex">
          <input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Введите сообщение..."
            className="flex-1 p-2 border border-gray-300 rounded"
          ></input>
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

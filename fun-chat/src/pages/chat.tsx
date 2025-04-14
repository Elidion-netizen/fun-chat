import { Context } from '@/app';
import React from '@/react';
export function Chat(): React.JSX.Element {
  const { sendMessage, userData, userlist, messages } =
    React.useContext(Context);
  const [chatMessage, setChatMessage] = React.useState('');
  const [talker, setTalker] = React.useState<string | null>(null);

  function logout(): void {
    sendMessage({ type: 'USER_LOGOUT', payload: { user: userData } });
  }

  function activateChat(login: string): void {
    if (userData?.login === login) return;
    sendMessage({ type: 'MSG_FROM_USER', payload: { user: { login } } });
    setTalker(login);
  }

  function sendNewMessage(): void {
    if (chatMessage.length === 0 || talker === null) return;
    sendMessage({
      type: 'MSG_SEND',
      payload: {
        message: {
          to: talker,
          text: chatMessage,
        },
      },
    });
    setChatMessage('');
  }

  return (
    <section>
      <ul>
        {userlist
          .sort((a, b) =>
            a.isLogined === b.isLogined ? 0 : a.isLogined ? -1 : 1
          )
          .map((el) => (
            <li
              className={el.isLogined ? 'text-green-600' : 'text-gray-400'}
              onClick={() => activateChat(el.login)}
            >
              {el.login}
            </li>
          ))}
      </ul>
      <ul>
        {messages.length > 0 &&
          messages.map((el) => (
            <li>
              <p>{el.from}</p>
              <p>{el.to}</p>
              <p>{el.text}</p>
            </li>
          ))}
      </ul>
      <input
        value={chatMessage}
        onChange={(e) => setChatMessage(e.target.value)}
      ></input>
      <button onClick={sendNewMessage}>Send</button>
      <button onClick={() => logout()}>Logout</button>
    </section>
  );
}

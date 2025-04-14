import { Context } from '@/app';
import React from '@/react';
export function Chat(): React.JSX.Element {
  const { sendMessage, userData, userlist } = React.useContext(Context);

  function logout(): void {
    sendMessage({ type: 'USER_LOGOUT', payload: { user: userData } });
  }
  return (
    <section>
      <ul>
        {userlist.map((el) => (
          <li className={el.isLogined ? 'text-green-600' : 'text-gray-400'}>
            {el.login}
          </li>
        ))}
      </ul>
      <button onClick={() => logout()}>Logout</button>
    </section>
  );
}

import { Context } from '@/app';
import React from '@/react';
export function Chat(): React.JSX.Element {
  const { sendMessage, userData } = React.useContext(Context);

  function logout(): void {
    sendMessage({ type: 'USER_LOGOUT', payload: { user: userData } });
  }
  return (
    <section>
      <button onClick={() => logout()}>Logout</button>
    </section>
  );
}

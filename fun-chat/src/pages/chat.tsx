import { Context } from '@/app';
import React from '@/react';
export function Chat(): React.JSX.Element {
  const { sendMessage } = React.useContext(Context);

  function logout(): void {
    sendMessage({ type: 'USER_LOGOUT', payload: {} });
  }
  return (
    <section>
      <button onClick={() => logout()}>Logout</button>
    </section>
  );
}

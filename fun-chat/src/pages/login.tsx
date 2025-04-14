import { Context } from '@/app';
import React from '@/react';

export function Login(): React.JSX.Element {
  const { sendMessage } = React.useContext(Context);

  function login(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const login = formData.get('login') as string;
    const password = formData.get('password') as string;

    const request = {
      type: 'USER_LOGIN',
      payload: {
        user: {
          login,
          password,
        },
      },
    };

    sendMessage(request);
  }
  return (
    <form onSubmit={login}>
      <input type="text" name="login" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}

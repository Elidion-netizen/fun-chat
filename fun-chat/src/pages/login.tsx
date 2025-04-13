import React from '@/react';
import { navigate } from '@/react/router';
export function Login(): React.JSX.Element {
  function login(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    navigate('/chat');
  }
  return (
    <form onSubmit={login}>
      <input></input>
      <input></input>
      <button type="submit">Login</button>
    </form>
  );
}

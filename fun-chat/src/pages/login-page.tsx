import { Context } from '@/app';
import React from '@/react';
import { Link } from '@/react/router/link';

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
    <section className="h-screen flex items-center justify-center bg-gray-100">
      <form
        className="max-w-xl py-6 px-8 h-84 bg-white rounded shadow-xl"
        onSubmit={login}
      >
        <div className="mb-6">
          <label className="block text-gray-800 font-bold" htmlFor="login">
            Login:
          </label>
          <input
            className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
            type="text"
            name="login"
            id="login"
            placeholder="Username"
            minLength={3}
            maxLength={20}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-800 font-bold" htmlFor="password">
            Password:
          </label>
          <input
            className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
            type="password"
            name="password"
            id="password"
            minLength={3}
            maxLength={20}
            placeholder="Password"
            required
          />
        </div>
        <button
          className="py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded hover:bg-indigo-600 transition-colors delay-150"
          type="submit"
        >
          Login
        </button>
        <div className="text-center">
          <Link className="leading-14" to="/about">
            About
          </Link>
        </div>
      </form>
    </section>
  );
}

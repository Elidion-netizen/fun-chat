import React from '@/react';
import type { User } from '@/types';

export function UserList({
  userlist,
  currentUser,
  activateChat,
  unreadCounts,
}: {
  userlist: User[];
  currentUser: string | undefined;
  activateChat: (user: User) => void;
  unreadCounts: Record<string, number>;
}): React.JSX.Element {
  const [filter, setFilter] = React.useState('');

  return (
    <div className="w-1/4 bg-gray-200 p-4 border-r">
      <h3 className="font-bold mb-2">List of users</h3>
      <input
        className="mb-2 p-1 border w-full rounded"
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      ></input>
      <ul className="h-[70%] overflow-y-auto flex-1">
        {userlist
          .sort((a, b) =>
            a.isLogined === b.isLogined ? 0 : a.isLogined ? -1 : 1
          )
          .filter(
            (el) =>
              el.login !== currentUser &&
              (filter === '' ||
                el.login.toLowerCase().includes(filter.toLowerCase()))
          )
          .map((el) => (
            <li
              key={el.login}
              className={`cursor-pointer ${el.isLogined ? 'text-green-600' : 'text-gray-400'}`}
              onClick={() => activateChat(el)}
            >
              <p>
                {el.login}{' '}
                {unreadCounts[el.login] > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-400 text-white text-xs w-5 h-5">
                    {unreadCounts[el.login]}
                  </span>
                )}
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
}

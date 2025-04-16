import React from '@/react';
import type { User } from '@/types';

export function UserList({
  userlist,
  currentUser,
  activateChat,
}: {
  userlist: User[];
  currentUser: string | undefined;
  activateChat: (user: User) => void;
}): React.JSX.Element {
  return (
    <div className="w-1/4 bg-gray-200 p-4 border-r">
      <h3 className="font-bold mb-2">List of users</h3>
      <ul className="h-[90%] overflow-y-auto flex-1">
        {userlist
          .sort((a, b) =>
            a.isLogined === b.isLogined ? 0 : a.isLogined ? -1 : 1
          )
          .filter((el) => el.login !== currentUser)
          .map((el) => (
            <li
              key={el.login}
              className={`cursor-pointer ${el.isLogined ? 'text-green-600' : 'text-gray-400'}`}
              onClick={() => activateChat(el)}
            >
              {el.login}
            </li>
          ))}
      </ul>
    </div>
  );
}

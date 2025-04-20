import React from '@/react';
import type { User } from '@/types';

export function UserList({
  userlist,
  currentUser,
  activateChat,
  unreadCounts,
  showList,
  changeListVisability,
}: {
  userlist: User[];
  currentUser: string | undefined;
  activateChat: (user: User) => void;
  unreadCounts: Record<string, number>;
  showList: boolean;
  changeListVisability: () => void;
}): React.JSX.Element {
  const [filter, setFilter] = React.useState('');

  const allUnreadMessages = React.useMemo(() => {
    return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
  }, [unreadCounts]);

  return (
    <div className="border-b md:border-r border-gray-200 p-4 bg-gray-50 flex flex-col">
      <h3 className="font-bold mb-2 cursor-pointer">List of users:</h3>
      <button className="md:hidden" onClick={changeListVisability}>
        {showList ? 'Hide list' : 'Show list'}{' '}
        {allUnreadMessages > 0 && (
          <span className="ml-2 inline-flex items-center justify-center rounded-full bg-blue-400 text-white text-xs w-5 h-5">
            {allUnreadMessages}
          </span>
        )}
      </button>
      <div className={`${showList ? 'block' : 'hidden'} md:block flex-1`}>
        <input
          className="mb-2 p-1 border w-full rounded"
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        ></input>
        <ul
          className={`h-[70%] overflow-y-auto overflow-x-hidden flex-1 ${showList ? 'block' : 'hidden'} md:block`}
        >
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
                className={`cursor-pointer hover:bg-gray-200/30 px-1 py-0.5 rounded-2xl text-center md:text-start md:px-6 duration-300 ease-in-out ${el.isLogined ? 'text-green-600' : 'text-gray-400'}`}
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
    </div>
  );
}

import { Context } from '@/app';
import React from '@/react';

export function Messages(): React.JSX.Element {
  const { currentUser, messages, talker } = React.useContext(Context);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-white">
      {talker.current !== null &&
        `${talker.current.login}` in messages &&
        messages[talker.current.login].length > 0 &&
        messages[talker.current.login].map((el) => (
          <div
            key={el.id}
            className={`flex ${
              el.from === currentUser.current?.login
                ? 'justify-end'
                : 'justify-start'
            } mb-4`}
          >
            <div
              className={`relative max-w-xs rounded-lg px-3 pt-3 pb-6 shadow-md ${
                el.from === currentUser.current?.login
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black'
              }`}
            >
              <div className="flex items-center justify-between mb-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {el.from === currentUser.current?.login ? 'You' : el.from}
                  </span>
                  <div className="flex gap-2 items-center">
                    <span
                      className={`text-xs ${
                        el.from === currentUser.current?.login
                          ? 'text-white/70'
                          : 'text-gray-400'
                      }`}
                    >
                      {new Date(el.datetime).toLocaleTimeString()}
                    </span>
                  </div>
                  {el.from === currentUser.current?.login && (
                    <span
                      className={`text-xs font-medium ${
                        el.status.isDelivered
                          ? 'text-green-300'
                          : 'text-yellow-200'
                      }`}
                    >
                      {el.status.isDelivered ? 'Delivered' : 'Sending...'}
                    </span>
                  )}
                </div>
              </div>
              <p className="break-words pr-8">{el.text}</p>
              <div className="flex justify-end mt-2 text-xs">
                {el.from === currentUser.current?.login && (
                  <span className="text-white/70">
                    {el.status.isReaded ? 'Read' : 'Unread'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

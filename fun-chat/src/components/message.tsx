import { Context } from '@/app';
import React from '@/react';
import type { Message } from '@/types';

export function MessageElement({
  message,
}: {
  message: Message;
}): React.JSX.Element {
  const { currentUserRef } = React.useContext(Context);

  return (
    <div
      key={message.id}
      className={`flex ${
        message.from === currentUserRef.current?.login
          ? 'justify-end'
          : 'justify-start'
      } mb-4`}
    >
      <div
        className={`relative max-w-xs rounded-lg px-3 pt-3 pb-6 shadow-md ${
          message.from === currentUserRef.current?.login
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-black'
        }`}
      >
        <div className="flex items-center justify-between mb-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {message.from === currentUserRef.current?.login
                ? 'You'
                : message.from}
            </span>
            <div className="flex gap-2 items-center">
              <span
                className={`text-xs ${
                  message.from === currentUserRef.current?.login
                    ? 'text-white/70'
                    : 'text-gray-400'
                }`}
              >
                {new Date(message.datetime).toLocaleTimeString()}
              </span>
            </div>
            {message.from === currentUserRef.current?.login && (
              <span
                className={`text-xs font-medium ${
                  message.status.isDelivered
                    ? 'text-green-300'
                    : 'text-yellow-200'
                }`}
              >
                {message.status.isDelivered ? 'Delivered' : 'Sending...'}
              </span>
            )}
          </div>
        </div>
        <p className="break-words pr-8">{message.text}</p>
        <div className="flex justify-end mt-2 text-xs">
          {message.from === currentUserRef.current?.login && (
            <span className="text-white/70">
              {message.status.isReaded ? 'Read' : 'Unread'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

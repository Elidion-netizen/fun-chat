import React from '@/react';
import type { Message, User } from '@/types';
import { MessageElement } from './message';

export function Messages({
  talker,
  filteredMessages,
}: {
  talker: User | null;
  filteredMessages: Record<string, Record<string, Message[]>>;
}): React.JSX.Element {
  return (
    <div className="flex-1 p-4 overflow-y-auto bg-white">
      {talker !== null && `${talker.login}` in filteredMessages && (
        <>
          <>
            {filteredMessages[talker.login].read.length > 0 &&
              filteredMessages[talker.login].read.map((el) => (
                <MessageElement message={el} />
              ))}
          </>
          <>
            {filteredMessages[talker.login].unread.length > 0 && (
              <div className="relative my-6 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500 text-sm font-medium">
                  New Messages
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
            )}
          </>
          <>
            {filteredMessages[talker.login].unread.length > 0 &&
              filteredMessages[talker.login].unread.map((el) => (
                <MessageElement message={el} />
              ))}
          </>
        </>
      )}
    </div>
  );
}

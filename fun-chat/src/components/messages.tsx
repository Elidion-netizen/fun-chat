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
      {talker !== null &&
        `${talker.login}` in filteredMessages &&
        filteredMessages[talker.login].read.length > 0 &&
        filteredMessages[talker.login].read.map((el) => (
          <MessageElement message={el} />
        ))}
      <br />
      {talker !== null &&
        `${talker.login}` in filteredMessages &&
        filteredMessages[talker.login].unread.length > 0 &&
        filteredMessages[talker.login].unread.map((el) => (
          <MessageElement message={el} />
        ))}
    </div>
  );
}

import React from '@/react';
import type { ControlsProps, Message, User } from '@/types';
import { MessageElement } from './message';

export function Messages({
  talker,
  filteredMessages,
  activateChatEvent,
}: {
  talker: User | null;
  filteredMessages: Record<string, Record<string, Message[]>>;
  activateChatEvent: () => void;
}): React.JSX.Element {
  const separatorRef = React.useRef<HTMLBRElement | null>(null);
  const [hasControls, setHasControls] = React.useState<ControlsProps>({
    id: '',
    status: false,
  });

  React.useEffect(() => {
    if (separatorRef.current) {
      separatorRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [talker, filteredMessages]);

  React.useEffect(() => {
    window.addEventListener('wheel', activateChatEvent, { once: true });
    return (): void => {
      window.removeEventListener('wheel', activateChatEvent);
    };
  }, [activateChatEvent, talker]);

  function changeControlsStatus(status: boolean, id: string = ''): void {
    setHasControls({ id, status });
  }

  return (
    <div
      onClick={activateChatEvent}
      className="flex-1 p-4 overflow-y-auto bg-white"
    >
      {talker !== null && `${talker.login}` in filteredMessages && (
        <>
          <div>
            {filteredMessages[talker.login].read.length > 0 &&
              filteredMessages[talker.login].read.map((el) => (
                <MessageElement
                  message={el}
                  hasControls={hasControls}
                  changeControlsStatus={changeControlsStatus}
                />
              ))}
          </div>
          <br ref={separatorRef}></br>
          <div>
            {filteredMessages[talker.login].unread.length > 0 && (
              <div className="relative my-6 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500 text-sm font-medium">
                  New Messages
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
            )}
          </div>
          <>
            {filteredMessages[talker.login].unread.length > 0 &&
              filteredMessages[talker.login].unread.map((el) => (
                <MessageElement
                  message={el}
                  hasControls={hasControls}
                  changeControlsStatus={changeControlsStatus}
                />
              ))}
          </>
        </>
      )}
    </div>
  );
}

import { Context } from '@/app';
import { deleteMessage, sendEditedMessage } from '@/helpers/messages';
import React from '@/react';
import type { Message, SocketMessage } from '@/types';

export function MessageElement({
  message,
}: {
  message: Message;
}): React.JSX.Element {
  const { currentUserRef, sendMessage } = React.useContext(Context);
  const [hasControls, setHasControls] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [editedMessage, setEditedMessage] = React.useState(message.text);

  function messageMenu(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    name: string
  ): void {
    e.preventDefault();
    if (currentUserRef.current?.login === name) setHasControls((pre) => !pre);
  }

  function confirmEdit(
    sendMessage: (message: SocketMessage) => void,
    id: string,
    editedMessage: string
  ): void {
    sendEditedMessage(sendMessage, id, editedMessage);
    setIsEdit(false);
  }

  function cancelEdit(): void {
    setIsEdit(false);
    setEditedMessage(message.text);
  }

  function deleteEvent(id: string): void {
    setIsEdit(false);
    deleteMessage(sendMessage, id);
  }

  return (
    <div
      key={message.id}
      onContextMenu={(e) => messageMenu(e, message.from)}
      className={`flex ${
        message.from === currentUserRef.current?.login
          ? 'justify-end'
          : 'justify-start'
      } mb-4 relative`}
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
        <div>
          {isEdit ? (
            <div className="relative w-full">
              <label>
                <input
                  className="w-full pr-24 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                ></input>
              </label>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                <button
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  onClick={() =>
                    confirmEdit(sendMessage, message.id, editedMessage)
                  }
                >
                  Confirm
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="break-words pr-8">{message.text}</p>
          )}
        </div>
        <div className="flex justify-end mt-2 text-xs">
          {message.status.isEdited ? (
            <span
              className={
                message.from === currentUserRef.current?.login
                  ? 'text-white/70'
                  : 'text-gray-400'
              }
            >
              Edited
            </span>
          ) : (
            message.from === currentUserRef.current?.login && (
              <span className="text-white/70">
                {message.status.isReaded ? 'Read' : 'Unread'}
              </span>
            )
          )}
        </div>
      </div>
      {!isEdit && hasControls && (
        <div className="absolute -right-2 -bottom-2 flex gap-2">
          <button
            className="text-green-400 bg-blue-300/50 px-2 py-1 rounded hover:bg-blue-400/70 duration-300 ease-in-out"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
          <button
            className="text-red-400 bg-blue-300/50 px-2 py-1 rounded hover:bg-blue-400/70 duration-300 ease-in-out"
            onClick={() => deleteEvent(message.id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

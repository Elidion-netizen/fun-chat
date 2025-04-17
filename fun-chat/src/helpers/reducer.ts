import type { MessageAction, MessageState } from '@/types';

export function messagesReducer(
  state: MessageState,
  action: MessageAction
): MessageState {
  switch (action.type) {
    case 'SET_ALL_MESSAGES': {
      return { ...state, [action.login]: action.messages };
    }
    case 'ADD_MESSAGE': {
      return {
        ...state,
        [action.login]: [...(state[action.login] || []), action.message],
      };
    }
    case 'UPDATE_MESSAGE': {
      const newState = { ...state };
      for (const login in newState) {
        newState[login] = newState[login].map((message) => {
          if (message.id === action.message.id) {
            return {
              ...message,
              status: {
                ...message.status,
                ...action.message.status,
              },
            };
          }
          return message;
        });
      }
      return newState;
    }
    default: {
      return state;
    }
  }
}

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
    default: {
      return state;
    }
  }
}

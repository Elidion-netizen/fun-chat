import type { UserData } from '@/types';
import { isUser } from '@/validators';

export const authService = {
  signIn: (user: UserData): void => {
    sessionStorage.setItem('isAuthenticated', JSON.stringify(user));
  },

  signOut: (): void => {
    sessionStorage.removeItem('isAuthenticated');
  },

  getUser: (): UserData | null => {
    const user = sessionStorage.getItem('isAuthenticated');
    if (!user) {
      return null;
    }
    const data: unknown = JSON.parse(user);
    return isUser(data) ? data : null;
  },
};

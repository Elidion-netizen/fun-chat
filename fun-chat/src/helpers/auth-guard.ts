import { authService } from '../services/local-storage.service';

export function AuthGuard(): boolean {
  return authService.getUser() !== null;
}

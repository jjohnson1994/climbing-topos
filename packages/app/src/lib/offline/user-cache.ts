import type { JwtPayload } from '@/lib/jwt';

const LAST_USER_KEY = 'ct:lastUser';

export function readCachedUser(): JwtPayload | false {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(LAST_USER_KEY);
    return raw ? (JSON.parse(raw) as JwtPayload) : false;
  } catch {
    return false;
  }
}

export function writeCachedUser(user: JwtPayload | false) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      window.localStorage.setItem(LAST_USER_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(LAST_USER_KEY);
    }
  } catch {
    // storage unavailable (private mode, quota) - ignore
  }
}

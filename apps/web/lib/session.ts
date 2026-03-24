import type { AuthSession } from "@aimih/types";

const SESSION_KEY_PREFIX = "aimih-session";

function getSessionKey(role: "candidate") {
  return `${SESSION_KEY_PREFIX}-${role}`;
}

export function readStoredSession(role: "candidate"): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(getSessionKey(role));

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthSession;
  } catch {
    return null;
  }
}

export function storeSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getSessionKey(session.user.role), JSON.stringify(session));
}

export function clearStoredSession(role: "candidate") {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getSessionKey(role));
}

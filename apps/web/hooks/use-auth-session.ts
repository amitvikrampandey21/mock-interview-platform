"use client";

import type { AuthSession } from "@aimih/types";
import { useEffect, useState } from "react";
import { getCurrentSession } from "../lib/api";
import { clearStoredSession, readStoredSession, storeSession } from "../lib/session";

export function useAuthSession(expectedRole: "candidate") {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const saved = readStoredSession(expectedRole);

      if (!saved || saved.user.role !== expectedRole) {
        if (active) {
          setLoading(false);
        }
        return;
      }

      try {
        const verified = await getCurrentSession(saved.token);

        if (!active) {
          return;
        }

        storeSession(verified);
        setSession(verified);
      } catch {
        clearStoredSession(expectedRole);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      active = false;
    };
  }, [expectedRole]);

  function saveSession(nextSession: AuthSession) {
    storeSession(nextSession);
    setSession(nextSession);
  }

  function clearSession() {
    clearStoredSession(expectedRole);
    setSession(null);
  }

  return {
    session,
    loading,
    saveSession,
    clearSession
  };
}

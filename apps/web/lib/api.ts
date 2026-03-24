import type { AuthSession, InterviewBrief, InterviewSession, User } from "@aimih/types";

const API_URL =
  typeof window === "undefined"
    ? (process.env.INTERNAL_API_URL ?? "http://localhost:4000/api")
    : (process.env.NEXT_PUBLIC_API_URL ?? "/api");

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function registerUser(payload: { name: string; email: string; role: "candidate" }) {
  return fetchJson<AuthSession>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getCurrentSession(token: string) {
  return fetchJson<AuthSession>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function startInterview(payload: InterviewBrief, token: string) {
  return fetchJson<InterviewSession>("/interviews", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function getInterviews(token: string) {
  return fetchJson<InterviewSession[]>("/interviews", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function submitInterview(
  interviewId: string,
  answers: Array<{ questionId: string; answer: string }>,
  token: string
) {
  return fetchJson<InterviewSession>(`/interviews/${interviewId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

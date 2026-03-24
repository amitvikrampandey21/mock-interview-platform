"use client";

import type { InterviewBrief, InterviewSession, User } from "@aimih/types";
import { useEffect, useState } from "react";
import { getInterviews, registerUser, startInterview } from "../lib/api";
import { useAuthSession } from "../hooks/use-auth-session";
import { InterviewAnswerForm } from "./interview-answer-form";

const initialBrief: InterviewBrief = {
  roleTitle: "Frontend Developer",
  experienceLevel: "junior",
  interviewType: "mixed",
  difficulty: "medium",
  skills: ["React", "TypeScript", "CSS"],
  focusAreas: ["projects", "problem solving"],
  projects: ["Portfolio website", "Task management app"],
  companyType: "product",
  questionCount: 5
};

export function CandidateWorkspace() {
  const [form, setForm] = useState({
    name: "",
    email: ""
  });
  const [brief, setBrief] = useState<InterviewBrief>(initialBrief);
  const { session: authSession, loading, saveSession, clearSession } = useAuthSession("candidate");
  const token = authSession?.token ?? "";
  const user: User | null = authSession?.user ?? null;
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [status, setStatus] = useState("Create your account and fill the form to start.");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadHistory() {
      if (!token) {
        return;
      }

      try {
        const interviews = await getInterviews(token);

        if (!active) {
          return;
        }

        setHistory(interviews);
        setSession(interviews.find((item) => item.status === "in-progress") ?? null);
        setStatus("Previous interview session loaded.");
      } catch {
        if (active) {
          setStatus("Session loaded, but interview history could not be fetched.");
        }
      }
    }

    void loadHistory();

    return () => {
      active = false;
    };
  }, [token]);

  async function handleRegister() {
    setSubmitting(true);
    setStatus("Creating account...");

    try {
      const result = await registerUser({
        name: form.name,
        email: form.email,
        role: "candidate"
      });

      saveSession(result);
      setStatus("Account created. Now you can generate your interview.");
      const interviews = await getInterviews(result.token);
      setHistory(interviews);
    } catch {
      setStatus("Registration failed. Please check if the API is running.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStartInterview() {
    if (!token) {
      setStatus("Please create an account first.");
      return;
    }

    if (brief.skills.length === 0) {
      setStatus("Please add at least one skill.");
      return;
    }

    setSubmitting(true);
    setStatus("Generating interview questions...");

    try {
      const result = await startInterview(brief, token);
      setSession(result);
      setHistory((current) => [result, ...current.filter((item) => item.status !== "in-progress")]);
      setStatus("Interview started. Questions are ready below.");
    } catch {
      setStatus("Could not start the interview. Make sure the API is running.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleLogout() {
    clearSession();
    setSession(null);
    setHistory([]);
    setStatus("Signed out.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[2rem] border border-black/5 bg-white/70 p-8 shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ember">Interview Access</p>
        <h2 className="mt-4 text-3xl font-semibold">Create account and fill your interview details</h2>
        <div className="mt-4 rounded-3xl bg-cream p-4 text-sm text-stone-700">
          Add your role, skills, experience, focus areas, and projects. Questions will be generated based on the details you enter.
        </div>

        <div className="mt-6 space-y-4">
          <input
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            placeholder="Your name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          <input
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            placeholder="Your email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
        </div>

        <div className="mt-6 rounded-[2rem] border border-black/5 bg-white p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">Interview Details</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              placeholder="Role"
              value={brief.roleTitle}
              onChange={(event) => setBrief((current) => ({ ...current, roleTitle: event.target.value }))}
            />
            <select
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              value={brief.experienceLevel}
              onChange={(event) =>
                setBrief((current) => ({
                  ...current,
                  experienceLevel: event.target.value as InterviewBrief["experienceLevel"]
                }))
              }
            >
              <option value="fresher">Fresher</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
            <select
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              value={brief.interviewType}
              onChange={(event) =>
                setBrief((current) => ({
                  ...current,
                  interviewType: event.target.value as InterviewBrief["interviewType"]
                }))
              }
            >
              <option value="mixed">Mixed</option>
              <option value="technical">Technical</option>
              <option value="hr">HR</option>
              <option value="system-design">System Design</option>
            </select>
            <select
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              value={brief.difficulty}
              onChange={(event) =>
                setBrief((current) => ({
                  ...current,
                  difficulty: event.target.value as InterviewBrief["difficulty"]
                }))
              }
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <input
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              placeholder="Skills: React, Node, SQL"
              value={brief.skills.join(", ")}
              onChange={(event) =>
                setBrief((current) => ({
                  ...current,
                  skills: event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
                }))
              }
            />
            <input
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              placeholder="Focus areas: projects, JavaScript, HR"
              value={brief.focusAreas.join(", ")}
              onChange={(event) =>
                setBrief((current) => ({
                  ...current,
                  focusAreas: event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
                }))
              }
            />
            <input
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              placeholder="Projects: portfolio website, chat app, dashboard"
              value={brief.projects.join(", ")}
              onChange={(event) =>
                setBrief((current) => ({
                  ...current,
                  projects: event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
                }))
              }
            />
            <select
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              value={brief.companyType}
              onChange={(event) =>
                setBrief((current) => ({
                  ...current,
                  companyType: event.target.value as InterviewBrief["companyType"]
                }))
              }
            >
              <option value="startup">Startup</option>
              <option value="product">Product</option>
              <option value="service">Service</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <select
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              value={String(brief.questionCount)}
              onChange={(event) =>
                setBrief((current) => ({
                  ...current,
                  questionCount: Number(event.target.value)
                }))
              }
            >
              <option value="3">3 questions</option>
              <option value="5">5 questions</option>
              <option value="7">7 questions</option>
              <option value="10">10 questions</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleRegister}
            disabled={submitting}
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={handleStartInterview}
            disabled={submitting}
            className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60"
          >
            Generate Interview
          </button>
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-stone-600"
            >
              Sign Out
            </button>
          ) : null}
        </div>
        <p className="mt-4 text-sm text-stone-600">{loading ? "Restoring candidate session..." : status}</p>
        {user ? (
          <div className="mt-6 rounded-3xl bg-cream p-5">
            <p className="text-sm text-stone-500">Signed in as</p>
            <p className="mt-1 text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-stone-600">{user.email}</p>
          </div>
        ) : null}
      </section>

      <section className="space-y-6">
        <div className="rounded-[2rem] bg-ink p-8 text-white shadow-card">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">Live Session</p>
          {session ? (
            <div>
              <h3 className="mt-4 text-3xl font-semibold">{session.roleTitle}</h3>
              {session.brief ? (
                <div className="mt-4 rounded-3xl bg-white/10 p-5 text-sm text-white/80">
                  {session.brief.experienceLevel} . {session.brief.interviewType} . {session.brief.difficulty} .{" "}
                  {session.brief.companyType} . {session.brief.questionCount} questions
                </div>
              ) : null}
              <div className="mt-6 space-y-4">
                {session.questions.map((question, index) => (
                  <div key={question.id} className="rounded-3xl bg-white/10 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                      Question {index + 1} . {question.category} . {question.difficulty}
                    </p>
                    <p className="mt-2 text-base leading-7">{question.prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="mt-4 text-3xl font-semibold">No active interview yet</h3>
              <p className="mt-4 text-white/80">
            Fill the details on the left and generate a new interview.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-8 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ember">Interview History</p>
          <div className="mt-5 space-y-4">
            {history.length > 0 ? (
              history.map((item) => (
                <div key={item.id} className="rounded-3xl border border-black/5 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold">{item.roleTitle}</p>
                      <p className="text-sm text-stone-500">{item.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-stone-500">Score</p>
                      <p className="text-xl font-semibold">{item.feedback?.score ?? "--"}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-stone-600">
                    {item.feedback?.summary ?? "Interview is ready. Submit your answers when done."}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-stone-600">Your interview history will appear here.</p>
            )}
          </div>
        </div>

        <InterviewAnswerForm
          session={session}
          token={token}
          onSubmitted={(submittedSession) => {
            setSession(null);
            setHistory((current) =>
              [submittedSession, ...current.filter((item) => item.id !== submittedSession.id)]
            );
            setStatus("Interview completed. You can check it in your history.");
          }}
        />
      </section>
    </div>
  );
}

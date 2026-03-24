"use client";

import type { InterviewSession } from "@aimih/types";
import { useEffect, useState } from "react";
import { useVoiceInterview } from "../hooks/use-voice-interview";
import { submitInterview } from "../lib/api";

export function InterviewAnswerForm({
  session,
  token,
  onSubmitted
}: {
  session: InterviewSession | null;
  token: string;
  onSubmitted?: (session: InterviewSession) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<InterviewSession | null>(null);
  const [status, setStatus] = useState("Answer submission is ready when a session is active.");
  const [submitting, setSubmitting] = useState(false);
  const [inputMode, setInputMode] = useState<"text" | "voice">("text");
  const {
    supported,
    listeningQuestionId,
    interimTranscript,
    voiceStatus,
    readQuestion,
    startListening,
    stopListening
  } = useVoiceInterview();
  const activeSessionId = session?.id ?? null;

  useEffect(() => {
    if (!activeSessionId) {
      return;
    }

    setAnswers({});
    setResult(null);
    setStatus("Fresh interview loaded. Record or type your answers.");
    stopListening();
  }, [activeSessionId, stopListening]);

  if (!session) {
    return null;
  }

  const activeSession = session;

  async function handleSubmit() {
    if (!token) {
      setStatus("Candidate token missing. Register first.");
      return;
    }

    setSubmitting(true);
    setStatus("Submitting answers for AI evaluation...");

    try {
      const payload = activeSession.questions.map((question) => ({
        questionId: question.id,
        answer: answers[question.id] ?? ""
      }));

      const evaluated = await submitInterview(activeSession.id, payload, token);
      setResult(evaluated);
      onSubmitted?.(evaluated);
      setStatus("Interview submitted. Feedback generated successfully.");
    } catch {
      setStatus("Submission failed. Ensure the API is running.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-black/5 bg-white/70 p-8 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ember">Answer Questions</p>
        <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white p-1">
          <button
            type="button"
            onClick={() => setInputMode("text")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              inputMode === "text" ? "bg-ink text-white" : "text-stone-600"
            }`}
          >
            Text Mode
          </button>
          <button
            type="button"
            onClick={() => setInputMode("voice")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              inputMode === "voice" ? "bg-forest text-white" : "text-stone-600"
            }`}
          >
            Voice Mode
          </button>
        </div>
      </div>
      <div className="mt-4 rounded-3xl bg-cream p-5 text-sm text-stone-700">
        <p className="font-semibold text-ink">Interview input mode</p>
        <p className="mt-2">
          {inputMode === "voice"
            ? supported
              ? "Use the mic button to speak your answer. Your speech will be converted into text and saved in the answer box."
              : "Your browser does not expose speech recognition here, so switch to text mode or open the app in Chrome/Edge."
            : "Type answers manually, then submit the interview for feedback."}
        </p>
        {inputMode === "voice" ? <p className="mt-2 text-stone-600">{voiceStatus}</p> : null}
      </div>
      <div className="mt-6 space-y-5">
        {activeSession.questions.map((question, index) => (
          <div key={question.id} className="rounded-3xl border border-black/5 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Question {index + 1}</p>
                <p className="mt-2 text-base font-medium">{question.prompt}</p>
              </div>
              {inputMode === "voice" ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => readQuestion(question.prompt)}
                    className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-stone-700"
                  >
                    Read Aloud
                  </button>
                  {listeningQuestionId === question.id ? (
                    <button
                      type="button"
                      onClick={stopListening}
                      className="rounded-full bg-ember px-4 py-2 text-sm font-semibold text-white"
                    >
                      Stop Mic
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        startListening(question.id, answers[question.id] ?? "", (value) =>
                          setAnswers((current) => ({
                            ...current,
                            [question.id]: value
                          }))
                        )
                      }
                      disabled={!supported}
                      className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      Start Mic
                    </button>
                  )}
                </div>
              ) : null}
            </div>
            <textarea
              className="mt-4 min-h-28 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              placeholder={inputMode === "voice" ? "Speak or edit your answer here..." : "Write your answer..."}
              value={answers[question.id] ?? ""}
              onChange={(event) =>
                setAnswers((current) => ({
                  ...current,
                  [question.id]: event.target.value
                }))
              }
            />
            {inputMode === "voice" && listeningQuestionId === question.id && interimTranscript ? (
              <p className="mt-3 text-sm text-stone-500">Live transcript: {interimTranscript}</p>
            ) : null}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-6 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        Submit Answers
      </button>
      <p className="mt-4 text-sm text-stone-600">{status}</p>
      {result?.feedback ? (
        <div className="mt-6 rounded-3xl bg-cream p-6">
          <p className="text-sm text-stone-500">Interview Score</p>
          <p className="mt-2 text-4xl font-semibold">{result.feedback.score}</p>
          <p className="mt-4 text-sm text-stone-700">{result.feedback.summary}</p>
        </div>
      ) : null}
    </section>
  );
}

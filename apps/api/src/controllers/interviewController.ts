import type { Request, Response } from "express";
import { z } from "zod";
import { evaluateInterviewAnswers, generateInterviewQuestions } from "../services/interviewService.js";
import {
  createInterviewRecord,
  getCandidateInterviews,
  getInterviewById,
  submitInterviewRecord
} from "../services/interviewStore.js";

const createInterviewSchema = z.object({
  roleTitle: z.string().min(2),
  experienceLevel: z.enum(["fresher", "junior", "mid", "senior"]),
  interviewType: z.enum(["technical", "hr", "mixed", "system-design"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  skills: z.array(z.string()).min(1),
  focusAreas: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]),
  companyType: z.enum(["startup", "product", "service", "enterprise"]),
  questionCount: z.number().int().min(3).max(10)
});

const submitAnswersSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string().min(1)
    })
  )
});

export async function listInterviews(req: Request, res: Response) {
  const candidateId = req.user?.id;
  const items = await getCandidateInterviews(candidateId ?? "");
  return res.json(items);
}

export async function startInterview(req: Request, res: Response) {
  const parsed = createInterviewSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
  }

  const questions = generateInterviewQuestions(parsed.data);

  const session = await createInterviewRecord({
    candidateId: req.user?.id ?? "anonymous",
    roleTitle: parsed.data.roleTitle,
    brief: parsed.data,
    questions
  });

  return res.status(201).json(session);
}

export async function submitInterview(req: Request, res: Response) {
  const interviewId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = submitAnswersSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid payload", errors: parsed.error.flatten() });
  }

  const session = await getInterviewById(interviewId, req.user?.id ?? "");

  if (!session) {
    return res.status(404).json({ message: "Interview not found" });
  }

  const feedback = evaluateInterviewAnswers(session.questions, parsed.data.answers);
  const updated = await submitInterviewRecord({
    id: session.id,
    candidateId: req.user?.id ?? "",
    answers: parsed.data.answers,
    feedback
  });

  return res.json(updated);
}

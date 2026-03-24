export type Role = "candidate";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface InterviewQuestion {
  id: string;
  prompt: string;
  category: "technical" | "behavioral" | "communication" | "system-design";
  difficulty: "easy" | "medium" | "hard";
}

export interface InterviewBrief {
  roleTitle: string;
  experienceLevel: "fresher" | "junior" | "mid" | "senior";
  interviewType: "technical" | "hr" | "mixed" | "system-design";
  difficulty: "easy" | "medium" | "hard";
  skills: string[];
  focusAreas: string[];
  projects: string[];
  companyType: "startup" | "product" | "service" | "enterprise";
  questionCount: number;
}

export interface InterviewAnswer {
  questionId: string;
  answer: string;
}

export interface InterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  summary: string;
}

export interface InterviewSession {
  id: string;
  candidateId: string;
  roleTitle: string;
  brief?: InterviewBrief;
  status: "draft" | "in-progress" | "completed";
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  feedback?: InterviewFeedback;
}

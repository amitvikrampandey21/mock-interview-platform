import type { InterviewSession, User } from "@aimih/types";

export const users: User[] = [
  {
    id: "u1",
    name: "Amit Pandey",
    email: "amit@example.com",
    role: "candidate"
  }
];

export const interviews: InterviewSession[] = [
  {
    id: "i1",
    candidateId: "u1",
    roleTitle: "Frontend Developer",
    status: "completed",
    questions: [
      {
        id: "q1",
        prompt: "Explain how React reconciliation works.",
        category: "technical",
        difficulty: "medium"
      }
    ],
    answers: [
      {
        questionId: "q1",
        answer: "React compares virtual DOM trees and updates only changed nodes."
      }
    ],
    feedback: {
      score: 78,
      strengths: ["Clear explanation", "Understands rendering basics"],
      improvements: ["Expand on keys and diffing tradeoffs"],
      summary: "Good baseline answer with room for deeper detail."
    }
  }
];

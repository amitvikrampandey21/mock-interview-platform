import type { InterviewSession, User } from "@aimih/types";
import type { InterviewDocument } from "../models/interviewModel.js";
import type { UserDocument } from "../models/userModel.js";

export function serializeUser(user: UserDocument): User {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export function serializeInterview(interview: InterviewDocument): InterviewSession {
  return {
    id: interview._id.toString(),
    candidateId: interview.candidateId,
    roleTitle: interview.roleTitle,
    brief: interview.brief ?? undefined,
    status: interview.status,
    questions: interview.questions,
    answers: interview.answers,
    feedback: interview.feedback ?? undefined
  };
}

import type { InterviewAnswer, InterviewBrief, InterviewFeedback, InterviewQuestion, InterviewSession } from "@aimih/types";
import mongoose from "mongoose";
import { interviews } from "../data/mockDb.js";
import { serializeInterview } from "../lib/serializers.js";
import { InterviewModel } from "../models/interviewModel.js";

export async function getAllInterviews(): Promise<InterviewSession[]> {
  if (mongoose.connection.readyState === 1) {
    const records = await InterviewModel.find().sort({ createdAt: -1 });
    return records.map(serializeInterview);
  }

  return [...interviews].reverse();
}

export async function getCandidateInterviews(candidateId: string): Promise<InterviewSession[]> {
  if (mongoose.connection.readyState === 1) {
    const records = await InterviewModel.find({ candidateId }).sort({ createdAt: -1 });
    return records.map(serializeInterview);
  }

  return interviews.filter((item) => item.candidateId === candidateId);
}

export async function createInterviewRecord(input: {
  candidateId: string;
  roleTitle: string;
  brief: InterviewBrief;
  questions: InterviewQuestion[];
}): Promise<InterviewSession> {
  if (mongoose.connection.readyState === 1) {
    await InterviewModel.updateMany(
      { candidateId: input.candidateId, status: "in-progress" },
      { status: "completed" }
    );

    const record = await InterviewModel.create({
      candidateId: input.candidateId,
      roleTitle: input.roleTitle,
      brief: input.brief,
      status: "in-progress",
      questions: input.questions,
      answers: []
    });

    return serializeInterview(record);
  }

  for (const interview of interviews) {
    if (interview.candidateId === input.candidateId && interview.status === "in-progress") {
      interview.status = "completed";
    }
  }

  const session: InterviewSession = {
    id: `i${interviews.length + 1}`,
    candidateId: input.candidateId,
    roleTitle: input.roleTitle,
    brief: input.brief,
    status: "in-progress",
    questions: input.questions,
    answers: []
  };

  interviews.push(session);
  return session;
}

export async function submitInterviewRecord(input: {
  id: string;
  candidateId: string;
  answers: InterviewAnswer[];
  feedback: InterviewFeedback;
}): Promise<InterviewSession | null> {
  if (mongoose.connection.readyState === 1) {
    const record = await InterviewModel.findOneAndUpdate(
      { _id: input.id, candidateId: input.candidateId },
      {
        answers: input.answers,
        feedback: input.feedback,
        status: "completed"
      },
      { new: true }
    );

    return record ? serializeInterview(record) : null;
  }

  const session = interviews.find((item) => item.id === input.id && item.candidateId === input.candidateId);

  if (!session) {
    return null;
  }

  session.answers = input.answers;
  session.feedback = input.feedback;
  session.status = "completed";

  return session;
}

export async function getInterviewById(id: string, candidateId: string): Promise<InterviewSession | null> {
  if (mongoose.connection.readyState === 1) {
    const record = await InterviewModel.findOne({ _id: id, candidateId });
    return record ? serializeInterview(record) : null;
  }

  return interviews.find((item) => item.id === id && item.candidateId === candidateId) ?? null;
}

import mongoose, { Schema, type InferSchemaType } from "mongoose";

const briefSchema = new Schema(
  {
    roleTitle: { type: String, required: true },
    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior"],
      required: true
    },
    interviewType: {
      type: String,
      enum: ["technical", "hr", "mixed", "system-design"],
      required: true
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true
    },
    skills: [{ type: String }],
    focusAreas: [{ type: String }],
    projects: [{ type: String }],
    companyType: {
      type: String,
      enum: ["startup", "product", "service", "enterprise"],
      required: true
    },
    questionCount: { type: Number, required: true }
  },
  { _id: false }
);

const questionSchema = new Schema(
  {
    id: { type: String, required: true },
    prompt: { type: String, required: true },
    category: {
      type: String,
      enum: ["technical", "behavioral", "communication", "system-design"],
      required: true
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true
    }
  },
  { _id: false }
);

const answerSchema = new Schema(
  {
    questionId: { type: String, required: true },
    answer: { type: String, required: true }
  },
  { _id: false }
);

const feedbackSchema = new Schema(
  {
    score: { type: Number, required: true },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    summary: { type: String, required: true }
  },
  { _id: false }
);

const interviewSchema = new Schema(
  {
    candidateId: { type: String, required: true },
    roleTitle: { type: String, required: true },
    brief: briefSchema,
    status: { type: String, enum: ["draft", "in-progress", "completed"], required: true },
    questions: [questionSchema],
    answers: [answerSchema],
    feedback: feedbackSchema
  },
  { timestamps: true }
);

export type InterviewDocument = InferSchemaType<typeof interviewSchema> & { _id: mongoose.Types.ObjectId };

export const InterviewModel =
  mongoose.models.Interview || mongoose.model("Interview", interviewSchema);

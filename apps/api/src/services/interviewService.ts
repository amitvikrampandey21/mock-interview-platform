import type { InterviewAnswer, InterviewBrief, InterviewFeedback, InterviewQuestion } from "@aimih/types";

const technicalTemplates = [
  "You have worked with {topic}. Walk me through a real problem you solved using it and the decisions you made.",
  "If you were building a production feature around {topic} as a {roleTitle}, what tradeoffs would you consider first?",
  "Suppose a feature using {topic} starts failing in production. How would you investigate and fix it?",
  "What mistakes do engineers commonly make with {topic}, and how would you avoid them?"
];

const projectTemplates = [
  "Choose one of your projects, {topic}, and give me a full walkthrough from problem statement to final result.",
  "In your project {topic}, what was the hardest technical challenge and how did you solve it?",
  "What architecture or design decisions did you make in {topic}, and what would you improve now?",
  "If I open your project {topic} today, what part of it best shows your strengths as a {roleTitle}?"
];

const behavioralTemplates = [
  "Tell me about a time you received difficult feedback while working on {topic}. What did you do next?",
  "Describe a project involving {topic} where you faced pressure, ambiguity, or a tight deadline. How did you handle it?",
  "Tell me about a time you disagreed with a teammate about an approach to {topic}. How did you resolve it?",
  "Give me an example of a situation where you had to learn {topic} quickly to deliver results."
];

const communicationTemplates = [
  "Introduce yourself the way you would in a real {roleTitle} interview.",
  "How would you explain {topic} to a product manager or non-technical stakeholder?",
  "When discussing {topic}, how do you make sure your communication is clear and structured?",
  "Why are you interested in a {companyType} environment for a {roleTitle} role?"
];

const systemDesignTemplates = [
  "Design a practical high-level solution for a {companyType} product that depends heavily on {topic}.",
  "If traffic suddenly scaled 10x for a system built around {topic}, what would you examine first?",
  "How would you design reliability, monitoring, and recovery around {topic}?",
  "Walk me through the architecture choices you would make for {topic} at a {experienceLevel} level."
];

function fillTemplate(template: string, brief: InterviewBrief, topic: string) {
  return template
    .replaceAll("{topic}", topic)
    .replaceAll("{roleTitle}", brief.roleTitle)
    .replaceAll("{companyType}", brief.companyType)
    .replaceAll("{experienceLevel}", brief.experienceLevel);
}

export function generateInterviewQuestions(brief: InterviewBrief): InterviewQuestion[] {
  const topics = [...brief.skills, ...brief.focusAreas].filter(Boolean);
  const fallbackTopics = topics.length > 0 ? topics : [brief.roleTitle, "team collaboration", "project delivery"];
  const projectTopics = brief.projects.filter(Boolean);
  const categories: InterviewQuestion["category"][] =
    brief.interviewType === "technical"
      ? ["technical", "technical", "communication", "behavioral"]
      : brief.interviewType === "hr"
        ? ["communication", "behavioral", "communication", "behavioral"]
        : brief.interviewType === "system-design"
          ? ["system-design", "technical", "communication", "behavioral"]
          : ["technical", "behavioral", "communication", "system-design"];

  const templatesByCategory: Record<InterviewQuestion["category"], string[]> = {
    technical: technicalTemplates,
    behavioral: behavioralTemplates,
    communication: communicationTemplates,
    "system-design": systemDesignTemplates
  };

  const questions: InterviewQuestion[] = [];

  for (let index = 0; index < brief.questionCount; index += 1) {
    const shouldAskProjectQuestion = projectTopics.length > 0 && index % 3 === 1;
    const category = categories[index % categories.length];
    const templatePool = shouldAskProjectQuestion ? projectTemplates : templatesByCategory[category];
    const template = templatePool[index % templatePool.length];
    const topic = shouldAskProjectQuestion
      ? projectTopics[index % projectTopics.length]
      : fallbackTopics[index % fallbackTopics.length];

    questions.push({
      id: `local-${index + 1}`,
      prompt: fillTemplate(template, brief, topic),
      category,
      difficulty: brief.difficulty
    });
  }

  return questions;
}

export function evaluateInterviewAnswers(
  questions: InterviewQuestion[],
  answers: InterviewAnswer[]
): InterviewFeedback {
  const completionRate = questions.length === 0 ? 0 : answers.length / questions.length;
  const detailedAnswers = answers.filter((answer) => answer.answer.trim().length > 80).length;
  const score = Math.min(95, Math.round(55 + completionRate * 25 + detailedAnswers * 4));

  return {
    score,
    strengths: [
      "Completed the interview flow",
      "Provided structured responses",
      "Covered multiple interview topics"
    ],
    improvements: [
      "Add more concrete project examples",
      "Use measurable impact in your answers",
      "Make technical tradeoffs more explicit"
    ],
    summary: "Evaluation generated from your submitted answers using the local interview engine."
  };
}

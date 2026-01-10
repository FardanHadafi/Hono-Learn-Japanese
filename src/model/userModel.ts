import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { learningSessions } from "@/db/schema";
import { userAnswers } from "@/db/schema";
import { userProgress } from "@/db/schema";

export type LearningSession = InferSelectModel<typeof learningSessions>;
export type NewLearningSession = InferInsertModel<typeof learningSessions>;

export type UserAnswer = InferSelectModel<typeof userAnswers>;
export type NewUserAnswer = InferInsertModel<typeof userAnswers>;

export type UserProgress = InferSelectModel<typeof userProgress>;
export type NewUserProgress = InferInsertModel<typeof userProgress>;

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

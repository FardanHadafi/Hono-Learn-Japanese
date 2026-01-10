import {
  LearningSession,
  NewLearningSession,
  NewUserAnswer,
  UserProgress,
} from "@/model/userModel";

export interface LearningRepository {
  // Session
  createSession(data: NewLearningSession): Promise<LearningSession>;
  findSessionById(sessionId: string): Promise<LearningSession | null>;
  finishSession(
    sessionId: string,
    data: Partial<LearningSession>
  ): Promise<void>;

  // Answer
  saveAnswer(data: NewUserAnswer): Promise<void>;
  countAnswer(sessionId: string): Promise<{ correct: number; wrong: number }>;

  // Progress
  upsertProgress(data: {
    userId: string;
    scriptType: string;
    jlptLevel: string;
    group: string;
    accuracy: number;
    completed: boolean;
  }): Promise<UserProgress>;
}

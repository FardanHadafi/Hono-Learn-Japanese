import {
  NewLearningSession,
  LearningSession,
  NewUserAnswer,
  UserProgress,
} from "@/model/userModel";
import { LearningRepository } from "./learningRepository";
import { db } from "@/db/database";
import { learningSessions, userAnswers, userProgress } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export class LearningRepositoryImpl implements LearningRepository {
  async createSession(data: NewLearningSession): Promise<LearningSession> {
    return await db.transaction(async (tx) => {
      const [session] = await tx
        .insert(learningSessions)
        .values(data)
        .returning();

      return session;
    });
  }

  async findSessionById(sessionId: string): Promise<LearningSession | null> {
    const [session] = await db
      .select()
      .from(learningSessions)
      .where(eq(learningSessions.id, sessionId));

    return session ?? null;
  }

  async saveAnswer(data: NewUserAnswer): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.insert(userAnswers).values(data);
    });
  }

  async countAnswer(
    sessionId: string
  ): Promise<{ correct: number; wrong: number }> {
    const result = await db.execute(sql`SELECT
        SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) AS correct,
        SUM(CASE WHEN NOT is_correct THEN 1 ELSE 0 END) AS wrong
      FROM user_answers
      WHERE session_id = ${sessionId}`);

    return {
      correct: Number(result.rows[0]?.correct ?? 0),
      wrong: Number(result.rows[0]?.wrong ?? 0),
    };
  }

  async finishSession(
    sessionId: string,
    data: Partial<LearningSession>
  ): Promise<void> {
    await db.transaction(async (tx) => {
      await tx
        .update(learningSessions)
        .set({
          ...data,
          finishedAt: new Date(),
        })
        .where(eq(learningSessions.id, sessionId));
    });
  }

  async upsertProgress(data: {
    userId: string;
    scriptType: string;
    jlptLevel: string;
    group: string;
    accuracy: number;
    completed: boolean;
  }): Promise<UserProgress> {
    return await db.transaction(async (tx) => {
      const [progress] = await tx
        .insert(userProgress)
        .values({
          userId: data.userId,
          scriptType: data.scriptType,
          jlptLevel: data.jlptLevel,
          group: data.group,
          bestAccuracy: data.accuracy,
          completed: data.completed,
        })
        .onConflictDoUpdate({
          target: [
            userProgress.userId,
            userProgress.scriptType,
            userProgress.group,
          ],
          set: {
            bestAccuracy: sql`GREATEST(${userProgress.bestAccuracy}, ${data.accuracy}`,
            completed: data.completed,
            updatedAt: new Date(),
          },
        })
        .returning();

      return progress;
    });
  }
}

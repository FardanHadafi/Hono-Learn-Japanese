import { NewScore } from "@/types/score";
import { db } from "./database";
import { scores } from "./schema";
import { eq } from "drizzle-orm";

export const insertScore = async (score: NewScore) => {
  const [total] = await db.insert(scores).values(score).returning();
  return total;
};

export const getScoresByUserId = async (userId: string) => {
  const scoreList = await db
    .select()
    .from(scores)
    .where(eq(scores.userId, userId));
  return scoreList;
};

import { getScoresByUserId, insertScore } from "@/db/query";
import { authMiddleware } from "@/middleware/auth.middleware";
import { HonoEnv } from "@/types/score";
import { scoreValidator } from "@/validation/scoreValidation";
import { Hono } from "hono";

export const scores = new Hono<HonoEnv>();
scores.use(authMiddleware);

scores.get("/", async (c) => {
  const user = c.get("user");
  try {
    const scoreList = await getScoresByUserId(user.id);
    return c.json(scoreList);
  } catch (error) {
    console.error("Error fetching Scores:", error);
    return c.json(
      {
        error: "Failed to fetch Scores",
      },
      500
    );
  }
});

scores.post("/", scoreValidator, async (c) => {
  const user = c.get("user");
  const scoreData = c.req.valid("json");
  try {
    const newScore = await insertScore({
      scoreData,
      userId: user.id,
    });
    return c.json(newScore, 201);
  } catch (error) {
    console.error("Error inserting Score:", error);
    return c.json({ error: "Failed to insert score" }, 500);
  }
});

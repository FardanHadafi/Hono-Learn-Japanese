import { db } from "@/db/database";
import { KanaStaticProvider } from "@/helper/kanaProviderImpl";
import { authMiddleware } from "@/middleware/auth.middleware";
import { LearningRepositoryImpl } from "@/repository/learningRepositoryImpl";
import { LearningService } from "@/service/learningService";
import { HonoEnv } from "@/types/score";
import { LearningValidation } from "@/validation/learningValidation";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const learningController = new Hono<HonoEnv>();
// Dependency Injection
const learningRepository = new LearningRepositoryImpl(db);
const kanaProvider = new KanaStaticProvider();
const learningService = new LearningService(learningRepository, kanaProvider);

learningController.post(
  "/sessions",
  authMiddleware,
  zValidator("json", LearningValidation.START_SESSION),
  async (c) => {
    const user = c.get("user");
    const request = c.req.valid("json");

    const session = await learningService.startSession(user.id, request);

    return c.json(
      {
        success: true,
        data: session,
      },
      201
    );
  }
);

learningController.post(
  "/sessions/:sessionId/answer",
  authMiddleware,
  zValidator("json", LearningValidation.SUBMIT_ANSWER),
  async (c) => {
    const user = c.get("user");
    const sessionId = c.req.param("sessionId");
    const body = c.req.valid("json");
    const result = await learningService.submitAnswer(user.id, {
      ...body,
      sessionId,
    });

    return c.json({
      success: true,
      data: result,
    });
  }
);

learningController.get(
  "/sessions/:sessionId/result",
  authMiddleware,
  async (c) => {
    const user = c.get("user");
    const sessionId = c.req.param("sessionId");
    const result = await learningService.getSessionResult(user.id, sessionId);

    return c.json({
      success: true,
      data: result,
    });
  }
);

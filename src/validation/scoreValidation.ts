import z from "zod";
import { zValidator } from "@hono/zod-validator";

export const score = z.string();
export const scoreValidator = zValidator("json", score, (result, c) => {
  if (!result.success) {
    return c.json(
      {
        errors: result.error.issues.map((issue) => issue.message),
      },
      400
    );
  }
});

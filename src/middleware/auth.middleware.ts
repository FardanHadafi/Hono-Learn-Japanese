import { createMiddleware } from "hono/factory";
import { auth } from "@/lib/auth";
import { HonoEnv } from "@/types/score";
import { HTTPException } from "hono/http-exception";

export const authMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session || !session.user) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});

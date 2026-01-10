import { Hono } from "hono";
import { auth } from "./lib/auth";
import { userController } from "./controller/userController";
import { cors } from "hono/cors";
import { learningController } from "./controller/learningController";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "http://localhost:5173",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.get("/api/auth/get-session", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ session: null, user: null }, 401);
  }

  return c.json(session);
});

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/users", userController);
app.route("/learning", learningController);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;

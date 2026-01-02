import { Hono } from "hono";
import { auth } from "./lib/auth";
import { userController } from "./controller/userController";

const app = new Hono();

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/users", userController);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;

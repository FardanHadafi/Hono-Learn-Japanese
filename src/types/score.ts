import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { scores } from "../db/schema";
import { auth } from "@/lib/auth";

export type Score = InferSelectModel<typeof scores>;
export type NewScore = InferInsertModel<typeof scores>;

export type HonoEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
};

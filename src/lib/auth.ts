import { db } from "@/db/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { sendEmail } from "./email";
import { UserRepositoryImpl } from "@/repository/userRepositoryImpl";
import { UserService } from "@/service/userService";
import type { User as AuthUser } from "better-auth";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  baseURL: process.env.AUTH_BASE_URL!,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  plugins: [openAPI()],
  events: {
    async onUserCreated({ user }: { user: AuthUser }) {
      const userRepository = new UserRepositoryImpl();
      const userService = new UserService(userRepository);

      await userService.signUp({
        id: user.id,
        name: user.name ?? user.email!.split("@")[0],
        email: user.email,
        image: user.image ?? undefined,
      });
    },
  },
  trustedOrigins: ["http://localhost:5173"],
  cookies: {
    sessionToken: {
      path: "/",
      sameSite: "lax",
    },
  },
});

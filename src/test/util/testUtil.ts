import { db } from "@/db/database";
import { user, verification } from "@/db/schema";
import { eq } from "drizzle-orm";

export const TestUser = {
  async deleteByEmail(email: string) {
    await db.delete(user).where(eq(user.email, email));
  },

  async getEmailVerificationToken(email: string) {
    const [token] = await db
      .select()
      .from(verification)
      .where(eq(verification.identifier, email));

    return token?.value;
  },
};

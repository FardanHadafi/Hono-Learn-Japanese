import { User } from "@/model/userModel";
import { UserRepository } from "./userRepository";
import { db } from "@/db/database";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export class UserRepositoryImpl implements UserRepository {
  async Create(user: User): Promise<User> {
    return await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(users)
        .values({
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image ?? null,
        })
        .returning();

      return this.toDomain(row);
    });
  }

  async Update(user: User): Promise<User> {
    return await db.transaction(async (tx) => {
      const [row] = await tx
        .update(users)
        .set({
          name: user.name,
          image: user.image ?? null,
          emailVerified: user.emailVerified,
          updatedAt: user.updatedAt,
        })
        .where(eq(users.id, user.id))
        .returning();

      return this.toDomain(row);
    });
  }

  async FindById(id: string): Promise<User | null> {
    return await db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      if (!row) {
        return null;
      }

      return this.toDomain(row);
    });
  }

  async FindByEmail(email: string): Promise<User | null> {
    return await db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!row) {
        return null;
      }

      return this.toDomain(row);
    });
  }

  async Delete(id: string): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(users).where(eq(users.id, id));
    });
  }

  private toDomain(row: typeof users.$inferSelect): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      emailVerified: row.emailVerified,
      image: row.image ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

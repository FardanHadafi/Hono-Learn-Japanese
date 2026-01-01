import { eq } from "drizzle-orm";
import { db } from "@/db/database";
import { users } from "@/db/schema";
import { User } from "@/model/userModel";
import { UserRepository } from "./userRepository";

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
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id))
        .returning();

      return this.toDomain(row);
    });
  }

  async Delete(id: string): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(users).where(eq(users.id, id));
    });
  }

  async FindById(id: string): Promise<User | null> {
    return await db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      return row ? this.toDomain(row) : null;
    });
  }

  async FindByEmail(email: string): Promise<User | null> {
    return await db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      return row ? this.toDomain(row) : null;
    });
  }

  async FindByName(name: string): Promise<User | null> {
    return await db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(users)
        .where(eq(users.name, name))
        .limit(1);

      return row ? this.toDomain(row) : null;
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

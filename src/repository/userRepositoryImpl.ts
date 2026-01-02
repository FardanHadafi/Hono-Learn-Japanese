import { eq } from "drizzle-orm";
import { db } from "@/db/database";
import { user } from "@/db/schema";
import { User } from "@/model/userModel";
import { UserRepository } from "./userRepository";

export class UserRepositoryImpl implements UserRepository {
  async Create(data: User): Promise<User> {
    return await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(user)
        .values({
          id: data.id,
          name: data.name,
          email: data.email,
          emailVerified: data.emailVerified,
          image: data.image ?? null,
        })
        .returning();

      return this.toDomain(row);
    });
  }

  async Update(data: User): Promise<User> {
    return await db.transaction(async (tx) => {
      const [row] = await tx
        .update(user)
        .set({
          name: data.name,
          image: data.image ?? null,
          emailVerified: data.emailVerified,
          updatedAt: new Date(),
        })
        .where(eq(user.id, user.id))
        .returning();

      return this.toDomain(row);
    });
  }

  async Delete(id: string): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(user).where(eq(user.id, id));
    });
  }

  async FindById(id: string): Promise<User | null> {
    return await db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(user)
        .where(eq(user.id, id))
        .limit(1);

      return row ? this.toDomain(row) : null;
    });
  }

  async FindByEmail(email: string): Promise<User | null> {
    return await db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(user)
        .where(eq(user.email, email))
        .limit(1);

      return row ? this.toDomain(row) : null;
    });
  }

  async FindByName(name: string): Promise<User | null> {
    return await db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(user)
        .where(eq(user.name, name))
        .limit(1);

      return row ? this.toDomain(row) : null;
    });
  }

  private toDomain(row: typeof user.$inferSelect): User {
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

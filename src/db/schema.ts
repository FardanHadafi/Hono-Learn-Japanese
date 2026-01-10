import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const scores = pgTable(
  "scores",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    score: integer("score").notNull().default(0), // Total correct answers
    totalQuestions: integer("total_questions").notNull().default(0),
    percentage: integer("percentage").notNull().default(0),
    timeTaken: integer("time_taken"), // in seconds
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("scores_userId_idx").on(table.userId),
    index("scores_createdAt_idx").on(table.createdAt),
  ]
);

export const userAnswers = pgTable(
  "user_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    sessionId: uuid("session_id")
      .notNull()
      .references(() => learningSessions.id, { onDelete: "cascade" }),

    prompt: text("prompt").notNull(),
    // あ | カ | 水

    options: jsonb("options").notNull(),
    // ["a","i","u","e","o"]

    correctAnswer: text("correct_answer").notNull(),
    userAnswer: text("user_answer").notNull(),

    isCorrect: boolean("is_correct").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("user_answers_sessionId_idx").on(table.sessionId)]
);

export const learningSessions = pgTable(
  "learning_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    scriptType: text("script_type").notNull(),
    // hiragana | katakana | kanji

    jlptLevel: text("jlpt_level").notNull(),
    // N5 | N4

    group: text("group").notNull(),
    // a-row, ka-row, basic-kanji, etc

    totalQuestions: integer("total_questions").notNull().default(10),

    correctCount: integer("correct_count").notNull().default(0),

    wrongCount: integer("wrong_count").notNull().default(0),

    accuracy: integer("accuracy").notNull().default(0),

    passed: boolean("passed").notNull().default(false),

    startedAt: timestamp("started_at").defaultNow().notNull(),

    finishedAt: timestamp("finished_at"),
  },
  (table) => [
    index("learning_sessions_userId_idx").on(table.userId),
    index("learning_sessions_scriptType_idx").on(table.scriptType),
  ]
);

export const userProgress = pgTable(
  "user_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    scriptType: text("script_type").notNull(),
    // hiragana | katakana | kanji

    jlptLevel: text("jlpt_level").notNull(),

    group: text("group").notNull(),

    completed: boolean("completed").notNull().default(false),

    bestAccuracy: integer("best_accuracy").notNull().default(0),

    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("user_progress_userId_idx").on(table.userId),
    index("user_progress_script_idx").on(table.scriptType),
  ]
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  learningSessions: many(learningSessions),
  progress: many(userProgress),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const scoresRelations = relations(scores, ({ one, many }) => ({
  user: one(user, {
    fields: [scores.userId],
    references: [user.id],
  }),
  userAnswers: many(userAnswers),
}));

export const learningSessionRelations = relations(
  learningSessions,
  ({ one, many }) => ({
    user: one(user, {
      fields: [learningSessions.userId],
      references: [user.id],
    }),
    answers: many(userAnswers),
  })
);

export const userAnswersRelations = relations(userAnswers, ({ one }) => ({
  session: one(learningSessions, {
    fields: [userAnswers.sessionId],
    references: [learningSessions.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(user, {
    fields: [userProgress.userId],
    references: [user.id],
  }),
}));

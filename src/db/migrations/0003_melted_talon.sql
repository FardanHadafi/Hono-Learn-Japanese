CREATE TABLE "learning_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"script_type" text NOT NULL,
	"jlpt_level" text NOT NULL,
	"group" text NOT NULL,
	"total_questions" integer DEFAULT 10 NOT NULL,
	"correct_count" integer DEFAULT 0 NOT NULL,
	"wrong_count" integer DEFAULT 0 NOT NULL,
	"accuracy" integer DEFAULT 0 NOT NULL,
	"passed" boolean DEFAULT false NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"finished_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"script_type" text NOT NULL,
	"jlpt_level" text NOT NULL,
	"group" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"best_accuracy" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_answers" DROP CONSTRAINT "user_answers_score_id_scores_id_fk";
--> statement-breakpoint
ALTER TABLE "user_answers" DROP CONSTRAINT "user_answers_question_id_questions_id_fk";
--> statement-breakpoint
DROP INDEX "user_answers_scoreId_idx";--> statement-breakpoint
DROP INDEX "user_answers_questionId_idx";--> statement-breakpoint
ALTER TABLE "user_answers" ADD COLUMN "session_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "user_answers" ADD COLUMN "prompt" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user_answers" ADD COLUMN "options" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "user_answers" ADD COLUMN "correct_answer" text NOT NULL;--> statement-breakpoint
ALTER TABLE "learning_sessions" ADD CONSTRAINT "learning_sessions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "learning_sessions_userId_idx" ON "learning_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "learning_sessions_scriptType_idx" ON "learning_sessions" USING btree ("script_type");--> statement-breakpoint
CREATE INDEX "user_progress_userId_idx" ON "user_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_progress_script_idx" ON "user_progress" USING btree ("script_type");--> statement-breakpoint
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_session_id_learning_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."learning_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_answers_sessionId_idx" ON "user_answers" USING btree ("session_id");--> statement-breakpoint
ALTER TABLE "user_answers" DROP COLUMN "score_id";--> statement-breakpoint
ALTER TABLE "user_answers" DROP COLUMN "question_id";
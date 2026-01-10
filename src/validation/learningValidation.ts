import z, { ZodType } from "zod";

export class LearningValidation {
  static readonly SCRIPT_TYPE = z.enum(["hiragana", "katakana", "kanji"]);

  static readonly JLPT_LEVEL = z.enum(["N5", "N4"]);

  static readonly START_SESSION = z.object({
    scriptType: LearningValidation.SCRIPT_TYPE,
    jlptLevel: LearningValidation.JLPT_LEVEL,
    group: z.string().min(1).max(50),
  });

  static readonly SUBMIT_ANSWER = z.object({
    sessionId: z.uuid(),
    prompt: z.string().min(1).max(10),
    options: z.array(z.string()).length(5),
    correctAnswer: z.string().min(1),
    userAnswer: z.string().min(1).max(10),
  });

  static readonly PROGRESS_QUERY = z.object({
    scriptType: LearningValidation.SCRIPT_TYPE.optional(),
    jlptLevel: LearningValidation.JLPT_LEVEL.optional(),
  });

  static readonly FINISH_SESSION = z.object({
    sessionId: z.uuid(),
  });

  static readonly SESSION_ID = z.uuid();
}

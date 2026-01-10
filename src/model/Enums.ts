export type ScriptType = "hiragana" | "katakana" | "kanji";
export type JLPTLevel = "N5" | "N4";

export type LearningGroup =
  | "a-row"
  | "ka-row"
  | "sa-row"
  | "ta-row"
  | "na-row"
  | "ha-row"
  | "ma-row"
  | "ya-row"
  | "ra-row"
  | "wa-row"
  | "basic-kanji"
  | string; // future-proof

export type LearningQuestion = {
  prompt: string; // あ | カ | 水
  options: string[]; // ["a","i","u","e","o"]
};

export type LearningSessionSummary = {
  sessionId: string;
  scriptType: ScriptType;
  jlptLevel: JLPTLevel;
  group: LearningGroup;

  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  passed: boolean;

  startedAt: string;
  finishedAt?: string;
};

export type KanaItem = {
  kana: string;
  romaji: string;
};

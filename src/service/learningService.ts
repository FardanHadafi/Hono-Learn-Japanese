import { KanaItem, LearningQuestion, ScriptType } from "@/model/Enums";
import {
  StartLearningSessionRequest,
  SubmitLearningAnswerRequest,
} from "@/model/requestModel";
import {
  FinishLearningSessionResponse,
  StartLearningSessionResponse,
  SubmitLearningAnswerResponse,
} from "@/model/responseModel";
import { LearningRepository } from "@/repository/learningRepository";
import { HTTPException } from "hono/http-exception";

type KanaProvider = {
  getItems(
    scriptType: "hiragana" | "katakana",
    jlptLevel: "N5" | "N4",
    group: string
  ): KanaItem[];
};

export class LearningService {
  constructor(
    private readonly learningRepository: LearningRepository,
    private readonly kanaProvider: KanaProvider
  ) {}

  async startSession(
    userId: string,
    request: StartLearningSessionRequest
  ): Promise<StartLearningSessionResponse> {
    const session = await this.learningRepository.createSession({
      userId,
      scriptType: request.scriptType,
      jlptLevel: request.jlptLevel,
      group: request.group,
      totalQuestions: 10,
    });

    if (request.scriptType === "kanji") {
      throw new HTTPException(400, {
        message: "Kanji learning not supported yet",
      });
    }

    const items = this.kanaProvider.getItems(
      request.scriptType,
      request.jlptLevel,
      request.group
    );

    const question = this.createQuestion(items);

    return {
      sessionId: session.id,
      totalQuestions: 10,
      currentIndex: 1,
      question,
    };
  }

  async submitAnswer(
    userId: string,
    request: SubmitLearningAnswerRequest
  ): Promise<SubmitLearningAnswerResponse> {
    const session = await this.learningRepository.findSessionById(
      request.sessionId
    );

    if (!session || session.userId !== userId) {
      throw new HTTPException(404, { message: "Learning session not found" });
    }

    if (session.finishedAt) {
      throw new HTTPException(409, {
        message: "Learning session already finished",
      });
    }

    const isCorrect = request.userAnswer === request.correctAnswer;

    await this.learningRepository.saveAnswer({
      sessionId: session.id,
      prompt: request.prompt,
      options: request.options,
      correctAnswer: request.correctAnswer,
      userAnswer: request.userAnswer,
      isCorrect,
    });

    const { correct, wrong } = await this.learningRepository.countAnswer(
      session.id
    );

    const answered = correct + wrong;

    if (answered >= session.totalQuestions) {
      return {
        isCorrect,
        correctAnswer: request.correctAnswer,
        currentIndex: answered,
        isSessionFinished: true,
      };
    }

    return {
      isCorrect,
      correctAnswer: request.correctAnswer,
      currentIndex: answered + 1,
      isSessionFinished: false,
    };
  }

  async finishSession(
    userId: string,
    sessionId: string
  ): Promise<FinishLearningSessionResponse> {
    const session = await this.learningRepository.findSessionById(sessionId);

    if (!session || session.userId !== userId) {
      throw new HTTPException(404, {
        message: "Learning session not found",
      });
    }

    const { correct, wrong } = await this.learningRepository.countAnswer(
      sessionId
    );

    if (correct + wrong === 0) {
      throw new HTTPException(400, {
        message: "Session has no answer",
      });
    }

    const accuracy = Math.round((correct / session.totalQuestions) * 100);

    const passed = accuracy >= 80;

    await this.learningRepository.finishSession(sessionId, {
      correctCount: correct,
      wrongCount: wrong,
      accuracy,
      passed,
    });

    await this.learningRepository.upsertProgress({
      userId,
      scriptType: session.scriptType,
      jlptLevel: session.jlptLevel,
      group: session.group,
      accuracy,
      completed: passed,
    });

    return {
      totalQuestions: session.totalQuestions,
      correctCount: correct,
      wrongCount: wrong,
      accuracy,
      passed,
      nextAction: passed ? "next-group" : "repeat-group",
    };
  }

  async getSessionResult(userId: string, sessionId: string) {
    const session = await this.learningRepository.findSessionById(sessionId);

    if (!session || session.userId !== userId) {
      throw new HTTPException(404, { message: "Session not found" });
    }

    if (!session.finishedAt) {
      throw new HTTPException(409, {
        message: "Session not finished yet",
      });
    }

    return {
      totalQuestions: session.totalQuestions,
      correctCount: session.correctCount,
      wrongCount: session.wrongCount,
      accuracy: session.accuracy,
      passed: session.passed,
      nextAction: session.passed ? "next-group" : "repeat-group",
    };
  }

  private createQuestion(items: KanaItem[]): LearningQuestion {
    const correct = items[Math.floor(Math.random() * items.length)];
    const wrongOptions = this.shuffle(
      items.filter((i) => i.romaji !== correct.romaji).map((i) => i.romaji)
    ).slice(0, 4);

    const options = this.shuffle([correct.romaji, ...wrongOptions]);

    return {
      prompt: correct.kana,
      options,
    };
  }

  private shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }
}

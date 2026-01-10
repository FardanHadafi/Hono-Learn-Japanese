import {
  JLPTLevel,
  LearningGroup,
  LearningQuestion,
  ScriptType,
} from "./Enums";
import { Session } from "./sessionModel";
import { User } from "./userModel";

// Session with User Response
export type SessionResponse = {
  session: Session;
  user: User;
};

// Sign Up Response
export type SignUpResponse = {
  token?: string;
  user: User;
};

// Sign In Response
export type SignInResponse = {
  redirect: boolean;
  token: string;
  url?: string;
  user: User;
};

// Sign Out Response
export type SignOutResponse = {
  success: boolean;
};

// Update User Response
export type UpdateUserResponse = {
  user: User;
};

// Change Email Response
export type ChangeEmailResponse = {
  user?: User;
  status: boolean;
  message?: "Email updated" | "Verification email sent";
};

// Change Password Response
export type ChangePasswordResponse = {
  token?: string;
  user: User;
};

// Reset Password Response
export type ResetPasswordResponse = {
  status: boolean;
};

// Request Password Reset Response
export type RequestPasswordResetResponse = {
  status: boolean;
  message: string;
};

// Verify Email Response
export type VerifyEmailResponse = {
  user: User;
  status: boolean;
};

// Send Verification Email Response
export type SendVerificationEmailResponse = {
  status: boolean;
};

// Delete User Response
export type DeleteUserResponse = {
  success: boolean;
  message: "User deleted" | "Verification email sent";
};

// Start Learning Response
export type StartLearningSessionResponse = {
  sessionId: string;
  totalQuestions: number; // always 10
  currentIndex: number; // starts from 1
  question: LearningQuestion;
};

// Submit Learning Asnwer Response
export type SubmitLearningAnswerResponse = {
  isCorrect: boolean;
  correctAnswer: string;
  nextQuestion?: LearningQuestion;
  currentIndex: number;
  isSessionFinished: boolean;
};

// Learning Progress Response
export type LearningProgressResponse = {
  scriptType: ScriptType;
  jlptLevel: JLPTLevel;
  group: LearningGroup;

  completed: boolean;
  bestAccuracy: number;
};

// Finish Learning Session Response
export type FinishLearningSessionResponse = {
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  passed: boolean;

  nextAction:
    | "repeat-group"
    | "next-group"
    | "unlock-katakana"
    | "unlock-kanji";
};

// List Sessions Response
export type ListSessionsResponse = Session[];

// Revoke Session Response
export type RevokeSessionResponse = {
  status: boolean;
};

// Revoke Sessions Response
export type RevokeSessionsResponse = {
  status: boolean;
};

// Revoke Other Sessions Response
export type RevokeOtherSessionsResponse = {
  status: boolean;
};

// List Accounts Response
export type AccountInfo = {
  id: string;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
  accountId: string;
  userId: string;
  scopes: string[];
};

export type ListAccountsResponse = AccountInfo[];

// Reset Password Callback Response
export type ResetPasswordCallbackResponse = {
  token: string;
};

// Refresh Token Response
export type RefreshTokenResponse = {
  tokenType: string;
  idToken: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
};

// Get Access Token Response
export type GetAccessTokenResponse = {
  tokenType: string;
  idToken: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
};

// Account Info Response
export type AccountInfoResponse = {
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    emailVerified: boolean;
  };
  data: Record<string, any>;
};

// OK Response
export type OkResponse = {
  ok: boolean;
};

// Erorr Response
export type ErrorResponse = {
  message: string;
};

export type LearningErrorResponse = {
  message: string;
  code:
    | "SESSION_NOT_FOUND"
    | "SESSION_FINISHED"
    | "INVALID_ANSWER"
    | "GROUP_LOCKED";
};

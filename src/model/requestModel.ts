import { JLPTLevel, LearningGroup, ScriptType } from "./Enums";

// Sign Up
export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
  image?: string;
  callbackURL?: string;
  rememberMe?: boolean;
};

// No password (Better-Auth)
export type SignUpUserRequest = {
  id: string; // IMPORTANT !, (Better-Auth need id)
  name: string;
  email: string;
  image?: string;
};

// Sign In
export type SignInRequest = {
  email: string;
  password: string;
  callbackURL?: string;
  rememberMe?: boolean;
};

// Sign Out
export type SignOutRequest = {};

// Update User Profile (Better-Auth)
export type UpdateUserProfileRequest = {
  name?: string;
  image?: string;
};

// Update User
export type UpdateUserRequest = {
  name?: string;
  image?: string;
};

// Change Email
export type ChangeEmailRequest = {
  newEmail: string;
  callbackURL?: string;
};

// Change Password
export type ChangePasswordRequest = {
  newPassword: string;
  currentPassword: string;
  revokeOtherSessions?: boolean;
};

// Reset Password
export type ResetPasswordRequest = {
  newPassword: string;
  token?: string;
};

// Request Password Reset
export type RequestPasswordResetRequest = {
  email: string;
  redirectTo?: string;
};

// Send Verification Email
export type SendVerificationEmailRequest = {
  email: string;
  callbackURL?: string;
};

// Delete User
export type DeleteUserRequest = {
  callbackURL?: string;
  password?: string;
  token?: string;
};

// Revoke Session
export type RevokeSessionRequest = {
  token: string;
};

// Start Learning Request
export type StartLearningSessionRequest = {
  scriptType: ScriptType;
  jlptLevel: JLPTLevel;
  group: LearningGroup;
};

// Submit Learning Answer Request
export type SubmitLearningAnswerRequest = {
  sessionId: string;
  prompt: string;
  userAnswer: string;
};

// Finish Learning Session Request
export type FinishLearningSessionRequest = {
  sessionId: string;
};

// Refresh Token
export type RefreshTokenRequest = {
  providerId: string;
  accountId?: string;
  userId?: string;
};

// Get Access Token
export type GetAccessTokenRequest = {
  providerId: string;
  accountId?: string;
  userId?: string;
};

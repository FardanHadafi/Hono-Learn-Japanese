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

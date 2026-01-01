import { Account } from "@/model/accountModel";
import { SignInRequest, SignUpRequest } from "@/model/requestModel";
import {
  AccountInfo,
  ListAccountsResponse,
  SessionResponse,
  SignInResponse,
  SignUpResponse,
} from "@/model/responseModel";
import { Session } from "@/model/sessionModel";
import { User } from "@/model/userModel";

export function toUserResponse(user: User): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function toSessionResponse(
  session: Session,
  user: User
): SessionResponse {
  return {
    session: {
      id: session.id,
      expiresAt: session.expiresAt,
      token: session.token,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      userId: session.userId,
    },
    user: toUserResponse(user),
  };
}

export function toSignUpResponse(user: User, token?: string): SignUpResponse {
  return {
    token,
    user: toUserResponse(user),
  };
}

export function toSignInResponse(
  user: User,
  token: string,
  url?: string
): SignInResponse {
  return {
    redirect: false,
    token,
    url,
    user: toUserResponse(user),
  };
}

export function toAccountInfo(account: Account, scopes: string[]): AccountInfo {
  return {
    id: account.id,
    providerId: account.providerId,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    accountId: account.accountId,
    userId: account.userId,
    scopes,
  };
}

export function toListAccountsResponse(
  accounts: Account[],
  scopesMap: Record<string, string[]>
): ListAccountsResponse {
  return accounts.map((account) =>
    toAccountInfo(account, scopesMap[account.id] || [])
  );
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long",
    };
  }
  return { valid: true };
}

export function validateSignUpRequest(request: SignUpRequest): {
  valid: boolean;
  message?: string;
} {
  if (!request.name || request.name.trim().length === 0) {
    return { valid: false, message: "Name is required" };
  }

  if (!validateEmail(request.email)) {
    return { valid: false, message: "Invalid email format" };
  }

  const passwordValidation = validatePassword(request.password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }

  return { valid: true };
}

export function validateSignInRequest(request: SignInRequest): {
  valid: boolean;
  message?: string;
} {
  if (!validateEmail(request.email)) {
    return { valid: false, message: "Invalid email format" };
  }

  if (!request.password || request.password.trim().length === 0) {
    return { valid: false, message: "Password is required" };
  }

  return { valid: true };
}

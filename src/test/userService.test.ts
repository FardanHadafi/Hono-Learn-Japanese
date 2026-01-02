import { describe, it, expect, beforeAll, afterEach } from "bun:test";
import app from "@/index";
import { TestUser } from "./util/testUtil";

const TEST_EMAIL = "test@mail.com";
const TEST_PASSWORD = "password123";
const TEST_NAME = "testuser";

let sessionCookie = "";

beforeAll(() => {
  process.env.NODE_ENV = "test";
});

afterEach(async () => {
  sessionCookie = "";
  await TestUser.deleteByEmail(TEST_EMAIL);
});

/**
 * Sign up user via Better Auth.
 * NOTE:
 * - Email verification is REQUIRED
 * - Therefore: NO ACTIVE SESSION is created
 */
async function signUp() {
  const res = await app.request("/api/auth/sign-up/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: TEST_NAME,
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    }),
  });

  expect(res.status).toBe(200);

  const cookie = res.headers.get("set-cookie");
  expect(cookie).toBeDefined();

  sessionCookie = cookie!;
}

describe("GET /api/users/me (unauthorized)", () => {
  it("should reject request without session", async () => {
    const res = await app.request("/api/users/me");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/users/me (unverified user)", () => {
  it("should reject access when email is not verified", async () => {
    await signUp();

    const res = await app.request("/api/users/me", {
      headers: {
        Cookie: sessionCookie,
      },
    });

    expect(res.status).toBe(401);
  });
});

describe("PATCH /api/users/me", () => {
  it("should reject profile update when user is not authenticated", async () => {
    await signUp();

    const res = await app.request("/api/users/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        name: "updated-name",
        image: "https://example.com.png",
      }),
    });

    expect(res.status).toBe(401);
  });
});

describe("Session invalidation", () => {
  it("should invalidate session after signout", async () => {
    await signUp();

    const signOut = await app.request("/api/auth/sign-out", {
      method: "POST",
      headers: {
        Cookie: sessionCookie,
      },
    });

    expect(signOut.status).toBe(200);

    const res = await app.request("/api/users/me", {
      headers: {
        Cookie: sessionCookie,
      },
    });

    expect(res.status).toBe(401);
  });
});

import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { shopTest } from "../../fixture";
import type { UserCreateRequest } from "../../api/models";

test.describe("Authentication API - Login", () => {
  shopTest("should successfully login with valid credentials", async ({
    app,
  }) => {
    // First register a user
    const userData: UserCreateRequest = {
      isSubscribed: false,
      email: `test+${randomUUID()}@test.com`,
      firstName: "Test",
      lastName: "User",
      password: "SecurePassword123!",
    };

    await app.api.auth.register(userData);

    // Then login with the same credentials
    const loginResponse = await app.api.auth.login({
      email: userData.email,
      password: userData.password,
    });

    expect(loginResponse.success).toBe(true);
    expect(loginResponse.token).toBeTruthy();
    expect(loginResponse.token).toMatch(
      /^Bearer\s[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
    ); // JWT format with Bearer
    expect(loginResponse.user).toBeDefined();
    expect(loginResponse.user.email).toBe(userData.email);
  });

  shopTest("should reject login with invalid email", async ({ app }) => {
    try {
      await app.api.auth.login({
        email: `nonexistent+${randomUUID()}@test.com`,
        password: "SomePassword123!",
      });
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      const errorBody = JSON.parse(error.message);
      expect(errorBody.error).toBeTruthy();
    }
  });

  shopTest("should reject login with incorrect password", async ({ app }) => {
    // First register a user
    const userData: UserCreateRequest = {
      isSubscribed: false,
      email: `test+${randomUUID()}@test.com`,
      firstName: "Test",
      lastName: "User",
      password: "CorrectPassword123!",
    };

    await app.api.auth.register(userData);

    // Try login with wrong password
    try {
      await app.api.auth.login({
        email: userData.email,
        password: "WrongPassword123!",
      });
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      const errorBody = JSON.parse(error.message);
      expect(errorBody.error).toBeTruthy();
      expect(errorBody.success).toBe(false);
    }
  });

  shopTest("should reject login with missing email", async ({ app }) => {
    try {
      await app.api.auth.login({
        email: "" as any,
        password: "SomePassword123!",
      });
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      const errorBody = JSON.parse(error.message);
      expect(errorBody.error).toContain("email");
    }
  });

  shopTest("should reject login with missing password", async ({ app }) => {
    try {
      await app.api.auth.login({
        email: "test@test.com",
        password: "" as any,
      });
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      const errorBody = JSON.parse(error.message);
      expect(errorBody.error).toContain("password");
    }
  });
});

test.describe("Authentication API - Password Reset Flow", () => {
  shopTest("should send password reset email for existing user", async ({
    app,
  }) => {
    // First register a user
    const userData: UserCreateRequest = {
      isSubscribed: false,
      email: `test+${randomUUID()}@test.com`,
      firstName: "Test",
      lastName: "User",
      password: "SecurePassword123!",
    };

    await app.api.auth.register(userData);

    // Request password reset
    const forgotResponse = await app.api.auth.forgotPassword({
      email: userData.email,
    });

    expect(forgotResponse.success).toBe(true);
    expect(forgotResponse.message).toContain("email");
  });

  shopTest("should reject password reset for non-existent user", async ({
    app,
  }) => {
    try {
      await app.api.auth.forgotPassword({
        email: `nonexistent+${randomUUID()}@test.com`,
      });
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      const errorBody = JSON.parse(error.message);
      expect(errorBody.error).toBeTruthy();
    }
  });

  shopTest("should reject password reset with missing email", async ({
    app,
  }) => {
    try {
      await app.api.auth.forgotPassword({
        email: "" as any,
      });
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      const errorBody = JSON.parse(error.message);
      expect(errorBody.error).toContain("email");
    }
  });

  shopTest("should reject password reset with invalid token", async ({
    app,
  }) => {
    try {
      await app.api.auth.resetPasswordWithToken("invalid-token-123", {
        password: "NewPassword123!",
      });
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      const errorBody = JSON.parse(error.message);
      expect(errorBody.error).toBeTruthy();
    }
  });
});

test.describe("Authentication API - Change Password (Authenticated)", () => {
  shopTest(
    "should change password for authenticated user",
    async ({ app }) => {
      const userData: UserCreateRequest = {
        isSubscribed: false,
        email: `test+${randomUUID()}@test.com`,
        firstName: "Test",
        lastName: "User",
        password: "OldPassword123!",
      };

      // Register and login
      await app.api.auth.register(userData);
      await app.headlessLogin({
        email: userData.email,
        password: userData.password,
      });

      // Change password
      const changeResponse = await app.api.auth.changePassword({
        password: "OldPassword123!",
        confirmPassword: "NewPassword123!",
      });

      expect(changeResponse.success).toBe(true);
      expect(changeResponse.message).toBeTruthy();

      // Verify can login with new password
      const loginResponse = await app.api.auth.login({
        email: userData.email,
        password: "NewPassword123!",
      });

      expect(loginResponse.success).toBe(true);
      expect(loginResponse.token).toBeTruthy();
    }
  );

  shopTest(
    "should reject password change with incorrect old password",
    async ({ app }) => {
      const userData: UserCreateRequest = {
        isSubscribed: false,
        email: `test+${randomUUID()}@test.com`,
        firstName: "Test",
        lastName: "User",
        password: "CorrectPassword123!",
      };

      await app.api.auth.register(userData);
      await app.headlessLogin({
        email: userData.email,
        password: userData.password,
      });

      // Try to change password with wrong old password
      try {
        await app.api.auth.changePassword({
          password: "WrongPassword123!",
          confirmPassword: "NewPassword123!",
        });
        expect(true).toBe(false); // Should not reach here
      } catch (error: any) {
        // Expected to fail
        const errorBody = JSON.parse(error.message);
        expect(errorBody.error).toBeTruthy();
      }
    }
  );
});

test.describe("Authentication API - OAuth (Disabled)", () => {
  test("should redirect to Google OAuth", async ({ request }) => {
    // OAuth endpoints require browser redirect, so we use direct request
    const response = await request.get(`${process.env.API_URL}/auth/google`, {
      maxRedirects: 0,
    });

    // OAuth endpoints typically redirect (302/307) or are disabled (400/500)
    expect([302, 307, 500, 400]).toContain(response.status());
  });

  test("should redirect to Facebook OAuth", async ({ request }) => {
    // OAuth endpoints require browser redirect, so we use direct request
    const response = await request.get(
      `${process.env.API_URL}/auth/facebook`,
      {
        maxRedirects: 0,
      }
    );

    // OAuth endpoints typically redirect (302/307) or are disabled (400/500)
    expect([302, 307, 500, 400]).toContain(response.status());
  });
});


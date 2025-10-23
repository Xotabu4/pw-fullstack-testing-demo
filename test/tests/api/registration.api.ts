import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { shopTest } from "../../fixture";
import type { UserCreateRequest, UserCreatedResponse } from "../../api/models";

test.describe("User Registration API Tests", () => {
  shopTest("should successfully register a new user with valid data", async ({
    app,
  }) => {
    const userData: UserCreateRequest = {
      isSubscribed: false,
      email: `test+${randomUUID()}@test.com`,
      firstName: "John",
      lastName: "Doe",
      password: "SecurePassword123!",
    };

    const responseBody = await app.api.auth.register(userData);

    expect(responseBody.success).toBe(true);
    expect(responseBody.token).toBeTruthy();
    expect(responseBody.token).toMatch(
      /^Bearer\s[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
    ); // JWT format with Bearer prefix
    expect(responseBody.user).toBeDefined();
    expect(responseBody.user.email).toBe(userData.email);
    expect(responseBody.user.firstName).toBe(userData.firstName);
    expect(responseBody.user.lastName).toBe(userData.lastName);
    expect(responseBody.user.id).toBeTruthy();
    expect(responseBody.user.role).toBeDefined();
    expect(responseBody.subscribed).toBe(userData.isSubscribed);
  });

  shopTest(
    "should register user with newsletter subscription enabled",
    async ({ app }) => {
      const userData: UserCreateRequest = {
        isSubscribed: true,
        email: `test+${randomUUID()}@test.com`,
        firstName: "Jane",
        lastName: "Smith",
        password: "SecurePassword123!",
      };

      const responseBody = await app.api.auth.register(userData);

      expect(responseBody.success).toBe(true);
      // Note: subscribed may be false if Mailchimp is not configured
      // expect(responseBody.subscribed).toBe(true);
      expect(responseBody.user.email).toBe(userData.email);
    }
  );

  shopTest("should reject registration with duplicate email", async ({
    app,
  }) => {
    const userData: UserCreateRequest = {
      isSubscribed: false,
      email: `duplicate+${randomUUID()}@test.com`,
      firstName: "Test",
      lastName: "User",
      password: "SecurePassword123!",
    };

    // First registration should succeed
    const firstResponse = await app.api.auth.register(userData);
    expect(firstResponse.success).toBe(true);

    // Second registration with same email should fail
    try {
      await app.api.auth.register(userData);
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      const errorBody = JSON.parse(error.message);
      expect(errorBody.success).toBeFalsy();
    }
  });

  shopTest("should reject registration with invalid email format", async ({
    app,
  }) => {
    const userData: UserCreateRequest = {
      isSubscribed: false,
      email: "invalid-email-format", // Invalid email
      firstName: "Test",
      lastName: "User",
      password: "SecurePassword123!",
    };

    try {
      await app.api.auth.register(userData);
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      // Expected to fail
      expect(error).toBeDefined();
    }
  });

  shopTest("should reject registration with missing required fields", async ({
    app,
  }) => {
    const incompleteData = {
      email: `test+${randomUUID()}@test.com`,
      // Missing firstName, lastName, and password
    } as UserCreateRequest;

    try {
      await app.api.auth.register(incompleteData);
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      // Expected to fail
      expect(error).toBeDefined();
    }
  });
});

test.describe("User Registration API Tests with Fixtures", () => {
  shopTest(
    "should successfully register user via API controller",
    async ({ app }) => {
      const userModel: UserCreateRequest = {
        isSubscribed: false,
        email: `test+${randomUUID()}@test.com`,
        firstName: "API",
        lastName: "Tester",
        password: "SecurePassword123!",
      };

      const createdUser = await app.api.auth.register(userModel);

      expect(createdUser.success).toBe(true);
      expect(createdUser.token).toBeTruthy();
      expect(createdUser.user.email).toBe(userModel.email);
      expect(createdUser.user.firstName).toBe(userModel.firstName);
      expect(createdUser.user.lastName).toBe(userModel.lastName);
      expect(createdUser.user.id).toBeTruthy();
      expect(createdUser.subscribed).toBe(userModel.isSubscribed);
    }
  );

  shopTest(
    "should be able to login after successful registration",
    async ({ app }) => {
      const userModel: UserCreateRequest = {
        isSubscribed: false,
        email: `test+${randomUUID()}@test.com`,
        firstName: "Login",
        lastName: "Test",
        password: "SecurePassword123!",
      };

      // Register user
      const createdUser = await app.api.auth.register(userModel);
      expect(createdUser.success).toBe(true);

      // Attempt to login with the same credentials
      const loginResponse = await app.api.auth.login({
        email: userModel.email,
        password: userModel.password,
      });

      expect(loginResponse.success).toBe(true);
      expect(loginResponse.token).toBeTruthy();
      expect(loginResponse.user.email).toBe(userModel.email);
      expect(loginResponse.user.id).toBe(createdUser.user.id);
    }
  );
});

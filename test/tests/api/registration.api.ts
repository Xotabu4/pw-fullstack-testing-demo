import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { shopTest } from "../../fixture";
import type { UserCreateRequest, UserCreatedResponse } from "../../api/models";
import { env } from "../../env";

test.describe("User Registration API Tests", () => {
  test("should successfully register a new user with valid data", async ({
    request,
  }) => {
    const userData: UserCreateRequest = {
      isSubscribed: false,
      email: `test+${randomUUID()}@test.com`,
      firstName: "John",
      lastName: "Doe",
      password: "SecurePassword123!",
    };

    const response = await request.post(
      `${env.API_URL}/auth/register`,
      {
        data: userData,
      }
    );

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody: UserCreatedResponse = await response.json();

    expect(responseBody.success).toBe(true);
    expect(responseBody.token).toBeTruthy();
    // API returns "Bearer <jwt>", not a bare JWT
    expect(responseBody.token).toMatch(
      /^Bearer\s+[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
    );
    expect(responseBody.user).toBeDefined();
    expect(responseBody.user.email).toBe(userData.email);
    expect(responseBody.user.firstName).toBe(userData.firstName);
    expect(responseBody.user.lastName).toBe(userData.lastName);
    expect(responseBody.user.id).toBeTruthy();
    expect(responseBody.user.role).toBeDefined();
    expect(responseBody.subscribed).toBe(userData.isSubscribed);
  });

  test("should register user with newsletter subscription enabled", async ({
    request,
  }) => {
    const userData: UserCreateRequest = {
      isSubscribed: true,
      email: `test+${randomUUID()}@test.com`,
      firstName: "Jane",
      lastName: "Smith",
      password: "SecurePassword123!",
    };

    const response = await request.post(
      `${env.API_URL}/auth/register`,
      {
        data: userData,
      }
    );

    expect(response.ok()).toBeTruthy();
    const responseBody: UserCreatedResponse = await response.json();

    expect(responseBody.success).toBe(true);
    expect(responseBody.subscribed).toBe(true);
    expect(responseBody.user.email).toBe(userData.email);
  });

  test("should reject registration with duplicate email", async ({
    request,
  }) => {
    const userData: UserCreateRequest = {
      isSubscribed: false,
      email: `duplicate+${randomUUID()}@test.com`,
      firstName: "Test",
      lastName: "User",
      password: "SecurePassword123!",
    };

    // First registration should succeed
    const firstResponse = await request.post(
      `${env.API_URL}/auth/register`,
      {
        data: userData,
      }
    );
    expect(firstResponse.ok()).toBeTruthy();

    // Second registration with same email should fail
    const secondResponse = await request.post(
      `${env.API_URL}/auth/register`,
      {
        data: userData,
      }
    );

    expect(secondResponse.ok()).toBeFalsy();
    expect(secondResponse.status()).toBeGreaterThanOrEqual(400);
    expect(secondResponse.status()).toBeLessThan(500);

    const errorBody = await secondResponse.json();
    expect(errorBody.success).toBeFalsy();
  });

  test("should reject registration with invalid email format", async ({
    request,
  }) => {
    const userData: UserCreateRequest = {
      isSubscribed: false,
      email: "invalid-email-format", // Invalid email
      firstName: "Test",
      lastName: "User",
      password: "SecurePassword123!",
    };

    const response = await request.post(
      `${env.API_URL}/auth/register`,
      {
        data: userData,
      }
    );

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });

  test("should reject registration with missing required fields", async ({
    request,
  }) => {
    const incompleteData = {
      email: `test+${randomUUID()}@test.com`,
      // Missing firstName, lastName, and password
    };

    const response = await request.post(
      `${env.API_URL}/auth/register`,
      {
        data: incompleteData,
      }
    );

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
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

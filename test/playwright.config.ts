import "dotenv/config";
import { env } from "./env";
import { defineConfig, devices } from "@playwright/test";
import { execSync } from "node:child_process";

const qaUsername = process.env.QA_USERNAME || execSync('git config user.name', { encoding: 'utf8' }).trim() || 'unknown';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: "90%",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    [
      "list",
      {
        printSteps: true,
      },
    ],
    ["html", { open: "never" }],
    ["blob", { outputFile: "test-results/blob.zip" }],
    [
      "@cyborgtests/reporter-playwright-reports-server",
      {
        // true by default. Use this if you need to skip this reporter for some cases (local executions for example)
        enabled: false, // For demo purposes
        /**
         * Your server url
         * @see https://github.com/CyborgTests/playwright-reports-server
         */
        // url: "https://overwhelming-jsandye-cyborg-tests-d6a8367f.koyeb.app",
        url: "http://localhost:3000/",
        // Set token if your server instance has authentication enabled
        // token: '1234',
        // Timeout for reporter HTTP requests to finish, default 60000ms, increase if you have slow server and big requests.
        requestTimeout: 60000,
        // Relative path to your blob. Required.
        reportPath: "test-results/blob.zip",
        // Any custom metadata to attach to this blob (strings)
        resultDetails: {
          versionUnderTest: "v1.0.0",
          testRun: "v1.0.0-regression-2",
        },
        // Automatically trigger HTML report generation after tests finish. Shards supported. false by default
        triggerReportGeneration: false,
      },
    ],
  ],
  use: {
    baseURL: env.FRONTEND_URL,
    headless: process.env.CI ? true : false,
  },
  projects: [
    {
      name: "e2e",
      testMatch: /.*\.e2e\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        headless: process.env.CI ? true : false,
        trace: "retain-on-failure",
        video: "retain-on-failure",
        screenshot: {
          mode: 'only-on-failure',
          fullPage: true,
        },
      },
    },
    {
      name: "api",
      testMatch: /.*\.api\.ts/,
      use: {
        headless: true,
        trace: "on",
        video: "off",
        screenshot: "off",
      },
    },
    {
      testMatch: /.*\.cyborg\.ts/,
      grep: new RegExp(`@${qaUsername}`),
      name: "cyborg",
      timeout: 0,
      workers: 1,
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        trace: "retain-on-failure",
        video: "retain-on-failure",
        screenshot: {
          mode: "on",
          fullPage: true,
        },
        headless: false,
      },
    },
  ],
});

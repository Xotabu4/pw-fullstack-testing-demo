import test from "@cyborgtests/test";
import { OWNER } from "../../tags";

test(
  "user registration should be successful",
  {
    annotation: [
      { type: "priority", description: "CRITICAL" },
    ],
    tag: [OWNER.SAM_ALTMAN],
  },
  async ({ page, manualStep }) => {
    await page.goto("/register");
    await manualStep("Navigate to the registration page");
    await manualStep("Fill in the registration form with valid data");
    await manualStep("Submit the form");
    await manualStep(
      "Verify the user is successfully registered and redirected to a welcome or account page"
    );
  }
);

test(
  "user login with valid credentials should be successful",
  {
    annotation: [
      { type: "priority", description: "CRITICAL" },
    ],
    tag: [OWNER.O_KHOTEMSKYI],
  },
  async ({ page, manualStep }) => {
    await page.goto("/login");
    await manualStep("Navigate to the login page");
    await manualStep("Enter valid email and password credentials");
    await manualStep("Submit the login form");
    await manualStep(
      "Verify the user is logged in and redirected to their account dashboard or homepage"
    );
  }
);
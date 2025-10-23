import test from "@cyborgtests/test";
import { OWNER } from "../../tags";

test(
  "homepage should load and display branding elements",
  {
    annotation: [
      {
        type: "objective",
        description:
          "Verify that the homepage loads correctly and displays essential branding elements",
      },
      { type: "priority", description: "CRITICAL" },
      { type: "bug", description: "http://jira.com/CS-123" },
    ],
    tag: [OWNER.O_KHOTEMSKYI],
  },
  async ({ page, manualStep }) => {
    await page.goto("/");
    await manualStep("Navigate to the homepage");
    await manualStep(
      "Observe the presence of the site logo and main navigation menu"
    );
    await manualStep(
      "Verify the homepage loads without errors, displaying the site logo and navigation menu prominently"
    );
  }
);

test(
  "responsive design should adapt correctly on mobile devices",
  {
    annotation: [
      {
        type: "objective",
        description:
          "Check that the website layout adapts correctly to mobile screen sizes",
      },
    ],
    tag: [OWNER.SAM_ALTMAN],
  },
  async ({ page, manualStep }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone viewport
    await page.goto("/");
    await manualStep(
      "Open the website on a mobile device or use browser developer tools to simulate a mobile viewport"
    );
    await manualStep(
      "Navigate through various pages (homepage, product listing, product detail, cart)"
    );
    await manualStep(
      "Verify the website layout adjusts appropriately for mobile screens, with readable text, accessible buttons, and functional navigation"
    );
  }
);

test(
  "search functionality should return relevant product results",
  {
    tag: [OWNER.O_KHOTEMSKYI],
  },
  async ({ page, manualStep }) => {
    await page.goto("/");
    await manualStep("Enter a product name or keyword into the search bar");
    await manualStep("Submit the search query");
    await manualStep(
      "Verify the search results page displays products matching the search criteria"
    );
  }
);



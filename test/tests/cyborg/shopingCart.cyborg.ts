import test from "@cyborgtests/test";
import { OWNER } from "../../tags";

test(
  "bdd: add to cart functionality should be successful",
  {
    tag: [OWNER.O_KHOTEMSKYI],
  },
  async ({ page, manualStep }) => {
    await page.goto("/product/cherry-tomatoes");
    await manualStep(
      "On a product detail page, select any required options (e.g., size, color)"
    );
    await manualStep("Click the 'Add to Cart' button");
    await manualStep("Navigate to the shopping cart page");
    await manualStep(
      "Verify the selected product appears in the cart with correct details and quantity"
    );
  }
);

test(
  "bdd: shopping cart quantity update should be successful",
  {
    tag: [OWNER.BILL_GATES],
  },
  async ({ page, manualStep }) => {
    await page.goto("/cart");
    await manualStep(
      "In the shopping cart, locate a product with a quantity selector"
    );
    await manualStep("Change the quantity value");
    await manualStep(
      "Verify the cart updates to reflect the new quantity and recalculates the total price accordingly"
    );
  }
);

test(
  "bdd: checkout process with empty cart should be prevented",
  {
    tag: [OWNER.BILL_GATES],
  },
  async ({ page, manualStep }) => {
    await page.goto("/cart");
    await manualStep("Navigate to the shopping cart page with no items added");
    await manualStep("Attempt to proceed to checkout");
    await manualStep(
      "Verify the system prevents checkout and displays a message indicating that the cart is empty"
    );
  }
);

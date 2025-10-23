import test from "@cyborgtests/test";
import { expect } from "@playwright/test";
import { OWNER } from "../../tags";

test(
  "products page should be displayed correctly",
  {
    tag: [OWNER.O_KHOTEMSKYI],
  },
  async ({ page, manualStep }) => {
    await page.goto("/shop/brand/Nizhyn");
    await expect(page.locator(".product-container")).toHaveCount(4);
    await manualStep("Verify that product images are displayed correctly");
    await manualStep("Verify that product details are displayed correctly");
    await manualStep("Verify that product price is displayed correctly");
  }
);

test(
  "product details page should be displayed correctly",
  {
    tag: [OWNER.O_KHOTEMSKYI],
  },
  async ({ page, manualStep }) => {
    await page.goto("/product/cherry-tomatoes");
    await expect(page.getByPlaceholder("Product Quantity")).toBeVisible();
    await expect(page.getByText("In stock")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Add To Bag" })
    ).toBeVisible();

    await manualStep(`Verify that product details are displayed correctly - 
      CHERRY TOMATOES
      cherry tomatoes, salt, sugar, greens, acetic acid, garlic, spices
      `);
    await manualStep(`Verify that product price is displayed correctly - $95`);
    await manualStep("Verify that product image is displayed correctly");
  }
);

test(
  "product in cart should be displayed correctly",
  {
    tag: [OWNER.O_KHOTEMSKYI],
  },
  async ({ page, manualStep }) => {
    await page.goto("/product/cherry-tomatoes");
    await page.getByRole("button", { name: "Add To Bag" }).click();
    await expect(
      page.getByRole("button", { name: "Proceed To Checkout" })
    ).toBeVisible();
    await manualStep("Verify that product is added to cart");
  }
);

test(
  "product listing should display products correctly",
  {
    tag: [OWNER.BILL_GATES],
  },
  async ({ page, manualStep }) => {
    await page.goto("/shop");
    await manualStep(
      "Navigate to a product category or the main product listing page"
    );
    await manualStep("Observe the list of products displayed");
    await manualStep(
      "Verify products are displayed with images, names, prices, and any relevant labels (e.g., 'New', 'Sale')"
    );
  }
);

test(
  "product detail view should display comprehensive information",
  {
    tag: [OWNER.SAM_ALTMAN],
  },
  async ({ page, manualStep }) => {
    await page.goto("/shop");
    await manualStep("Click on a product from the listing page");
    await manualStep("Observe the product detail page");
    await manualStep(
      "Verify the product detail page displays the product image, name, price, description, available sizes/colors, and an 'Add to Cart' button"
    );
  }
);

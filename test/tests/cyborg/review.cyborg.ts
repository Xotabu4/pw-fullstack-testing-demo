import { shopTest } from "../../fixture";

shopTest(
  `user can post review for product`,
  async ({ app: { home, shop, product, accountDetails }, newAdminUser, manualStep }) => {
    await home.header.openShop();
    await shop.openProductDetailsByName("CHERRY TOMATOES");

    await product.reviewComponent.add({
      title: "review title",
      comment: "review comment",
      stars: 4,
    });
    await product.reviewComponent.expectReviewAdded();
    await accountDetails.open();
    await accountDetails.expectMenuItemVisible("Reviews");
    await manualStep("New review appears in the admin dashboard");
  }
);

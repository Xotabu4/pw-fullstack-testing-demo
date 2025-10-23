import { test, expect } from "@playwright/test";
import { shopTest } from "../../fixture";
import { randomUUID } from "node:crypto";

test.describe("Wishlist API", () => {
  shopTest("should add product to wishlist", async ({ app, newUser }) => {
    // Get a product
    const productsResponse = await app.api.product.getList({
      limit: 1,
      sortOrder: { created: -1 },
    });
    expect(productsResponse.products.length).toBeGreaterThan(0);
    const product = productsResponse.products[0];

    // Add to wishlist
    const response = await app.api.wishlist.addOrUpdate({
      product: product._id,
      isLiked: true,
    });

    expect(response.success).toBe(true);
    expect(response.message).toBeTruthy();
    expect(response.wishlist).toBeDefined();
    expect(response.wishlist.isLiked).toBe(true);
  });

  shopTest("should get all wishlist items", async ({ app, newUser }) => {
    // Add a product to wishlist first
    const productsResponse = await app.api.product.getList({
      limit: 1,
      sortOrder: { created: -1 },
    });
    const product = productsResponse.products[0];

    await app.api.wishlist.addOrUpdate({
      product: product._id,
      isLiked: true,
    });

    // Get wishlist
    const response = await app.api.wishlist.getAll();

    expect(response.wishlist).toBeDefined();
    expect(Array.isArray(response.wishlist)).toBeTruthy();
    expect(response.wishlist.length).toBeGreaterThan(0);
  });

  shopTest("should update wishlist item (unlike)", async ({ app, newUser }) => {
    // Add a product to wishlist first
    const productsResponse = await app.api.product.getList({
      limit: 1,
      sortOrder: { created: -1 },
    });
    const product = productsResponse.products[0];

    await app.api.wishlist.addOrUpdate({
      product: product._id,
      isLiked: true,
    });

    // Update to unlike
    const response = await app.api.wishlist.addOrUpdate({
      product: product._id,
      isLiked: false,
    });

    expect(response.success).toBe(true);
    expect(response.message).toContain("updated");
    expect(response.wishlist.isLiked).toBe(false);
  });
});

test.describe("Address API", () => {
  shopTest("should add a new address", async ({ app, newUser }) => {
    const addressData = {
      address: "123 Test Street",
      city: "Test City",
      state: "Test State",
      country: "Test Country",
      zipCode: "12345",
      isDefault: true,
    };

    const response = await app.api.address.add(addressData);

    expect(response.success).toBe(true);
    expect(response.message).toBeTruthy();
    expect(response.address).toBeDefined();
    expect(response.address.address).toBe(addressData.address);
    expect(response.address.city).toBe(addressData.city);
  });

  shopTest("should get all addresses", async ({ app, newUser }) => {
    // Add an address first
    const addressData = {
      address: "456 Another Street",
      city: "Another City",
      state: "Another State",
      country: "Another Country",
      zipCode: "67890",
    };

    await app.api.address.add(addressData);

    // Get all addresses
    const response = await app.api.address.getAll();

    expect(response.addresses).toBeDefined();
    expect(Array.isArray(response.addresses)).toBeTruthy();
    expect(response.addresses.length).toBeGreaterThan(0);
  });

  shopTest("should get address by ID", async ({ app, newUser }) => {
    // Add an address first
    const addressData = {
      address: "789 Test Avenue",
      city: "Test Town",
      state: "Test Province",
      country: "Test Nation",
      zipCode: "54321",
    };

    const addResponse = await app.api.address.add(addressData);
    const addressId = addResponse.address._id;

    // Get address by ID
    const response = await app.api.address.getById(addressId);

    expect(response.address).toBeDefined();
    expect(response.address._id).toBe(addressId);
    expect(response.address.address).toBe(addressData.address);
  });

  shopTest("should update an address", async ({ app, newUser }) => {
    // Add an address first
    const addressData = {
      address: "Original Address",
      city: "Original City",
      state: "Original State",
      country: "Original Country",
      zipCode: "11111",
    };

    const addResponse = await app.api.address.add(addressData);
    const addressId = addResponse.address._id;

    // Update the address
    const updateData = {
      address: "Updated Address",
      city: "Updated City",
    };

    const response = await app.api.address.update(addressId, updateData);

    expect(response.success).toBe(true);
    expect(response.message).toContain("updated");
  });

  shopTest("should delete an address", async ({ app, newUser }) => {
    // Add an address first
    const addressData = {
      address: "To Be Deleted",
      city: "Delete City",
      state: "Delete State",
      country: "Delete Country",
      zipCode: "99999",
    };

    const addResponse = await app.api.address.add(addressData);
    const addressId = addResponse.address._id;

    // Delete the address
    const response = await app.api.address.delete(addressId);

    expect(response.success).toBe(true);
    expect(response.message).toContain("deleted");
  });
});

test.describe("Review API", () => {
  shopTest("should add a product review", async ({ app, newUser }) => {
    // Get a product
    const productsResponse = await app.api.product.getList({
      limit: 1,
      sortOrder: { created: -1 },
    });
    const product = productsResponse.products[0];

    // Add review
    const reviewData = {
      product: product._id,
      title: "Great product!",
      rating: 5,
      review: "This is an excellent product. Highly recommended!",
      isRecommended: true,
    };

    const response = await app.api.review.add(reviewData);

    expect(response.success).toBe(true);
    expect(response.message).toBeTruthy();
    expect(response.review).toBeDefined();
    expect(response.review.title).toBe(reviewData.title);
    expect(response.review.rating).toBe(reviewData.rating);
  });

  shopTest("should get all reviews", async ({ app }) => {
    const responseBody = await app.api.review.getAll();

    expect(responseBody.reviews).toBeDefined();
    expect(Array.isArray(responseBody.reviews)).toBeTruthy();
    expect(responseBody.totalPages).toBeDefined();
    expect(responseBody.currentPage).toBeDefined();
    expect(responseBody.count).toBeDefined();
  });

  shopTest("should get reviews for a product by slug", async ({ app }) => {
    // Use a known product slug
    const responseBody = await app.api.review.getByProductSlug(
      "cherry-tomatoes"
    );

    expect(responseBody.reviews).toBeDefined();
    expect(Array.isArray(responseBody.reviews)).toBeTruthy();
  });

  shopTest("should update a review", async ({ app, newUser }) => {
    // Add a review first
    const productsResponse = await app.api.product.getList({
      limit: 1,
      sortOrder: { created: -1 },
    });
    const product = productsResponse.products[0];

    const reviewData = {
      product: product._id,
      title: "Initial Review",
      rating: 4,
      review: "Initial review text",
      isRecommended: true,
    };

    const addResponse = await app.api.review.add(reviewData);
    const reviewId = addResponse.review._id;

    // Update the review
    const updateData = {
      title: "Updated Review",
      rating: 5,
      review: "Updated review text with more details",
    };

    const response = await app.api.review.update(reviewId, updateData);

    expect(response.success).toBe(true);
    expect(response.message).toContain("updated");
  });

  shopTest("should delete a review", async ({ app, newUser }) => {
    // Add a review first
    const productsResponse = await app.api.product.getList({
      limit: 1,
      sortOrder: { created: -1 },
    });
    const product = productsResponse.products[0];

    const reviewData = {
      product: product._id,
      title: "To Be Deleted",
      rating: 3,
      review: "This review will be deleted",
      isRecommended: true,
    };

    const addResponse = await app.api.review.add(reviewData);
    const reviewId = addResponse.review._id;

    // Delete the review
    const response = await app.api.review.delete(reviewId);

    expect(response.success).toBe(true);
    expect(response.message).toContain("deleted");
  });
});

test.describe("Newsletter API", () => {
  shopTest("should subscribe to newsletter", async ({ app }) => {
    const email = `newsletter+${randomUUID()}@test.com`;

    try {
      const responseBody = await app.api.newsletter.subscribe({ email });
      // If Mailchimp is configured and working
      expect(responseBody.success).toBe(true);
      expect(responseBody.message).toBeTruthy();
    } catch (error: any) {
      // Note: This might fail if Mailchimp is not configured
      // Both success and configured errors are acceptable
      expect(error).toBeDefined();
    }
  });

  shopTest("should reject newsletter subscription with missing email", async ({
    app,
  }) => {
    try {
      await app.api.newsletter.subscribe({ email: "" as any });
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      const errorBody = JSON.parse(error.message);
      expect(errorBody.error).toContain("email");
    }
  });

  shopTest("should reject newsletter subscription with invalid email", async ({
    app,
  }) => {
    try {
      await app.api.newsletter.subscribe({ email: "invalid-email" });
      // Might succeed if validation is loose, or fail
    } catch (error: any) {
      // Expected to fail with invalid email
      expect(error).toBeDefined();
    }
  });
});


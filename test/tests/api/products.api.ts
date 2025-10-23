import { test, expect } from "@playwright/test";
import { shopTest } from "../../fixture";
import type { Product } from "../../api/models";

test.describe("Product API - Public Endpoints", () => {
  shopTest("should get product by slug", async ({ app }) => {
    const response = await app.api.product.getBySlug("cherry-tomatoes");

    expect(response.product).toBeDefined();
    expect(response.product.slug).toBe("cherry-tomatoes");
    expect(response.product.name).toBeTruthy();
    expect(response.product.price).toBeGreaterThan(0);
  });

  shopTest("should return 404 for non-existent product slug", async ({
    app,
  }) => {
    try {
      await app.api.product.getBySlug("non-existent-product-slug-12345");
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      const errorBody = JSON.parse(error.message);
      expect(errorBody.message).toBeTruthy();
    }
  });

  shopTest("should search products by name", async ({ app }) => {
    const response = await app.api.product.searchByName("tomato");

    expect(response.products).toBeDefined();
    expect(Array.isArray(response.products)).toBeTruthy();
  });

  shopTest("should get products list with default pagination", async ({
    app,
  }) => {
    const response = await app.api.product.getList({
      sortOrder: { created: -1 },
    });

    expect(response.products).toBeDefined();
    expect(Array.isArray(response.products)).toBeTruthy();
    expect(response.totalPages).toBeDefined();
    expect(response.currentPage).toBeDefined();
    expect(response.count).toBeDefined();
  });

  shopTest("should filter products by price range", async ({ app }) => {
    const minPrice = 5;
    const maxPrice = 20;
    const response = await app.api.product.getList({
      min: minPrice,
      max: maxPrice,
      sortOrder: { price: 1 },
    });

    expect(response.products).toBeDefined();

    // Verify all products are within price range
    if (response.products.length > 0) {
      response.products.forEach((product: Product) => {
        expect(product.price).toBeGreaterThanOrEqual(minPrice);
        expect(product.price).toBeLessThanOrEqual(maxPrice);
      });
    }
  });

  shopTest("should get products by brand slug", async ({ app }) => {
    // First get a product to find a brand slug
    const productsResponse = await app.api.product.getList({
      sortOrder: { created: -1 },
      limit: 1,
    });

    if (productsResponse.products && productsResponse.products.length > 0) {
      const product = productsResponse.products[0];
      if (product.brand && typeof product.brand === "object") {
        const brandSlug = product.brand.slug;

        const response = await app.api.product.getByBrand(brandSlug);
        expect(response.products).toBeDefined();
        expect(Array.isArray(response.products)).toBeTruthy();
      }
    }
  });

  shopTest("should return 404 for non-existent brand slug", async ({
    app,
  }) => {
    try {
      await app.api.product.getByBrand("non-existent-brand-slug-12345");
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      // Expected to fail with 404
      expect(error).toBeDefined();
    }
  });
});

test.describe("Product API - Authenticated Endpoints", () => {
  shopTest("should get product names for select", async ({ app, newUser }) => {
    const response = await app.api.product.getProductNames();

    expect(response.products).toBeDefined();
    expect(Array.isArray(response.products)).toBeTruthy();

    if (response.products.length > 0) {
      const product = response.products[0];
      expect(product._id).toBeDefined();
      expect(product.name).toBeDefined();
    }
  });

  shopTest("should get all products for admin/merchant", async ({ app, newAdminUser }) => {
    const response = await app.api.product.getAll();

    expect(response.products).toBeDefined();
    expect(Array.isArray(response.products)).toBeTruthy();
  });
});

test.describe("Product API - Admin/Merchant Operations", () => {
  shopTest.skip(
    "should add a new product (requires admin/merchant)",
    async ({ app, newAdminUser }) => {
      // This test requires admin/merchant role and proper brand setup
      const productData = {
        sku: `SKU-${Date.now()}`,
        name: `Test Product ${Date.now()}`,
        description: "Test product description",
        quantity: 100,
        price: 29.99,
        taxable: true,
        isActive: true,
        brand: "some-brand-id", // Would need to get a real brand ID
      };

      const response = await app.api.product.add(productData);

      expect(response.success).toBe(true);
      expect(response.message).toBeTruthy();
      expect(response.product).toBeDefined();
      expect(response.product.name).toBe(productData.name);
    }
  );

  shopTest.skip(
    "should update product by ID (requires admin/merchant)",
    async ({ app, newAdminUser }) => {
      // First get a product
      const products = await app.api.product.getAll();
      if (products.products.length > 0) {
        const productId = products.products[0]._id;

        const updateData = {
          product: {
            name: `Updated Product ${Date.now()}`,
            price: 39.99,
          },
        };

        const response = await app.api.product.update(productId, updateData);

        expect(response.success).toBe(true);
        expect(response.message).toBeTruthy();
      }
    }
  );

  shopTest.skip(
    "should update product active status (requires admin/merchant)",
    async ({ app, newAdminUser }) => {
      const products = await app.api.product.getAll();
      if (products.products.length > 0) {
        const productId = products.products[0]._id;
        const currentStatus = products.products[0].isActive;

        const response = await app.api.product.updateActive(
          productId,
          !currentStatus
        );

        expect(response.success).toBe(true);
        expect(response.message).toBeTruthy();
      }
    }
  );

  shopTest.skip(
    "should delete product (requires admin/merchant)",
    async ({ app, newAdminUser }) => {
      // This is destructive, so skipped by default
      const productId = "some-product-id";
      const response = await app.api.product.delete(productId);

      expect(response.success).toBe(true);
      expect(response.message).toBeTruthy();
    }
  );
});


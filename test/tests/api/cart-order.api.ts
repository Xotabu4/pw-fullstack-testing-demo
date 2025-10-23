import { test, expect } from "@playwright/test";
import { shopTest } from "../../fixture";
import type { CartItem, Product } from "../../api/models";

test.describe("Cart API - Basic Operations", () => {
  shopTest("should create a cart with products", async ({ app, newUser }) => {
    // First get a product
    const productsResponse = await app.api.product.getList({
      limit: 1,
      sortOrder: { created: -1 },
    });
    expect(productsResponse.products).toBeDefined();
    expect(productsResponse.products.length).toBeGreaterThan(0);

    const product = productsResponse.products[0];

    const cartData = {
      products: [
        {
          product: product._id,
          quantity: 2,
          purchasePrice: product.price,
          totalPrice: product.price * 2,
          priceWithTax: product.price * 2 * 1.1, // Assuming 10% tax
          totalTax: product.price * 2 * 0.1,
          status: "Not processed",
        },
      ],
    };

    const response = await app.api.cart.add(cartData);

    expect(response.success).toBe(true);
    expect(response.cartId).toBeTruthy();
  });

  shopTest("should add product to existing cart", async ({ app, newUser }) => {
    // Create a cart first
    const productsResponse = await app.api.product.getList({
      limit: 2,
      sortOrder: { created: -1 },
    });
    const product1 = productsResponse.products[0];
    const product2 = productsResponse.products[1];

    const cartData = {
      products: [
        {
          product: product1._id,
          quantity: 1,
          purchasePrice: product1.price,
          totalPrice: product1.price,
          priceWithTax: product1.price * 1.1,
          totalTax: product1.price * 0.1,
          status: "Not processed",
        },
      ],
    };

    const cartResponse = await app.api.cart.add(cartData);
    const cartId = cartResponse.cartId;

    // Add another product to the cart
    const addProductResponse = await app.api.cart.addProduct(cartId, {
      product: {
        product: product2._id,
        quantity: 1,
        purchasePrice: product2.price,
        totalPrice: product2.price,
        priceWithTax: product2.price * 1.1,
        totalTax: product2.price * 0.1,
        status: "Not processed",
      },
    });

    expect(addProductResponse.success).toBe(true);
  });

  shopTest("should delete product from cart", async ({ app, newUser }) => {
    // Create a cart with products
    const productsResponse = await app.api.product.getList({
      limit: 2,
      sortOrder: { created: -1 },
    });
    const product1 = productsResponse.products[0];
    const product2 = productsResponse.products[1];

    const cartData = {
      products: [
        {
          product: product1._id,
          quantity: 1,
          purchasePrice: product1.price,
          totalPrice: product1.price,
          priceWithTax: product1.price * 1.1,
          totalTax: product1.price * 0.1,
          status: "Not processed",
        },
        {
          product: product2._id,
          quantity: 1,
          purchasePrice: product2.price,
          totalPrice: product2.price,
          priceWithTax: product2.price * 1.1,
          totalTax: product2.price * 0.1,
          status: "Not processed",
        },
      ],
    };

    const cartResponse = await app.api.cart.add(cartData);
    const cartId = cartResponse.cartId;

    // Delete a product from cart
    const deleteResponse = await app.api.cart.deleteProduct(
      cartId,
      product1._id
    );

    expect(deleteResponse.success).toBe(true);
  });

  shopTest("should delete entire cart", async ({ app, newUser }) => {
    // Create a cart
    const productsResponse = await app.api.product.getList({
      limit: 1,
      sortOrder: { created: -1 },
    });
    const product = productsResponse.products[0];

    const cartData = {
      products: [
        {
          product: product._id,
          quantity: 1,
          purchasePrice: product.price,
          totalPrice: product.price,
          priceWithTax: product.price * 1.1,
          totalTax: product.price * 0.1,
          status: "Not processed",
        },
      ],
    };

    const cartResponse = await app.api.cart.add(cartData);
    const cartId = cartResponse.cartId;

    // Delete the cart
    const deleteResponse = await app.api.cart.delete(cartId);

    expect(deleteResponse.success).toBe(true);
  });
});

test.describe("Order API - Order Management", () => {
  shopTest("should create an order from cart", async ({ app, newUser }) => {
    // Create a cart first
    const productsResponse = await app.api.product.getList({
      limit: 1,
      sortOrder: { created: -1 },
    });
    const product = productsResponse.products[0];

    const cartData = {
      products: [
        {
          product: product._id,
          quantity: 1,
          purchasePrice: product.price,
          totalPrice: product.price,
          priceWithTax: product.price * 1.1,
          totalTax: product.price * 0.1,
          status: "Not processed",
        },
      ],
    };

    const cartResponse = await app.api.cart.add(cartData);
    const cartId = cartResponse.cartId;

    // Create order
    const orderResponse = await app.api.order.add({
      cartId: cartId,
      total: product.price * 1.1,
    });

    expect(orderResponse.success).toBe(true);
    expect(orderResponse.message).toBeTruthy();
    expect(orderResponse.order._id).toBeTruthy();
  });

  shopTest("should get user's orders", async ({ app, newUser }) => {
    // Create an order first
    const productsResponse = await app.api.product.getList({
      limit: 1,
      sortOrder: { created: -1 },
    });
    const product = productsResponse.products[0];

    const cartData = {
      products: [
        {
          product: product._id,
          quantity: 1,
          purchasePrice: product.price,
          totalPrice: product.price,
          priceWithTax: product.price * 1.1,
          totalTax: product.price * 0.1,
          status: "Not processed",
        },
      ],
    };

    const cartResponse = await app.api.cart.add(cartData);
    await app.api.order.add({
      cartId: cartResponse.cartId,
      total: product.price * 1.1,
    });

    // Get user's orders
    const ordersResponse = await app.api.order.getMyOrders();

    expect(ordersResponse.orders).toBeDefined();
    expect(Array.isArray(ordersResponse.orders)).toBeTruthy();
    expect(ordersResponse.orders.length).toBeGreaterThan(0);
    expect(ordersResponse.totalPages).toBeDefined();
    expect(ordersResponse.currentPage).toBeDefined();
    expect(ordersResponse.count).toBeDefined();
  });

  shopTest("should get order by ID", async ({ app, newUser }) => {
    // Create an order first
    const productsResponse = await app.api.product.getList({
      limit: 1,
      sortOrder: { created: -1 },
    });
    const product = productsResponse.products[0];

    const cartData = {
      products: [
        {
          product: product._id,
          quantity: 1,
          purchasePrice: product.price,
          totalPrice: product.price,
          priceWithTax: product.price * 1.1,
          totalTax: product.price * 0.1,
          status: "Not processed",
        },
      ],
    };

    const cartResponse = await app.api.cart.add(cartData);
    const orderResponse = await app.api.order.add({
      cartId: cartResponse.cartId,
      total: product.price * 1.1,
    });

    const orderId = orderResponse.order._id;

    // Get order by ID
    const orderDetailsResponse = await app.api.order.getById(orderId);

    expect(orderDetailsResponse.order).toBeDefined();
    expect(orderDetailsResponse.order._id).toBe(orderId);
    expect(orderDetailsResponse.order.total).toBeGreaterThan(0);
  });

  shopTest("should search for order by ID", async ({ app, newUser }) => {
    // Create an order first
    const productsResponse = await app.api.product.getList({
      limit: 1,
      sortOrder: { created: -1 },
    });
    const product = productsResponse.products[0];

    const cartData = {
      products: [
        {
          product: product._id,
          quantity: 1,
          purchasePrice: product.price,
          totalPrice: product.price,
          priceWithTax: product.price * 1.1,
          totalTax: product.price * 0.1,
          status: "Not processed",
        },
      ],
    };

    const cartResponse = await app.api.cart.add(cartData);
    const orderResponse = await app.api.order.add({
      cartId: cartResponse.cartId,
      total: product.price * 1.1,
    });

    const orderId = orderResponse.order._id;

    // Search for order
    const searchResponse = await app.api.order.search(orderId);

    expect(searchResponse.orders).toBeDefined();
    expect(Array.isArray(searchResponse.orders)).toBeTruthy();
  });

  shopTest("should cancel an order", async ({ app, newUser }) => {
    // Create an order first
    const productsResponse = await app.api.product.getList({
      limit: 1,
      sortOrder: { created: -1 },
    });
    const product = productsResponse.products[0];

    const cartData = {
      products: [
        {
          product: product._id,
          quantity: 1,
          purchasePrice: product.price,
          totalPrice: product.price,
          priceWithTax: product.price * 1.1,
          totalTax: product.price * 0.1,
          status: "Not processed",
        },
      ],
    };

    const cartResponse = await app.api.cart.add(cartData);
    const orderResponse = await app.api.order.add({
      cartId: cartResponse.cartId,
      total: product.price * 1.1,
    });

    const orderId = orderResponse.order._id;

    // Cancel the order
    const cancelResponse = await app.api.order.cancel(orderId);

    expect(cancelResponse.success).toBe(true);
  });
});

test.describe("Order API - Pagination", () => {
  shopTest(
    "should get orders with custom pagination parameters",
    async ({ app, newUser }) => {
      // Create multiple orders
      const productsResponse = await app.api.product.getList({
        limit: 1,
        sortOrder: { created: -1 },
      });
      const product = productsResponse.products[0];

      for (let i = 0; i < 3; i++) {
        const cartData = {
          products: [
            {
              product: product._id,
              quantity: 1,
              purchasePrice: product.price,
              totalPrice: product.price,
              priceWithTax: product.price * 1.1,
              totalTax: product.price * 0.1,
              status: "Not processed",
            },
          ],
        };

        const cartResponse = await app.api.cart.add(cartData);
        await app.api.order.add({
          cartId: cartResponse.cartId,
          total: product.price * 1.1,
        });
      }

      // Get orders with pagination
      const ordersResponse = await app.api.order.getMyOrders({
        page: 1,
        limit: 2,
      });

      expect(ordersResponse.orders).toBeDefined();
      expect(ordersResponse.currentPage).toBe(1);
      expect(ordersResponse.orders.length).toBeLessThanOrEqual(2);
    }
  );
});


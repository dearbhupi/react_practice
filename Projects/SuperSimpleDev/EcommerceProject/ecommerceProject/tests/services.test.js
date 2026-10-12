import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import axios from "axios";
import {
  addCartItem,
  getCartItems,
  updateCartItem,
} from "../src/services/cartService.js";
import {
  getDeliveryOptions,
  getPaymentSummary,
  placeOrder,
} from "../src/services/checkoutService.js";
import { getOrder, getOrders } from "../src/services/ordersService.js";
import { getProducts } from "../src/services/productsService.js";
import formatMoney from "../src/utils/money.js";

const originalAdapter = axios.defaults.adapter;
let lastRequest;

function mockResponse(data) {
  axios.defaults.adapter = async (config) => {
    lastRequest = config;
    return {
      data,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
}

afterEach(() => {
  axios.defaults.adapter = originalAdapter;
  lastRequest = undefined;
});

test("product service searches and returns all products when search is empty", async () => {
  const products = [{ id: "p-1" }];
  mockResponse(products);

  assert.deepEqual(await getProducts("wireless"), products);
  assert.equal(lastRequest.url, "/api/products");
  assert.deepEqual(lastRequest.params, { search: "wireless" });

  mockResponse(products);
  await getProducts("");
  assert.equal(lastRequest.params, undefined);
});

test("product service rejects an unexpected response shape", async () => {
  mockResponse({ products: [] });
  await assert.rejects(getProducts(""), /response must be an array/);
});

test("cart service loads, adds, and updates cart items", async () => {
  const items = [{ productId: "p-1", quantity: 2 }];
  mockResponse(items);

  assert.deepEqual(await getCartItems(), items);
  assert.equal(lastRequest.url, "/api/cart-items?expand=product");

  mockResponse(null);
  await addCartItem("p-1", 2);
  assert.equal(lastRequest.method, "post");
  assert.deepEqual(JSON.parse(lastRequest.data), {
    productId: "p-1",
    quantity: 2,
  });

  mockResponse(null);
  await updateCartItem("p-1", { deliveryOptionId: "2" });
  assert.equal(lastRequest.url, "/api/cart-items/p-1");
  assert.equal(lastRequest.method, "put");
});

test("checkout service reads delivery options and payment totals then submits orders", async () => {
  mockResponse([{ id: "1", estimatedDeliveryTimeMs: 123 }]);
  const options = await getDeliveryOptions();
  assert.equal(options[0].id, "1");
  assert.equal(
    lastRequest.url,
    "/api/delivery-options?expand=estimatedDeliveryTime",
  );

  const summary = {
    totalItems: 2,
    productCostCents: 2000,
    shippingCostCents: 500,
    totalCostBeforeTaxCents: 2500,
    taxCents: 250,
    totalCostCents: 2750,
  };
  mockResponse(summary);
  assert.deepEqual(await getPaymentSummary(), summary);

  mockResponse({ totalItems: "2" });
  await assert.rejects(getPaymentSummary(), /response is invalid/);

  mockResponse(null);
  await placeOrder();
  assert.equal(lastRequest.url, "/api/orders");
  assert.equal(lastRequest.method, "post");
});

test("orders service loads expanded order history", async () => {
  const orders = [{ id: "order-1", products: [] }];
  mockResponse(orders);

  assert.deepEqual(await getOrders(), orders);
  assert.equal(lastRequest.url, "/api/orders?expand=products");

  mockResponse(null);
  await assert.rejects(getOrders(), /response must be an array/);
});

test("order service loads one expanded order for tracking", async () => {
  const order = { id: "order-1", products: [{ productId: "p-1" }] };
  mockResponse(order);

  assert.deepEqual(await getOrder("order-1"), order);
  assert.equal(lastRequest.url, "/api/orders/order-1?expand=products");

  await assert.rejects(getOrder(""), /order ID is required/);

  mockResponse({ id: "order-1" });
  await assert.rejects(getOrder("order-1"), /response is invalid/);
});

test("money formatter renders cents as dollars", () => {
  assert.equal(formatMoney(0), "$0.00");
  assert.equal(formatMoney(1234), "$12.34");
});

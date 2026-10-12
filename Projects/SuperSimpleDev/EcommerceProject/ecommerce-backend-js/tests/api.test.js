import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { once } from 'node:events';

const originalWorkingDirectory = process.cwd();
const testWorkingDirectory = await mkdtemp(
  path.join(tmpdir(), 'ecommerce-api-test-'),
);
process.chdir(testWorkingDirectory);

const [
  { default: app },
  { sequelize },
  { Product },
  { DeliveryOption },
  { Order },
  { initializeDatabase },
] =
  await Promise.all([
    import('../app.js'),
    import('../models/index.js'),
    import('../models/Product.js'),
    import('../models/DeliveryOption.js'),
    import('../models/Order.js'),
    import('../initializeDatabase.js'),
  ]);
const { defaultProducts } = await import('../defaultData/defaultProducts.js');
const { defaultCart } = await import('../defaultData/defaultCart.js');

const productIds = {
  mouse: '0cf22c70-b90e-4e6b-9371-64f0671bc101',
  keyboard: '0cf22c70-b90e-4e6b-9371-64f0671bc102',
  shirt: '0cf22c70-b90e-4e6b-9371-64f0671bc103',
};

let server;
let baseUrl;

/** Sends a JSON request to the test server and parses its response. */
async function request(route, options = {}) {
  const response = await fetch(`${baseUrl}${route}`, {
    ...options,
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  return {
    status: response.status,
    data: response.status === 204 ? null : await response.json(),
  };
}

/** Restores a deterministic catalog and shipping configuration for each test. */
async function seedTestData() {
  await sequelize.sync({ force: true });
  await Product.bulkCreate([
    {
      id: productIds.mouse,
      image: 'images/mouse.png',
      name: 'Wireless Mouse',
      rating: { stars: 4.5, count: 12 },
      priceCents: 1000,
      keywords: ['wireless', 'computer', 'mouse'],
    },
    {
      id: productIds.keyboard,
      image: 'images/keyboard.png',
      name: 'Wireless Keyboard',
      rating: { stars: 4, count: 8 },
      priceCents: 2000,
      keywords: ['wireless', 'computer', 'keyboard'],
    },
    {
      id: productIds.shirt,
      image: 'images/shirt.png',
      name: 'Cotton T-Shirt',
      rating: { stars: 5, count: 3 },
      priceCents: 1500,
      keywords: ['clothing', 'shirt'],
    },
  ]);
  await DeliveryOption.bulkCreate([
    { id: '1', deliveryDays: 7, priceCents: 0 },
    { id: '2', deliveryDays: 3, priceCents: 500 },
  ]);
}

describe('ecommerce API', () => {
  before(async () => {
    await sequelize.sync({ force: true });
    server = app.listen(0);
    await once(server, 'listening');
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  beforeEach(seedTestData);

  after(async () => {
    if (server) {
      server.close();
      await once(server, 'close');
    }
    await sequelize.close();
    process.chdir(originalWorkingDirectory);
    await rm(testWorkingDirectory, { recursive: true, force: true });
  });

  it('filters products progressively and restores all products when search is cleared', async () => {
    const allProducts = await request('/api/products');
    const narrow = await request('/api/products?search=wireless%20m');
    const broadened = await request('/api/products?search=wireless');
    const cleared = await request('/api/products?search=');

    assert.equal(allProducts.status, 200);
    assert.equal(narrow.data.length, 1);
    assert.equal(broadened.data.length, 2);
    assert.equal(cleared.data.length, allProducts.data.length);
    assert.deepEqual(
      (await request('/api/products?search=')).data.map(({ id }) => id),
      allProducts.data.map(({ id }) => id),
    );
  });

  it('returns delivery options with estimated delivery dates when expanded', async () => {
    const result = await request(
      '/api/delivery-options?expand=estimatedDeliveryTime',
    );

    assert.equal(result.status, 200);
    assert.equal(result.data.length, 2);
    assert.ok(result.data[0].estimatedDeliveryTimeMs > Date.now());
  });

  it('validates, adds, expands, updates, and deletes cart items', async () => {
    const badQuantity = await request('/api/cart-items', {
      method: 'POST',
      body: JSON.stringify({ productId: productIds.mouse, quantity: 11 }),
    });
    assert.equal(badQuantity.status, 400);

    const created = await request('/api/cart-items', {
      method: 'POST',
      body: JSON.stringify({ productId: productIds.mouse, quantity: 2 }),
    });
    assert.equal(created.status, 201);

    const incremented = await request('/api/cart-items', {
      method: 'POST',
      body: JSON.stringify({ productId: productIds.mouse, quantity: 1 }),
    });
    assert.equal(incremented.data.quantity, 3);

    const expanded = await request('/api/cart-items?expand=product');
    assert.equal(expanded.data[0].product.name, 'Wireless Mouse');

    const updated = await request(`/api/cart-items/${productIds.mouse}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity: 2, deliveryOptionId: '2' }),
    });
    assert.equal(updated.data.quantity, 2);
    assert.equal(updated.data.deliveryOptionId, '2');

    const deleted = await request(`/api/cart-items/${productIds.mouse}`, {
      method: 'DELETE',
    });
    assert.equal(deleted.status, 204);
    assert.deepEqual((await request('/api/cart-items')).data, []);
  });

  it('calculates product, shipping, tax, and grand totals', async () => {
    await request('/api/cart-items', {
      method: 'POST',
      body: JSON.stringify({ productId: productIds.mouse, quantity: 2 }),
    });
    await request(`/api/cart-items/${productIds.mouse}`, {
      method: 'PUT',
      body: JSON.stringify({ deliveryOptionId: '2' }),
    });

    const summary = await request('/api/payment-summary');
    assert.equal(summary.data.totalItems, 2);
    assert.equal(summary.data.productCostCents, 2000);
    assert.equal(summary.data.shippingCostCents, 500);
    assert.equal(summary.data.totalCostBeforeTaxCents, 2500);
    assert.equal(summary.data.taxCents, 250);
    assert.equal(summary.data.totalCostCents, 2750);
  });

  it('rejects an empty cart and creates orders while clearing non-empty carts', async () => {
    const emptyOrder = await request('/api/orders', { method: 'POST' });
    assert.equal(emptyOrder.status, 400);

    await request('/api/cart-items', {
      method: 'POST',
      body: JSON.stringify({ productId: productIds.keyboard, quantity: 2 }),
    });
    const placed = await request('/api/orders', { method: 'POST' });
    assert.equal(placed.status, 201);
    assert.equal(placed.data.products[0].quantity, 2);
    assert.deepEqual((await request('/api/cart-items')).data, []);

    const orderList = await request('/api/orders?expand=products');
    assert.equal(orderList.data.length, 1);
    assert.equal(orderList.data[0].products[0].product.name, 'Wireless Keyboard');

    const orderDetails = await request(
      `/api/orders/${placed.data.id}?expand=products`,
    );
    assert.equal(orderDetails.status, 200);
    assert.equal(orderDetails.data.products[0].product.id, productIds.keyboard);
  });

  it('reports a missing order and missing cart item', async () => {
    assert.equal(
      (await request('/api/orders/not-an-order-id')).status,
      404,
    );
    assert.equal(
      (
        await request(`/api/cart-items/${productIds.mouse}`, {
          method: 'DELETE',
        })
      ).status,
      404,
    );
  });

  it('restores the starter dataset through the reset endpoint', async () => {
    const result = await request('/api/reset', { method: 'POST' });
    assert.equal(result.status, 204);
    assert.equal((await request('/api/products')).data.length, defaultProducts.length);
    assert.equal((await request('/api/cart-items')).data.length, defaultCart.length);
  });

  it('clears order history on startup without reseeding sample orders', async () => {
    await Order.create({
      orderTimeMs: Date.now(),
      totalCostCents: 1000,
      products: [{ productId: productIds.mouse, quantity: 1 }],
    });
    assert.equal(await Order.count(), 1);

    await initializeDatabase();

    assert.equal(await Order.count(), 0);
    assert.equal(await Product.count(), 3);
  });

  it('seeds the catalog on first startup but leaves order history empty', async () => {
    await sequelize.sync({ force: true });

    await initializeDatabase();

    assert.equal(await Product.count(), defaultProducts.length);
    assert.equal(await Order.count(), 0);
  });
});

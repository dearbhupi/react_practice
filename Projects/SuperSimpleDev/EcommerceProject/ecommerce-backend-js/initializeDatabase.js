import { sequelize } from './models/index.js';
import { Product } from './models/Product.js';
import { DeliveryOption } from './models/DeliveryOption.js';
import { CartItem } from './models/CartItem.js';
import { Order } from './models/Order.js';
import { defaultProducts } from './defaultData/defaultProducts.js';
import { defaultDeliveryOptions } from './defaultData/defaultDeliveryOptions.js';
import { defaultCart } from './defaultData/defaultCart.js';

/**
 * Synchronizes storage, clears prior orders, and seeds starter data when needed.
 * Orders intentionally start empty after every backend process restart.
 */
export async function initializeDatabase() {
  await sequelize.sync();
  await Order.destroy({ where: {} });

  const productCount = await Product.count();
  if (productCount > 0) {
    return;
  }

  const timestamp = Date.now();
  const addTimestamps = (records) =>
    records.map((record, index) => ({
      ...record,
      createdAt: new Date(timestamp + index),
      updatedAt: new Date(timestamp + index),
    }));

  await Product.bulkCreate(addTimestamps(defaultProducts));
  await DeliveryOption.bulkCreate(addTimestamps(defaultDeliveryOptions));
  await CartItem.bulkCreate(addTimestamps(defaultCart));

  console.log('Default product, delivery, and cart data added to the database.');
}

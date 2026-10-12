import app from './app.js';
import { sequelize } from './models/index.js';
import { Product } from './models/Product.js';
import { DeliveryOption } from './models/DeliveryOption.js';
import { CartItem } from './models/CartItem.js';
import { Order } from './models/Order.js';
import { defaultProducts } from './defaultData/defaultProducts.js';
import { defaultDeliveryOptions } from './defaultData/defaultDeliveryOptions.js';
import { defaultCart } from './defaultData/defaultCart.js';
import { defaultOrders } from './defaultData/defaultOrders.js';

const PORT = process.env.PORT || 3000;

/**
 * Creates the database schema and loads starter data when the product table is empty.
 */
async function initializeDatabase() {
  await sequelize.sync();

  const productCount = await Product.count();
  if (productCount === 0) {
    const timestamp = Date.now();

    const productsWithTimestamps = defaultProducts.map((product, index) => ({
      ...product,
      createdAt: new Date(timestamp + index),
      updatedAt: new Date(timestamp + index)
    }));

    const deliveryOptionsWithTimestamps = defaultDeliveryOptions.map((option, index) => ({
      ...option,
      createdAt: new Date(timestamp + index),
      updatedAt: new Date(timestamp + index)
    }));

    const cartItemsWithTimestamps = defaultCart.map((item, index) => ({
      ...item,
      createdAt: new Date(timestamp + index),
      updatedAt: new Date(timestamp + index)
    }));

    const ordersWithTimestamps = defaultOrders.map((order, index) => ({
      ...order,
      createdAt: new Date(timestamp + index),
      updatedAt: new Date(timestamp + index)
    }));

    await Product.bulkCreate(productsWithTimestamps);
    await DeliveryOption.bulkCreate(deliveryOptionsWithTimestamps);
    await CartItem.bulkCreate(cartItemsWithTimestamps);
    await Order.bulkCreate(ordersWithTimestamps);

    console.log('Default data added to the database.');
  }
}

await initializeDatabase();
/** Starts the API after the database schema and initial catalog are ready. */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

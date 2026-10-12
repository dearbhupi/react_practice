import axios from "axios";

/** Returns order history with each line's product expanded. */
export async function getOrders(signal) {
  const response = await axios.get("/api/orders?expand=products", { signal });

  if (!Array.isArray(response.data)) {
    throw new TypeError("Orders API response must be an array.");
  }

  return response.data;
}

/** Returns one order with product details expanded for tracking. */
export async function getOrder(orderId, signal) {
  if (!orderId) {
    throw new TypeError("An order ID is required to load tracking details.");
  }

  const response = await axios.get(
    `/api/orders/${encodeURIComponent(orderId)}?expand=products`,
    { signal },
  );

  if (!response.data || !Array.isArray(response.data.products)) {
    throw new TypeError("Order tracking API response is invalid.");
  }

  return response.data;
}

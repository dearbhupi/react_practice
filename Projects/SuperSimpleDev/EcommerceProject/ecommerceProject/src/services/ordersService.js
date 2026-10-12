import axios from "axios";

/** Returns order history with each line's product expanded. */
export async function getOrders(signal) {
  const response = await axios.get("/api/orders?expand=products", { signal });

  if (!Array.isArray(response.data)) {
    throw new TypeError("Orders API response must be an array.");
  }

  return response.data;
}

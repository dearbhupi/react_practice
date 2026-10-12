import axios from "axios";

export async function getOrders(signal) {
  const response = await axios.get("/api/orders?expand=products", { signal });

  if (!Array.isArray(response.data)) {
    throw new TypeError("Orders API response must be an array.");
  }

  return response.data;
}

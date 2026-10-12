import axios from "axios";

/** Returns delivery options with estimated delivery timestamps. */
export async function getDeliveryOptions(signal) {
  const response = await axios.get(
    "/api/delivery-options?expand=estimatedDeliveryTime",
    { signal },
  );

  if (!Array.isArray(response.data)) {
    throw new TypeError("Delivery options API response must be an array.");
  }

  return response.data;
}

/** Returns validated server-calculated cart totals. */
export async function getPaymentSummary(signal) {
  const response = await axios.get("/api/payment-summary", { signal });
  const summary = response.data;

  if (!summary || typeof summary.totalItems !== "number") {
    throw new TypeError("Payment summary API response is invalid.");
  }

  return summary;
}

/** Submits the current cart to create an order. */
export async function placeOrder() {
  await axios.post("/api/orders");
}

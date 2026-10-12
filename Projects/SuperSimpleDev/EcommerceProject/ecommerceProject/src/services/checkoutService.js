import axios from "axios";

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

export async function getPaymentSummary(signal) {
  const response = await axios.get("/api/payment-summary", { signal });
  const summary = response.data;

  if (!summary || typeof summary.totalItems !== "number") {
    throw new TypeError("Payment summary API response is invalid.");
  }

  return summary;
}

export async function placeOrder() {
  await axios.post("/api/orders");
}

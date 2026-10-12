import axios from "axios";

export async function getCartItems(signal) {
  const response = await axios.get("/api/cart-items?expand=product", {
    signal,
  });

  if (!Array.isArray(response.data)) {
    throw new TypeError("Cart API response must be an array.");
  }

  return response.data;
}

export async function addCartItem(productId, quantity) {
  await axios.post("/api/cart-items", { productId, quantity });
}

export async function updateCartItem(productId, updates) {
  await axios.put(`/api/cart-items/${productId}`, updates);
}

import axios from "axios";

/** Returns cart lines, including product details, and accepts abort signals. */
export async function getCartItems(signal) {
  const response = await axios.get("/api/cart-items?expand=product", {
    signal,
  });

  if (!Array.isArray(response.data)) {
    throw new TypeError("Cart API response must be an array.");
  }

  return response.data;
}

/** Adds the requested quantity of a product to the server cart. */
export async function addCartItem(productId, quantity) {
  await axios.post("/api/cart-items", { productId, quantity });
}

/** Updates mutable fields such as quantity or delivery choice on a cart line. */
export async function updateCartItem(productId, updates) {
  await axios.put(`/api/cart-items/${productId}`, updates);
}

import axios from "axios";

export async function getProducts(search, signal) {
  const response = await axios.get("/api/products", {
    params: search ? { search } : undefined,
    signal,
  });

  if (!Array.isArray(response.data)) {
    throw new TypeError("Products API response must be an array.");
  }

  return response.data;
}

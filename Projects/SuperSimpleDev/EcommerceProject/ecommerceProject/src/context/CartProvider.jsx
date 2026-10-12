import { useCallback, useEffect, useState } from "react";
import { CartContext } from "./cart-context";
import { addCartItem, getCartItems } from "../services/cartService";

/** Loads shared cart state and exposes cart operations to descendant components. */
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  /** Fetches the latest expanded cart and synchronizes provider state. */
  const refreshCart = useCallback(async (signal) => {
    const items = await getCartItems(signal);
    setCartItems(items);
    return items;
  }, []);

  /** Adds a product through the cart service, then refreshes shared state. */
  const addToCart = useCallback(
    async (productId, quantity) => {
      await addCartItem(productId, quantity);
      return refreshCart();
    },
    [refreshCart],
  );

  useEffect(() => {
    const controller = new AbortController();

    /** Loads initial cart state and ignores errors caused by unmounting. */
    async function loadCart() {
      try {
        const items = await getCartItems(controller.signal);
        if (!controller.signal.aborted) setCartItems(items);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error fetching cart items:", error);
        }
      }
    }

    loadCart();
    return () => controller.abort();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

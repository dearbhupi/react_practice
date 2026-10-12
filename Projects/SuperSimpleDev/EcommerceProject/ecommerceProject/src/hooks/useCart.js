import { useContext } from "react";
import { CartContext } from "../context/cart-context";

/** Returns the cart context and fails clearly when used outside its provider. */
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider.");
  }

  return context;
}

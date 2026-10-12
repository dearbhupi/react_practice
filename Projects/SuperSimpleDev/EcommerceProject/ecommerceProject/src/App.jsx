
import "./App.css";
import HomePage from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import { CheckoutPage } from "./pages/CheckoutPage";
import { Orders } from "./pages/Orders";
import { Tracking } from "./pages/Tracking";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

async function fetchCartItems(signal) {
  const response = await axios.get("/api/cart-items?expand=product", {
    signal,
  });

  if (!Array.isArray(response.data)) {
    throw new TypeError("Cart API response must be an array.");
  }

  return response.data;
}

function App() {
  const [cartItems, setCartItems] = useState([]);

  const refreshCart = useCallback(async (signal) => {
    setCartItems(await fetchCartItems(signal));
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCart() {
      try {
        const items = await fetchCartItems(controller.signal);
        if (!controller.signal.aborted) setCartItems(items);
      } catch (requestError) {
        if (controller.signal.aborted) return;

        console.error("Error fetching cart items:", requestError);
      }
    }

    loadCart();
    return () => controller.abort();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage cartItems={cartItems} onCartUpdated={refreshCart} />}
      />
      <Route path="/orders" element={<Orders cartItems={cartItems} />} />
      <Route path="/tracking" element={<Tracking />} />
      <Route
        path="/checkout"
        element={
          <CheckoutPage
            cartItems={cartItems}
            onOrderPlaced={() => setCartItems([])}
          />
        }
      />
    </Routes>
  );
}

export default App;

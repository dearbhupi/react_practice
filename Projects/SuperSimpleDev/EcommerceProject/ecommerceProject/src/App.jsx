
import "./App.css";
import HomePage from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import { CheckoutPage } from "./pages/CheckoutPage";
import { Orders } from "./pages/Orders";
import { Tracking } from "./pages/Tracking";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("/api/cart-items?expand=product", {
        signal: controller.signal,
      })
      .then((response) => {
        if (!Array.isArray(response.data)) {
          throw new TypeError("Cart API response must be an array.");
        }

        setCartItems(response.data);
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return;

        console.error("Error fetching cart items:", requestError);
      });

    return () => controller.abort();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage cartItems={cartItems} />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/tracking" element={<Tracking />} />
      <Route path="/checkout" element={<CheckoutPage cartItems={cartItems} />} />
    </Routes>
  );
}

export default App;

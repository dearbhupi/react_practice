import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import "./checkout-header.css";
import { CheckoutHeader } from "../components/checkout/CheckoutHeader";
import { OrderSummary } from "../components/checkout/OrderSummary";
import { PaymentSummary } from "../components/checkout/PaymentSummary";

export function CheckoutPage({ cartItems = [] }) {
  const navigate = useNavigate();
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [error, setError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCheckoutData() {
      try {
        const [deliveryResponse, summaryResponse] = await Promise.all([
          axios.get("/api/delivery-options?expand=estimatedDeliveryTime", {
            signal: controller.signal,
          }),
          axios.get("/api/payment-summary", { signal: controller.signal }),
        ]);

        if (
          !Array.isArray(deliveryResponse.data) ||
          !summaryResponse.data ||
          typeof summaryResponse.data.totalItems !== "number"
        ) {
          throw new TypeError(
            "Checkout API returned data in an unexpected format.",
          );
        }

        setDeliveryOptions(deliveryResponse.data);
        setPaymentSummary(summaryResponse.data);
      } catch (requestError) {
        if (controller.signal.aborted) return;

        console.error("Error loading checkout data:", requestError);
        setError("Unable to load checkout details. Please try again.");
      }
    }

    loadCheckoutData();
    return () => controller.abort();
  }, []);

  const itemCount =
    paymentSummary?.totalItems ??
    cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);

  async function selectDeliveryOption(productId, optionId) {
    setError("");

    try {
      await axios.put(`/api/cart-items/${productId}`, {
        deliveryOptionId: optionId,
      });
      const summaryResponse = await axios.get("/api/payment-summary");
      setPaymentSummary(summaryResponse.data);
      setSelectedOptions((options) => ({ ...options, [productId]: optionId }));
    } catch (requestError) {
      console.error("Error updating delivery option:", requestError);
      setError("Unable to update the delivery option. Please try again.");
    }
  }

  async function placeOrder() {
    setIsPlacingOrder(true);
    setError("");

    try {
      await axios.post("/api/orders");
      navigate("/orders");
    } catch (requestError) {
      console.error("Error placing order:", requestError);
      setError(
        requestError.response?.data?.error ??
          "Unable to place your order. Please try again.",
      );
      setIsPlacingOrder(false);
    }
  }

  return (
    <>
      <title>Checkout</title>
      <CheckoutHeader itemCount={itemCount} />

      <div className="checkout-page">
        <div className="page-title">Review your order</div>
        {error && <p role="alert">{error}</p>}

        <div className="checkout-grid">
          <div className="order-summary">
            <OrderSummary
              cartItems={cartItems}
              deliveryOptions={deliveryOptions}
              selectedOptions={selectedOptions}
              onSelectDeliveryOption={selectDeliveryOption}
            />
          </div>
          <PaymentSummary
            paymentSummary={paymentSummary}
            itemCount={itemCount}
            isPlacingOrder={isPlacingOrder}
            onPlaceOrder={placeOrder}
          />
        </div>
      </div>
    </>
  );
}

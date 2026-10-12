import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import { CheckoutHeader } from "../../components/checkout/CheckoutHeader";
import { OrderSummary } from "../../components/checkout/OrderSummary";
import { PaymentSummary } from "../../components/checkout/PaymentSummary";
import { useCart } from "../../hooks/useCart";
import {
  getDeliveryOptions,
  getPaymentSummary,
  placeOrder as submitOrder,
} from "../../services/checkoutService";
import { updateCartItem } from "../../services/cartService";

/** Coordinates checkout data, delivery updates, and order submission. */
export function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, refreshCart } = useCart();
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [error, setError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    /** Fetches delivery options and the server-calculated payment summary. */
    async function loadCheckoutData() {
      try {
        const [options, summary] = await Promise.all([
          getDeliveryOptions(controller.signal),
          getPaymentSummary(controller.signal),
        ]);

        setDeliveryOptions(options);
        setPaymentSummary(summary);
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

  /** Persists one cart line's delivery choice and refreshes checkout totals. */
  async function selectDeliveryOption(productId, optionId) {
    setError("");

    try {
      await updateCartItem(productId, {
        deliveryOptionId: optionId,
      });
      setPaymentSummary(await getPaymentSummary());
      setSelectedOptions((options) => ({ ...options, [productId]: optionId }));
    } catch (requestError) {
      console.error("Error updating delivery option:", requestError);
      setError("Unable to update the delivery option. Please try again.");
    }
  }

  /** Creates the order, refreshes the emptied cart, and opens order history. */
  async function placeOrder() {
    setIsPlacingOrder(true);
    setError("");

    try {
      await submitOrder();
      await refreshCart();
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

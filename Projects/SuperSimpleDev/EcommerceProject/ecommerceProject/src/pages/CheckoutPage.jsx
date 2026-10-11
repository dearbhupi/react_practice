import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import "./checkout-header.css";
import {formatMoney} from "../utils/money";

function formatDeliveryDate(timestamp) {
  if (!Number.isFinite(timestamp)) return "Date unavailable";

  return new Date(timestamp).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatPrice(priceCents) {
  return `$${(priceCents / 100).toFixed(2)}`;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const fetchCheckoutData = useCallback(async (signal) => {
    const [cartResponse, deliveryResponse, summaryResponse] =
      await Promise.all([
        axios.get("/api/cart-items?expand=product", { signal }),
        axios.get("/api/delivery-options?expand=estimatedDeliveryTime", {
          signal,
        }),
        axios.get("/api/payment-summary", { signal }),
      ]);

    if (
      !Array.isArray(cartResponse.data) ||
      !cartResponse.data.every((item) => item.product) ||
      !Array.isArray(deliveryResponse.data) ||
      !summaryResponse.data ||
      typeof summaryResponse.data.totalItems !== "number"
    ) {
      throw new TypeError("Checkout API returned data in an unexpected format.");
    }

    return {
      cartItems: cartResponse.data,
      deliveryOptions: deliveryResponse.data,
      paymentSummary: summaryResponse.data,
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCheckoutData() {
      try {
        const checkoutData = await fetchCheckoutData(controller.signal);
        if (controller.signal.aborted) return;

        setError("");
        setCartItems(checkoutData.cartItems);
        setDeliveryOptions(checkoutData.deliveryOptions);
        setPaymentSummary(checkoutData.paymentSummary);
      } catch (requestError) {
        if (controller.signal.aborted) return;

        console.error("Error loading checkout data:", requestError);
        setError("Unable to load checkout details. Please try again.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadCheckoutData();

    return () => controller.abort();
  }, [fetchCheckoutData]);

  async function updateCartItem(productId, changes) {
    setError("");
    setIsLoading(true);
    try {
      await axios.put(`/api/cart-items/${productId}`, changes);
      const checkoutData = await fetchCheckoutData();
      setCartItems(checkoutData.cartItems);
      setDeliveryOptions(checkoutData.deliveryOptions);
      setPaymentSummary(checkoutData.paymentSummary);
    } catch (requestError) {
      console.error("Error updating cart item:", requestError);
      setError("Unable to update your cart. Please try again.");
      setIsLoading(false);
    }
  }

  async function deleteCartItem(productId) {
    setError("");
    setIsLoading(true);
    try {
      await axios.delete(`/api/cart-items/${productId}`);
      const checkoutData = await fetchCheckoutData();
      setCartItems(checkoutData.cartItems);
      setDeliveryOptions(checkoutData.deliveryOptions);
      setPaymentSummary(checkoutData.paymentSummary);
    } catch (requestError) {
      console.error("Error removing cart item:", requestError);
      setError("Unable to remove this item. Please try again.");
      setIsLoading(false);
    }
  }

  async function placeOrder() {
    setIsSubmittingOrder(true);
    setError("");

    try {
      await axios.post("/api/orders");
      navigate("/orders");
    } catch (requestError) {
      console.error("Error placing order:", requestError);
      setError(
        requestError.response?.data?.error ||
          "Unable to place your order. Please try again.",
      );
      setIsSubmittingOrder(false);
    }
  }

  return (
    <>
      <title>Checkout</title>
      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <a href="/">
              <img className="logo" src="images/logo.png" alt="Home" />
              <img className="mobile-logo" src="images/mobile-logo.png" alt="Home" />
            </a>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (
            <a className="return-to-home-link" href="/">
              {paymentSummary?.totalItems ?? 0} items
            </a>
            )
          </div>

          <div className="checkout-header-right-section">
            <img src="images/icons/checkout-lock-icon.png" alt="Secure checkout" />
          </div>
        </div>
      </div>

      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        {error && <p role="alert">{error}</p>}
        {isLoading ? (
          <p>Loading checkout...</p>
        ) : (
          <div className="checkout-grid">
            <div className="order-summary">
              {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                cartItems.map((cartItem) => (
                  <div key={cartItem.productId} className="cart-item-container">
                    <div className="delivery-date">
                      Delivery date:{" "}
                      {formatDeliveryDate(
                        deliveryOptions.find(
                          (option) => option.id === cartItem.deliveryOptionId,
                        )?.estimatedDeliveryTimeMs,
                      )}
                    </div>

                    <div className="cart-item-details-grid">
                      <img
                        className="product-image"
                        src={cartItem.product.image}
                        alt={cartItem.product.name}
                      />

                      <div className="cart-item-details">
                        <div className="product-name">{cartItem.product.name}</div>
                        <div className="product-price">
                          {formatPrice(cartItem.product.priceCents)}
                        </div>
                        <div className="product-quantity">
                          <label htmlFor={`quantity-${cartItem.productId}`}>
                            Quantity:
                          </label>{" "}
                          <select
                            id={`quantity-${cartItem.productId}`}
                            value={cartItem.quantity}
                            onChange={(event) =>
                              updateCartItem(cartItem.productId, {
                                quantity: Number(event.target.value),
                              })
                            }
                          >
                            {Array.from({ length: 10 }, (_, index) => (
                              <option key={index + 1} value={index + 1}>
                                {index + 1}
                              </option>
                            ))}
                          </select>{" "}
                          <button
                            type="button"
                            className="delete-quantity-link link-primary"
                            onClick={() => deleteCartItem(cartItem.productId)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="delivery-options">
                        <div className="delivery-options-title">
                          Choose a delivery option:
                        </div>
                        {deliveryOptions.map((option) => (
                          <label
                            key={option.id}
                            className="delivery-option"
                            htmlFor={`delivery-${cartItem.productId}-${option.id}`}
                          >
                            <input
                              id={`delivery-${cartItem.productId}-${option.id}`}
                              type="radio"
                              className="delivery-option-input"
                              name={`delivery-option-${cartItem.productId}`}
                              checked={option.id === cartItem.deliveryOptionId}
                              onChange={() =>
                                updateCartItem(cartItem.productId, {
                                  deliveryOptionId: option.id,
                                })
                              }
                            />
                            <div>
                              <div className="delivery-option-date">
                                {formatDeliveryDate(option.estimatedDeliveryTimeMs)}
                              </div>
                              <div className="delivery-option-price">
                                {option.priceCents === 0
                                  ? "FREE Shipping"
                                  : `${formatPrice(option.priceCents)} - Shipping`}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {paymentSummary && (
              <div className="payment-summary">
                <div className="payment-summary-title">Payment Summary</div>

                <div className="payment-summary-row">
                  <div>Items ({paymentSummary.totalItems}):</div>
                  <div className="payment-summary-money">
                    {formatPrice(paymentSummary.productCostCents)}
                  </div>
                </div>

                <div className="payment-summary-row">
                  <div>Shipping &amp; handling:</div>
                  <div className="payment-summary-money">
                    {formatPrice(paymentSummary.shippingCostCents)}
                  </div>
                </div>

                <div className="payment-summary-row subtotal-row">
                  <div>Total before tax:</div>
                  <div className="payment-summary-money">
                    {formatPrice(paymentSummary.totalCostBeforeTaxCents)}
                  </div>
                </div>

                <div className="payment-summary-row">
                  <div>Estimated tax (10%):</div>
                  <div className="payment-summary-money">
                    {formatPrice(paymentSummary.taxCents)}
                  </div>
                </div>

                <div className="payment-summary-row total-row">
                  <div>Order total:</div>
                  <div className="payment-summary-money">
                    {formatPrice(paymentSummary.totalCostCents)}
                  </div>
                </div>

                <button
                  type="button"
                  className="place-order-button button-primary"
                  disabled={isSubmittingOrder || cartItems.length === 0}
                  onClick={placeOrder}
                >
                  {isSubmittingOrder ? "Placing order..." : "Place your order"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import "./checkout-header.css";
import formatMoney from "../utils/money";

function formatDeliveryDate(timestamp) {
  return new Date(timestamp).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function CheckoutPage({ cartItems = [] }) {
  const navigate = useNavigate();
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [error, setError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("/api/delivery-options?expand=estimatedDeliveryTime", {
        signal: controller.signal,
      })
      .then((response) => {
        if (!Array.isArray(response.data)) {
          throw new TypeError("Delivery options response must be an array.");
        }

        setDeliveryOptions(response.data);
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return;

        console.error("Error fetching delivery options:", requestError);
        setError("Unable to load delivery options. Please try again.");
      });

    return () => controller.abort();
  }, []);

  function getSelectedOption(cartItem) {
    const optionId =
      selectedOptions[cartItem.productId] ?? cartItem.deliveryOptionId;
    return (
      deliveryOptions.find((option) => option.id === optionId) ??
      deliveryOptions[0]
    );
  }

  const itemCount = cartItems.reduce(
    (total, cartItem) => total + cartItem.quantity,
    0,
  );
  const productCostCents = cartItems.reduce(
    (total, cartItem) =>
      total + cartItem.product.priceCents * cartItem.quantity,
    0,
  );
  const shippingCostCents = cartItems.reduce(
    (total, cartItem) =>
      total + (getSelectedOption(cartItem)?.priceCents ?? 0),
    0,
  );
  const totalCostBeforeTaxCents = productCostCents + shippingCostCents;
  const taxCents = Math.round(totalCostBeforeTaxCents * 0.1);
  const totalCostCents = totalCostBeforeTaxCents + taxCents;

  async function selectDeliveryOption(productId, optionId) {
    setError("");

    try {
      await axios.put(`/api/cart-items/${productId}`, {
        deliveryOptionId: optionId,
      });
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
      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <a href="/">
              <img className="logo" src="images/logo.png" alt="Home" />
              <img
                className="mobile-logo"
                src="images/mobile-logo.png"
                alt="Home"
              />
            </a>
          </div>

          <div className="checkout-header-middle-section">
            Checkout (
            <a className="return-to-home-link" href="/">
              {itemCount} items
            </a>
            )
          </div>

          <div className="checkout-header-right-section">
            <img
              src="images/icons/checkout-lock-icon.png"
              alt="Secure checkout"
            />
          </div>
        </div>
      </div>

      <div className="checkout-page">
        <div className="page-title">Review your order</div>
        {error && <p role="alert">{error}</p>}

        <div className="checkout-grid">
          <div className="order-summary">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((cartItem) => {
                const selectedOption = getSelectedOption(cartItem);

                return (
                  <div
                    key={cartItem.productId}
                    className="cart-item-container"
                  >
                    <div className="delivery-date">
                      Delivery date:{" "}
                      {selectedOption
                        ? formatDeliveryDate(
                            selectedOption.estimatedDeliveryTimeMs,
                          )
                        : "Unavailable"}
                    </div>

                    <div className="cart-item-details-grid">
                      <img
                        className="product-image"
                        src={cartItem.product.image}
                        alt={cartItem.product.name}
                      />

                      <div className="cart-item-details">
                        <div className="product-name">
                          {cartItem.product.name}
                        </div>
                        <div className="product-price">
                          {formatMoney(cartItem.product.priceCents)}
                        </div>
                        <div className="product-quantity">
                          Quantity:{" "}
                          <span className="quantity-label">
                            {cartItem.quantity}
                          </span>
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
                          >
                            <input
                              type="radio"
                              className="delivery-option-input"
                              name={`delivery-option-${cartItem.productId}`}
                              checked={option.id === selectedOption?.id}
                              onChange={() =>
                                selectDeliveryOption(
                                  cartItem.productId,
                                  option.id,
                                )
                              }
                            />
                            <div>
                              <div className="delivery-option-date">
                                {formatDeliveryDate(
                                  option.estimatedDeliveryTimeMs,
                                )}
                              </div>
                              <div className="delivery-option-price">
                                {option.priceCents === 0
                                  ? "FREE Shipping"
                                  : `${formatMoney(option.priceCents)} - Shipping`}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="payment-summary">
            <div className="payment-summary-title">Payment Summary</div>
            <div className="payment-summary-row">
              <div>Items ({itemCount}):</div>
              <div className="payment-summary-money">
                {formatMoney(productCostCents)}
              </div>
            </div>
            <div className="payment-summary-row">
              <div>Shipping &amp; handling:</div>
              <div className="payment-summary-money">
                {formatMoney(shippingCostCents)}
              </div>
            </div>
            <div className="payment-summary-row subtotal-row">
              <div>Total before tax:</div>
              <div className="payment-summary-money">
                {formatMoney(totalCostBeforeTaxCents)}
              </div>
            </div>
            <div className="payment-summary-row">
              <div>Estimated tax (10%):</div>
              <div className="payment-summary-money">
                {formatMoney(taxCents)}
              </div>
            </div>
            <div className="payment-summary-row total-row">
              <div>Order total:</div>
              <div className="payment-summary-money">
                {formatMoney(totalCostCents)}
              </div>
            </div>
            <button
              type="button"
              className="place-order-button button-primary"
              disabled={cartItems.length === 0 || isPlacingOrder}
              onClick={placeOrder}
            >
              {isPlacingOrder ? "Placing order..." : "Place your order"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

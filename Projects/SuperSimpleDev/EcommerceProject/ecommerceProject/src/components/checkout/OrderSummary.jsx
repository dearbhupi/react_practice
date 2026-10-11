import formatMoney from "../../utils/money";

function formatDeliveryDate(timestamp) {
  return new Date(timestamp).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function DeliveryOptions({ cartItem, deliveryOptions, selectedOptionId, onSelect }) {
  return (
    <div className="delivery-options">
      <div className="delivery-options-title">Choose a delivery option:</div>
      {deliveryOptions.map((option) => (
        <label key={option.id} className="delivery-option">
          <input
            type="radio"
            className="delivery-option-input"
            name={`delivery-option-${cartItem.productId}`}
            checked={option.id === selectedOptionId}
            onChange={() => onSelect(cartItem.productId, option.id)}
          />
          <div>
            <div className="delivery-option-date">
              {formatDeliveryDate(option.estimatedDeliveryTimeMs)}
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
  );
}

function CartItem({ cartItem, deliveryOptions, selectedOptionId, onSelect }) {
  const selectedOption = deliveryOptions.find(
    (option) => option.id === selectedOptionId,
  );

  return (
    <div className="cart-item-container">
      <div className="delivery-date">
        Delivery date:{" "}
        {selectedOption
          ? formatDeliveryDate(selectedOption.estimatedDeliveryTimeMs)
          : "Unavailable"}
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
            {formatMoney(cartItem.product.priceCents)}
          </div>
          <div className="product-quantity">
            Quantity:{" "}
            <span className="quantity-label">{cartItem.quantity}</span>
          </div>
        </div>

        <DeliveryOptions
          cartItem={cartItem}
          deliveryOptions={deliveryOptions}
          selectedOptionId={selectedOptionId}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}

export function OrderSummary({
  cartItems,
  deliveryOptions,
  selectedOptions,
  onSelectDeliveryOption,
}) {
  if (cartItems.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <>
      {cartItems.map((cartItem) => {
        const selectedOptionId =
          selectedOptions[cartItem.productId] ?? cartItem.deliveryOptionId;
        const selectedOptionExists = deliveryOptions.some(
          (option) => option.id === selectedOptionId,
        );
        const effectiveOptionId = selectedOptionExists
          ? selectedOptionId
          : deliveryOptions[0]?.id;

        return (
          <CartItem
            key={cartItem.productId}
            cartItem={cartItem}
            deliveryOptions={deliveryOptions}
            selectedOptionId={effectiveOptionId}
            onSelect={onSelectDeliveryOption}
          />
        );
      })}
    </>
  );
}

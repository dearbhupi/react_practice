import { Link } from "react-router-dom";
import dayjs from "dayjs";

/** Displays one purchased product and forwards its buy-again action. */
export function OrderProduct({ orderId, item, isAdding, onBuyAgain }) {
  return (
    <>
      <div className="product-image-container">
        <img src={item.product.image} alt={item.product.name} />
      </div>

      <div className="product-details">
        <div className="product-name">{item.product.name}</div>
        <div className="product-delivery-date">
          Arriving on: {dayjs(item.estimatedDeliveryTimeMs).format("MMMM D")}
        </div>
        <div className="product-quantity">Quantity: {item.quantity}</div>
        <button
          type="button"
          className="buy-again-button button-primary"
          disabled={isAdding}
          onClick={() => onBuyAgain(item.productId, item.quantity)}
        >
          <img
            className="buy-again-icon"
            src="images/icons/buy-again.png"
            alt=""
          />
          <span className="buy-again-message">
            {isAdding ? "Adding..." : "Buy again"}
          </span>
        </button>
      </div>

      <div className="product-actions">
        <Link
          to={`/tracking?orderId=${encodeURIComponent(orderId)}&productId=${encodeURIComponent(item.productId)}`}
          className="track-package-button button-secondary"
        >
          Track package
        </Link>
      </div>
    </>
  );
}

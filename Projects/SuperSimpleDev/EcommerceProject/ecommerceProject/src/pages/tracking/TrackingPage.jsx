import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { getOrder } from "../../services/ordersService";
import "./TrackingPage.css";

/** Displays the product and delivery status selected from a specific order. */
export function TrackingPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const productId = searchParams.get("productId");
  const [trackingItem, setTrackingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    /** Loads the selected order and resolves only the requested product line. */
    async function loadTrackingItem() {
      setIsLoading(true);
      setTrackingItem(null);
      setError("");

      if (!orderId || !productId) {
        setError("Choose a package from your order list to track it.");
        setIsLoading(false);
        return;
      }

      try {
        const order = await getOrder(orderId, controller.signal);
        const orderItem = order.products.find(
          (item) => item.productId === productId,
        );

        if (!orderItem?.product) {
          throw new Error("The selected product was not found in this order.");
        }

        setTrackingItem(orderItem);
      } catch (requestError) {
        if (controller.signal.aborted) return;

        console.error("Error loading package tracking:", requestError);
        setError("Unable to load this package. Please try again.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadTrackingItem();
    return () => controller.abort();
  }, [orderId, productId]);

  return (
    <div className="tracking-page">
      <div className="order-tracking">
        <Link className="back-to-orders-link link-primary" to="/orders">
          View all orders
        </Link>

        {isLoading ? (
          <p>Loading package details...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : (
          <>
            <div className="delivery-date">
              Arriving on{" "}
              {dayjs(trackingItem.estimatedDeliveryTimeMs).format(
                "dddd, MMMM D",
              )}
            </div>

            <div className="product-info">{trackingItem.product.name}</div>
            <div className="product-info">
              Quantity: {trackingItem.quantity}
            </div>

            <img
              className="product-image"
              src={trackingItem.product.image}
              alt={trackingItem.product.name}
            />

            <div className="progress-labels-container">
              <div className="progress-label">Preparing</div>
              <div className="progress-label current-status">Shipped</div>
              <div className="progress-label">Delivered</div>
            </div>

            <div className="progress-bar-container">
              <div className="progress-bar" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

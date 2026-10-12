import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { Header } from "../components/Header";
import formatMoney from "../utils/money";
import "./Orders.css";

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingProductId, setAddingProductId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      try {
        const response = await axios.get("/api/orders?expand=products", {
          signal: controller.signal,
        });

        if (!Array.isArray(response.data)) {
          throw new TypeError("Orders API response must be an array.");
        }

        setOrders(response.data);
      } catch (requestError) {
        if (controller.signal.aborted) return;

        console.error("Error fetching orders:", requestError);
        setError("Unable to load orders. Please try again.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadOrders();
    return () => controller.abort();
  }, []);

  async function addProductToCart(productId, quantity) {
    setAddingProductId(productId);
    setError("");

    try {
      await axios.post("/api/cart-items", { productId, quantity });
    } catch (requestError) {
      console.error("Error adding product to cart:", requestError);
      setError("Unable to add this product to your cart. Please try again.");
    } finally {
      setAddingProductId(null);
    }
  }

  return (
    <>
      <Header />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>

        {error && <p role="alert">{error}</p>}
        {isLoading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>You haven&apos;t placed any orders yet.</p>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order.id} className="order-container">
                <div className="order-header">
                  <div className="order-header-left-section">
                    <div className="order-date">
                      <div className="order-header-label">Order Placed:</div>
                      <div>{dayjs(order.orderTimeMs).format("MMMM D, YYYY")}</div>
                    </div>
                    <div className="order-total">
                      <div className="order-header-label">Total:</div>
                      <div>{formatMoney(order.totalCostCents)}</div>
                    </div>
                  </div>

                  <div className="order-header-right-section">
                    <div className="order-header-label">Order ID:</div>
                    <div>{order.id}</div>
                  </div>
                </div>

                <div className="order-details-grid">
                  {order.products.map((orderProduct) => (
                    <Fragment key={orderProduct.productId}>
                      <div className="product-image-container">
                        <img
                          src={orderProduct.product.image}
                          alt={orderProduct.product.name}
                        />
                      </div>

                      <div className="product-details">
                        <div className="product-name">
                          {orderProduct.product.name}
                        </div>
                        <div className="product-delivery-date">
                          Arriving on:{" "}
                          {dayjs(orderProduct.estimatedDeliveryTimeMs).format(
                            "MMMM D",
                          )}
                        </div>
                        <div className="product-quantity">
                          Quantity: {orderProduct.quantity}
                        </div>
                        <button
                          type="button"
                          className="buy-again-button button-primary"
                          disabled={addingProductId === orderProduct.productId}
                          onClick={() =>
                            addProductToCart(
                              orderProduct.productId,
                              orderProduct.quantity,
                            )
                          }
                        >
                          <img
                            className="buy-again-icon"
                            src="images/icons/buy-again.png"
                            alt=""
                          />
                          <span className="buy-again-message">
                            {addingProductId === orderProduct.productId
                              ? "Adding..."
                              : "Add to Cart"}
                          </span>
                        </button>
                      </div>

                      <div className="product-actions">
                        <Link
                          to="/tracking"
                          className="track-package-button button-secondary"
                        >
                          Track package
                        </Link>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderCard } from "../../components/orders/OrderCard";
import { useCart } from "../../hooks/useCart";
import { getOrders } from "../../services/ordersService";
import "./OrdersPage.css";

/** Loads order history and coordinates the buy-again cart action. */
export function Orders() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingProductId, setAddingProductId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    /** Loads the customer's orders with product details expanded. */
    async function loadOrders() {
      try {
        setOrders(await getOrders(controller.signal));
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

  /** Adds an ordered product to the cart and navigates to checkout. */
  async function addProductToCart(productId, quantity) {
    setAddingProductId(productId);
    setError("");

    try {
      await addToCart(productId, quantity);
      navigate("/checkout");
    } catch (requestError) {
      console.error("Error adding product to cart:", requestError);
      setError("Unable to add this product to your cart. Please try again.");
    } finally {
      setAddingProductId(null);
    }
  }

  return (
    <>
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
              <OrderCard
                key={order.id}
                order={order}
                addingProductId={addingProductId}
                onBuyAgain={addProductToCart}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

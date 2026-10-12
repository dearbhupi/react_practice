import "./homePage.css";
import { Header } from "../components/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import formatMoney from "../utils/money";

function HomePage({ cartItems = [], onCartUpdated }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [quantities, setQuantities] = useState({});
  const [addingProductId, setAddingProductId] = useState(null);
  const [addedProductId, setAddedProductId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("/api/products", {
        signal: controller.signal,
      })
      .then((response) => {
        if (!Array.isArray(response.data)) {
          throw new TypeError("Products API response must be an array.");
        }

        setProducts(response.data);
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return;

        console.error("Error fetching products:", requestError);
        setError("Unable to load products. Please try again later.");
      });


 

    return () => controller.abort();

  }, []);

  async function addToCart(productId) {
    setAddingProductId(productId);
    setAddedProductId(null);
    setError("");

    try {
      await axios.post("/api/cart-items", {
        productId,
        quantity: quantities[productId] ?? 1,
      });
      await onCartUpdated();
      setAddedProductId(productId);
    } catch (requestError) {
      console.error("Error adding product to cart:", requestError);
      setError("Unable to add this product to your cart. Please try again.");
    } finally {
      setAddingProductId(null);
    }
  }

  return (
    <>
      <title>Ecommerce Project</title>
      <Header cartItems={cartItems} />

      <div className="home-page">
        {error && <p role="alert">{error}</p>}
        <div className="products-grid">
          {error ? <p role="alert">{error}</p> : products.map((product) => {
            const isProductInCart = cartItems.some(
              (cartItem) => cartItem.productId === product.id
            );

            return (
              <div key={product.id} className="product-container">
                <div className="product-image-container">
                  <img className="product-image" src={product.image} />
                </div>

                <div className="product-name limit-text-to-2-lines">
                  {product.name}
                </div>

                <div className="product-rating-container">
                  <img
                    className="product-rating-stars"
                    src={`images/ratings/rating-${product.rating.stars * 10}.png`}
                  />
                  <div className="product-rating-count link-primary">
                    {product.rating.count}
                  </div>
                </div>

                <div className="product-price">
                  {formatMoney(product.priceCents)}
                </div>

                <div className="product-quantity-container">
                  <select
                    value={quantities[product.id] ?? 1}
                    aria-label={`Quantity for ${product.name}`}
                    onChange={(event) =>
                      setQuantities((current) => ({
                        ...current,
                        [product.id]: Number(event.target.value),
                      }))
                    }
                  >
                    {Array.from({ length: 10 }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="product-spacer"></div>

                {(isProductInCart || addedProductId === product.id) && (
                  <div className="added-to-cart">
                    <img src="images/icons/checkmark.png" />
                    Added
                  </div>
                )}
                <button
                  type="button"
                  className="add-to-cart-button button-primary"
                  disabled={addingProductId === product.id}
                  onClick={() => addToCart(product.id)}
                >
                  {addingProductId === product.id ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default HomePage;

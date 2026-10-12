import { useState } from "react";
import formatMoney from "../../utils/money";

/** Displays product information and manages its add-to-cart interaction. */
export function ProductCard({ product, isInCart, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [wasAdded, setWasAdded] = useState(false);
  const [error, setError] = useState("");

  /** Adds the selected quantity and exposes request progress or failure. */
  async function handleAddToCart() {
    setIsAdding(true);
    setWasAdded(false);
    setError("");

    try {
      await onAddToCart(product.id, quantity);
      setWasAdded(true);
    } catch (requestError) {
      console.error("Error adding product to cart:", requestError);
      setError("Unable to add this product. Please try again.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="product-container">
      <div className="product-image-container">
        <img className="product-image" src={product.image} alt={product.name} />
      </div>

      <div className="product-name limit-text-to-2-lines">{product.name}</div>

      <div className="product-rating-container">
        <img
          className="product-rating-stars"
          src={`images/ratings/rating-${product.rating.stars * 10}.png`}
          alt={`${product.rating.stars} out of 5 stars`}
        />
        <div className="product-rating-count link-primary">
          {product.rating.count}
        </div>
      </div>

      <div className="product-price">{formatMoney(product.priceCents)}</div>

      <div className="product-quantity-container">
        <select
          value={quantity}
          aria-label={`Quantity for ${product.name}`}
          onChange={(event) => setQuantity(Number(event.target.value))}
        >
          {Array.from({ length: 10 }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="product-spacer" />

      {(isInCart || wasAdded) && (
        <div className="added-to-cart">
          <img src="images/icons/checkmark.png" alt="" />
          Added
        </div>
      )}
      {error && <p role="alert">{error}</p>}
      <button
        type="button"
        className="add-to-cart-button button-primary"
        disabled={isAdding}
        onClick={handleAddToCart}
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}

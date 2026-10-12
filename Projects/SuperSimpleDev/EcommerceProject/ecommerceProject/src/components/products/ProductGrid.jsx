import { ProductCard } from "./ProductCard";

/** Renders product cards and marks the products already in the cart. */
export function ProductGrid({ products, cartItems, onAddToCart }) {
  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isInCart={cartItems.some((item) => item.productId === product.id)}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

import { ProductCard } from "./ProductCard";

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

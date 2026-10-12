import "./HomePage.css";
import { ProductGrid } from "../../components/products/ProductGrid";
import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";

function HomePage() {
  const { products, isLoading, error } = useProducts();
  const { cartItems, addToCart } = useCart();

  return (
    <>
      <title>Ecommerce Project</title>
      <div className="home-page">
        {error && <p role="alert">{error}</p>}
        {isLoading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found. Try a different search.</p>
        ) : (
          <ProductGrid
            products={products}
            cartItems={cartItems}
            onAddToCart={addToCart}
          />
        )}
      </div>
    </>
  );
}

export default HomePage;

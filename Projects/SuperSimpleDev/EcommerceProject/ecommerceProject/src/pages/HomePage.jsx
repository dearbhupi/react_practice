import "./homePage.css";
import { Header } from "../components/Header";
import axios from "axios";
import { useEffect, useState } from "react";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get("http://127.0.0.1:3000/api/products", {
        signal: controller.signal,
      })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return;

        console.error("Error fetching products:", requestError);
        setError("Unable to load products. Please try again later.");
      });

    return () => controller.abort();
  }, []);

  return (
    <>
      <title>Ecommerce Project</title>
      <Header />

      <div className="home-page">
        <div className="products-grid">
          {error ? <p role="alert">{error}</p> : products.map((product) => (
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
                ${(product.priceCents / 100).toFixed(2)}
              </div>

              <div className="product-quantity-container">
                <select
                  defaultValue="1"
                  aria-label={`Quantity for ${product.name}`}
                >
                  {Array.from({ length: 10 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="product-spacer"></div>

              <div className="added-to-cart">
                <img src="images/icons/checkmark.png" />
                Added
              </div>

              <button className="add-to-cart-button button-primary">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default HomePage;

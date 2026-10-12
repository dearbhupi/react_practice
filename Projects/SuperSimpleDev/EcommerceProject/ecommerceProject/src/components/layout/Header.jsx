import "./Header.css";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

export function Header() {
  const { cartItems } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = searchParams.get("search") ?? "";
  const cartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  function updateSearch(event) {
    const value = event.target.value;

    setSearchParams((currentParams) => {
      if (value.trim()) {
        currentParams.set("search", value);
      } else {
        currentParams.delete("search");
      }
      return currentParams;
    });
  }

  return (
    <>
      <div className="header">
        <div className="left-section">
          <Link to="/" className="header-link">
          <h2 style={{ color: "white" }}>Bhupi Mart</h2>
            {/* <img className="logo" src="images/logo-white.png" />
            <img className="mobile-logo" src="images/mobile-logo-white.png" /> */}
          </Link>
        </div>

        <form
          className="middle-section"
          onSubmit={(event) => event.preventDefault()}
          role="search"
        >
          <input
            className="search-bar"
            type="search"
            name="search"
            placeholder="Search"
            aria-label="Search products"
            value={searchFromUrl}
            onChange={updateSearch}
          />

          <button
            className="search-button"
            type="submit"
            aria-label="Search"
          >
            <img
              className="search-icon"
              src="images/icons/search-icon.png"
              alt=""
            />
          </button>
        </form>

        <div className="right-section">
          <Link className="orders-link header-link" to="/orders">
            <span className="orders-text">Orders</span>
          </Link>

          <Link className="cart-link header-link" to="/checkout">
            <img className="cart-icon" src="images/icons/cart-icon.png" />
            <div className="cart-quantity">{cartQuantity}</div>
            <div className="cart-text">Cart</div>
          </Link>
        </div>
      </div>
    </>
  );
}

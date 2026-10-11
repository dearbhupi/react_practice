export function CheckoutHeader({ itemCount }) {
  return (
    <div className="checkout-header">
      <div className="header-content">
        <div className="checkout-header-left-section">
          <a href="/">
            <img className="logo" src="images/logo.png" alt="Home" />
            <img
              className="mobile-logo"
              src="images/mobile-logo.png"
              alt="Home"
            />
          </a>
        </div>

        <div className="checkout-header-middle-section">
          Checkout (
          <a className="return-to-home-link" href="/">
            {itemCount} items
          </a>
          )
        </div>

        <div className="checkout-header-right-section">
          <img
            src="images/icons/checkout-lock-icon.png"
            alt="Secure checkout"
          />
        </div>
      </div>
    </div>
  );
}

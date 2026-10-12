import formatMoney from "../../utils/money";

/** Displays the server-calculated total and submits the reviewed order. */
export function PaymentSummary({
  paymentSummary,
  itemCount,
  isPlacingOrder,
  onPlaceOrder,
}) {
  return (
    <div className="payment-summary">
      <div className="payment-summary-title">Payment Summary</div>
      {paymentSummary ? (
        <>
          <div className="payment-summary-row">
            <div>Items ({itemCount}):</div>
            <div className="payment-summary-money">
              {formatMoney(paymentSummary.productCostCents)}
            </div>
          </div>
          <div className="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div className="payment-summary-money">
              {formatMoney(paymentSummary.shippingCostCents)}
            </div>
          </div>
          <div className="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div className="payment-summary-money">
              {formatMoney(paymentSummary.totalCostBeforeTaxCents)}
            </div>
          </div>
          <div className="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div className="payment-summary-money">
              {formatMoney(paymentSummary.taxCents)}
            </div>
          </div>
          <div className="payment-summary-row total-row">
            <div>Order total:</div>
            <div className="payment-summary-money">
              {formatMoney(paymentSummary.totalCostCents)}
            </div>
          </div>
        </>
      ) : (
        <p>Loading payment summary...</p>
      )}
      <button
        type="button"
        className="place-order-button button-primary"
        disabled={itemCount === 0 || isPlacingOrder || !paymentSummary}
        onClick={onPlaceOrder}
      >
        {isPlacingOrder ? "Placing order..." : "Place your order"}
      </button>
    </div>
  );
}

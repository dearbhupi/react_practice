import dayjs from "dayjs";
import { Fragment } from "react";
import formatMoney from "../../utils/money";
import { OrderProduct } from "./OrderProduct";

export function OrderCard({ order, addingProductId, onBuyAgain }) {
  return (
    <div className="order-container">
      <div className="order-header">
        <div className="order-header-left-section">
          <div className="order-date">
            <div className="order-header-label">Order Placed:</div>
            <div>{dayjs(order.orderTimeMs).format("MMMM D, YYYY")}</div>
          </div>
          <div className="order-total">
            <div className="order-header-label">Total:</div>
            <div>{formatMoney(order.totalCostCents)}</div>
          </div>
        </div>

        <div className="order-header-right-section">
          <div className="order-header-label">Order ID:</div>
          <div>{order.id}</div>
        </div>
      </div>

      <div className="order-details-grid">
        {order.products.map((item) => (
          <Fragment key={item.productId}>
            <OrderProduct
              item={item}
              isAdding={addingProductId === item.productId}
              onBuyAgain={onBuyAgain}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

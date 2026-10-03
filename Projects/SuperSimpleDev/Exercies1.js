const initialMessage =(
  <div>
    Exercise 1!
  </div>
);
   

const cottonSocks = (
  <div>
    Cotton Socks
    <br />
    Price : $10
    <br />
    <button>Add to Cart</button>
  </div>
);

const productPrice = 10;
const shippingCost = 15;

const product = (
<div>
  Product: {productPrice}<br />
  Shipping: {shippingCost}<br />
  Total cost: {productPrice + shippingCost}<br/>
  <button>Place your order</button>
</div>
);

const Ex1Solution = (
  <>
    {initialMessage}

    {cottonSocks}
    {product}
  </>
);
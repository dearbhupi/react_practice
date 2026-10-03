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

const item1 = 10;
const item2 = 15;
const product = (
  <div>
    Total cost : {item1 + item2}
  </div>
);

const Ex1Solution = (
  <>
    {initialMessage}
    {cottonSocks}
    {product}
  </>
);
import React, { useState } from "react";

function UseStateDemo() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>useState Hook Demo</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

export default UseStateDemo;
import React, { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(10)

  const addValue = () => {
    if (count >= 20) {
      alert('Counter value is too high!')
      return
    }

    setCount((prevCount) => prevCount + 1)
  }

  const removeValue = () => {
    if (count <= 0) {
      alert('Counter value is too low!')
      return
    }

    setCount((prevCount) => prevCount - 1)
  }

  return (
    <div>
      <h1>Counter App</h1>
      <h2>Count: {count}</h2>
      <button onClick={addValue}>Add Value</button>
      <button onClick={removeValue}>Remove Value</button>
    </div>
  )
}

export default Counter
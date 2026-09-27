import React, { useState } from 'react'

const UseStateEx = () => {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Increase Count
      </button>
      <br>
      </br>

      <button onClick={() => setCount(count - 1)}>
        Decrease Count
      </button>
      <br>
      </br>
      <button onClick={() => setCount(0)}>
        Reset Count
      </button>
    </div>
  )
}

export default UseStateEx

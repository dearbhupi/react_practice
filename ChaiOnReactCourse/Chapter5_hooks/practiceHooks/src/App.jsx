

import { useState } from 'react'
import './App.css'

function App() {
  const [counter, setCounter] = useState(16)
  //let counter = 16

  const addValue = () => {
    console.log("clicked",counter)
    setCounter(counter + 1)
  }

  const removeValue = () => {
    setCounter(counter - 1)
  }

  return (
    <>
      <h1>Hello, React Hooks!</h1>
      <p>Counter value: {counter}</p>
      <button 
      onClick={addValue }
      >Add value</button>
      <br />
      <button 
      onClick={removeValue}
      >Remove value
      </button>
    </>
  )
}

export default App

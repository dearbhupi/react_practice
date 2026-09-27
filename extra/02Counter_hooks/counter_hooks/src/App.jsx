import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {

  const [counter, setCounter] = useState(10)

  const addValue = () => {
    setCounter(counter + 1)
    console.log("Counter value: " + (counter + 1))
  }

  const subtractValue = () => {
    setCounter(counter - 1)
    console.log("Counter value: " + (counter - 1))
  }

  return (
    <>
    <h1>Hello Bhupi</h1>
    <h2>Counter Value: {counter}</h2>
    <button onClick = {addValue}>Add Value </button>
    <br />
    <button onClick = {subtractValue}>Subtract Value</button>
  
    </>
  )

}

export default App

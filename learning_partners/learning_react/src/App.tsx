import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import User from './components/User'
import Admin from './components/Admin'
import Databinding from './components/Databinding'
import UseStateEx from './components/UseStateEx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <User />
      <Admin />
      <Databinding /> */}
      <UseStateEx />
    </>
  )
}

export default App


import './App.css'
import HomePage from './pages/HomePage'
import { Routes, Route } from 'react-router'
import CheckoutPage from './pages/CheckoutPage'
import Orders from './pages/Orders'
import Tracking from './pages/Tracking'

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
       <Route index element={<HomePage />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/tracking" element={<Tracking />} />
      <Route path="/checkout" element={<CheckoutPage />} />
    </Routes>
  )
}

export default App


import './App.css'
import HomePage from './pages/HomePage'
import { Routes, Route } from 'react-router'
import CheckoutPage from './pages/CheckoutPage'

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
       <Route index element={<HomePage />} />
      <Route path="/orders" element={<div>test order page</div>} />
      <Route path="/checkout" element={<CheckoutPage />} />
    </Routes>
  )
}

export default App

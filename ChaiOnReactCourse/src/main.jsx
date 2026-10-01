import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RouterDemo from '../Chapters/Chapter12_Router/script.jsx'
import Counter from '../Chapters/Counters/Counter.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Counter />
  
    <RouterDemo />
  
  </StrictMode>
)

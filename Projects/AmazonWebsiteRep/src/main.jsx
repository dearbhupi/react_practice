import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FormInputs from '../AppOtherPages/formInputs.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <FormInputs />
  
  </StrictMode>,
)

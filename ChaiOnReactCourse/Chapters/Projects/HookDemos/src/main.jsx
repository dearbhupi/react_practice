import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.jsx'
//import Demo1 from './UseApi.jsx'
//import Pokemon from '../useEffectDemos/UsePokemonAPI.jsx'
import UseStateDemo from '../allHooks/use-state.jsx'
import UseEffectDemo from '../allHooks/use-effect.jsx'  
import ApiDataFetcher from '../allHooks/use-effectwithAPI.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Pokemon /> */}
    <UseStateDemo />

    <UseEffectDemo />
    <ApiDataFetcher />

  </StrictMode>,
)

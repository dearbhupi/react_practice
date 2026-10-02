import { StrictMode } from 'react'
import AutoSaveDemo from '../allHooks/use-effect_autoSaveDemo.jsx'
import UseEffectResizeDemo from '../allHooks/use-effect_ResizeDemo.jsx'
import UseEffectShieldGame from '../allHooks/use-effect_ShieldGame.jsx'
import UseEffectApiComparison from '../allHooks/use-effect_ApiComparison.jsx'
import BankingUseEffectDemo from '../allHooks/use-effect_BankingDemo.jsx'
import WeatherWithUseEffect from '../allHooks/WeatherWithUseEffect.jsx'
import WeatherWithoutUseEffect from '../allHooks/WeatherWithoutUseEffect.jsx'
import WeatherCodeComparison from '../allHooks/WeatherCodeComparison.jsx'
import UseEffectDependenciesDemo from '../allHooks/UseEffectDependenciesDemo.jsx'
import UseEffectCleanupWeatherDemo from '../allHooks/UseEffectCleanupWeatherDemo.jsx'
import UseEffectGame from '../allHooks/use-effect_Game.jsx'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.jsx'
//import Demo1 from './UseApi.jsx'
//import Pokemon from '../useEffectDemos/UsePokemonAPI.jsx'
import UseStateDemo from '../allHooks/use-state.jsx'
import UseEffectDemo from '../allHooks/use-effect.jsx'  
import ApiDataFetcher from '../allHooks/use-effectwithAPI.jsx'
import UseDarkModeApp from '../allHooks/use-Context.jsx'
import UseContextvsuseEffect from '../allHooks/use-contextvsuseEffect.jsx'
import UseContextAppAPI from '../allHooks/use-context_apiEx.jsx'
import UseEffectCricket from '../allHooks/use-effect_crick.jsx'
import UseEffectCricketMatch from '../allHooks/use-effect_Criket.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Pokemon /> */}
    <UseStateDemo />

    <UseEffectDemo />
    <ApiDataFetcher />
    <UseDarkModeApp />
    <UseContextAppAPI />
    <UseContextvsuseEffect />
    <UseEffectGame />
    <AutoSaveDemo />
    <UseEffectResizeDemo />
    <UseEffectShieldGame />
    <UseEffectApiComparison />
    <BankingUseEffectDemo />
    <WeatherWithUseEffect />
    <WeatherWithoutUseEffect />
    <WeatherCodeComparison />
    <UseEffectDependenciesDemo />
    <UseEffectCleanupWeatherDemo />
    <UseEffectCricket />
    <UseEffectCricketMatch/>



  </StrictMode>,
)

import { useState, useCallback } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [length, setLength] = useState(8)// default password length is 8
  const [numberAllowed, setNumberAllowed] = useState(false) // default is not to allow numbers
  const [charAllowed, setCharAllowed] = useState(false) // default is not to allow characters
  // const [symbolAllowed, setSymbolAllowed] = useState(false) // default is not to allow symbols
  const [password, setPassword] = useState('') // default password is empty

  const passwordGenerator = useCallback(() => {
    let pass = ''
    let str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (numberAllowed) {
      str += '0123456789'
    }
    if (charAllowed) {
      str += '!@#$%^&*()_+'
    }
    for (let i = 0; i < length; i++) {
      let char = Math.floor(Math.random() * str.length)
      pass += str.charAt(char)
    }
    
      setPassword(pass)

   }, [length, numberAllowed, charAllowed, setPassword])

  return (
    <>
    <div className='w-full max-w-sm mx-auto bg-gray-800 rounded-lg shadow-md px-8 my-10 text-yellow-400'>
     Password Generator
      <div className='mb-4'>
        <label className='block text-gray-300 font-bold mb-2'>Password:</label>
        <div className='text-lg font-bold text-center'>
          <input 
            type="text"
            value={password}
            placeholder='password'
            readOnly
            className='w-full text-center bg-gray-700 text-yellow-400 rounded-md py-2 mb-4'
          />
          <button className="outline-none bg-blue-500 hover:bg-blue-700  py-2 px-4 rounded">
            Copy
            </button>
          <button 
            onClick={passwordGenerator}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          >
            Generate Password
          </button>
        </div>
        <input 
          type="range"
          min="8"
          max="20"  
          value={length}
          className='cursor-pointer w-full'
          onChange={(e) => setLength(e.target.value)}
         />
      </div>
      <div className='mb-4'>
        <label className='block text-gray-300 font-bold mb-2'>Include Numbers:</label>
        <input 
          type="checkbox"
          checked={numberAllowed}
          onChange={(e) => setNumberAllowed(e.target.checked)}
          className='mr-2'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-gray-300 font-bold mb-2'>Include Characters:</label>
        <input 
          type="checkbox"
          checked={charAllowed}
          onChange={(e) => setCharAllowed(e.target.checked)}
          className='mr-2'
        />
      </div>
    </div>
    </>
  )
}

export default App

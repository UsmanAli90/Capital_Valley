import { useState } from 'react'
import './Components/HomePage'
import './Components/Header'
import './App.css'
import HomePage from "./Components/HomePage";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>   
      <HomePage/>      
    </>
  )
}

export default App

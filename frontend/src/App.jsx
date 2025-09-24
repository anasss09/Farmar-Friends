import { useState } from 'react'
import './App.css'
import DynamicData from './InterviewStuff/DynamicData'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DynamicData />
    </>
  )
}

export default App

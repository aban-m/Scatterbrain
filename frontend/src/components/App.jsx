import { useState } from 'react'
import '../styles/App.css'

function App() {
  const [text, setText] = useState('')
  const [output, setOutput] = useState('')

  const handleClick = () => {
    // make api request to /api
    fetch('/api/echo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        text: text
      }
    })
      .then(res => res.json())
      .then(res => res['echo'])   // the same thing, but upper case
      .then(data => setOutput(data))
  }
  return (
    <>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleClick}>Show output</button>
      <span className='output'>{output}</span>
    </>
  )
}

export default App

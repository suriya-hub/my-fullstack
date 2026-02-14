import { useState } from 'react'
import './App.css'

function App() {
  const [search, setSearch] = useState("")
  const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS;


  const handleSubmit = () => {
    console.log(search, 'search')
    fetch(`https://api.unsplash.com/photos/random?query=${search}&client_id=${ACCESS_KEY}`)
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err))
  }

  return (
    <>
      <div>
        <input type="search" placeholder="Enter your name" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={() => handleSubmit()}>search</button>
      </div>
    </>
  )
}

export default App

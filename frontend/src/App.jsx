import { useState } from 'react'
import './App.css'

function App() {
  const [search, setSearch] = useState("")
  const [images, setImages] = useState([])
  const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS;


  const handleSubmit = () => {
    console.log(search, 'search')
    fetch(`https://api.unsplash.com/search/photos?query=${search}&per_page=10&client_id=${ACCESS_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data?.results)
      })
      .catch((err) => console.log(err))
  }
  console.log(images, 'images')
  return (
    <>
      <div>
        <input type="search" placeholder="Enter your name" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={() => handleSubmit()}>search</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "20px", }}>
        {images.map((list, idx) => (
          <img
            key={idx}
            src={list.urls.small}
            alt={list.alt_description}
            style={{
              width: "100%",
              height: "25rem",
              objectFit: "cover",
              borderRadius: "10px",
              transition: "transform 0.3s ease",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        ))}
      </div>
    </>
  )
}

export default App

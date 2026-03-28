import { useEffect, useRef, useState } from 'react'
import './App.css'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(null);
  const ref = useRef(null);
  const KEY = import.meta.env.VITE_UNSPLASH_ACCESS;
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5050'


  useEffect(() => {
    const close = e => ref.current && !ref.current.contains(e.target) && setOpen(null);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_URL}/images`);
      setImages(response?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_images?query=${search}`);
      setImages(response?.data.results || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async (url, name) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = name + ".jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(blobUrl);
      setOpen(null);
    } catch (err) {
      console.log("Download failed:", err);
    }
  };


  const handleSaveDelete = async (data) => {
    if (data?._id) {
      const toDelete = images.filter(img => img.id !== data?.id);
      setImages(toDelete)
      try {
        const response = await axios.delete(`${API_URL}/images/${data._id}`);
        if (response.data.message) {
          setImages(prev => prev.filter(img => img._id !== data._id));
          notifySuccessDelete();
        } else {
          notifyError();
        }
      } catch (error) {
        console.error(error);
        notifyError();
      }
    } else {
      const toSave = images.find(img => img.id === data?.id);
      try {
        const response = await axios.post(`${API_URL}/images`, { ...toSave });
        response.data.message ? notifySuccess() : notifyError();
      } catch (error) {
        console.error(error);
        notifyError();
      }
    }
  }

  const notifySuccessDelete = () => {
    toast.success("Image deleted successfully!");
  };

  const notifySuccess = () => {
    toast.success("Image saved successfully!");
  };

  const notifyError = () => {
    toast.error("Something went wrong!");
  };

  return (
    <>
      <ToastContainer autoClose={2000} pauseOnFocusLoss={false} />

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <input type="search" placeholder="Search.." value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: 'none', width: '300px' }} />
        <button onClick={() => handleSubmit()}>Search</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 4fr))", gap: "20px", marginTop: "20px", }}>
        {images.map((list, idx) => (
          <div key={idx + 1} style={{ position: "relative", overflow: "hidden", borderRadius: "10px", }}>
            <img src={list?.urls?.small} alt={list?.alt_description}
              style={{ height: "15rem", objectFit: "cover", transition: "transform 0.3s ease", cursor: "pointer", }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <button onClick={() => handleSaveDelete(list)}>{list._id ? "delete" : "save"}</button>
            {/* <div ref={open === list.id ? ref : null} style={{ display: 'flex', cursor: 'pointer', justifyContent: 'space-around', position: "absolute", bottom: "10px", left: "10px", right: "10px", color: "#fff", background: "rgba(0, 0, 0, 0.4)", padding: "5px 10px", borderRadius: "6px", fontSize: "14px", }} onClick={() => setOpen(open === list.id ? null : list.id)} >
              <p style={{ padding: '0px', margin: '0px' }}>{list.width} X {list.height}</p>
              <span>
                ⋮
              </span>
              <div style={{ textAlign: 'left', position: 'absolute', display: open === list.id ? 'flex' : 'none', flexDirection: 'column', bottom: '1px', right: '10px', background: '#fff', color: '#000', padding: '10px', borderRadius: '5px' }}>
                {Object.keys(list.urls).map((dimg, idx) => {
                  return <span key={idx} onClick={() => handleDownload(list.urls[dimg], list.slug)} style={{ cursor: 'pointer', margin: '3px 0' }}>{dimg}</span>
                })}
              </div>
            </div> */}
          </div>
        ))}
      </div>
    </>
  )
}

export default App

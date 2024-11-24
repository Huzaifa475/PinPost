import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBackward } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router'

function Home() {
  const [view, setView] = useState('search')
  const [location, setLocation] = useState([28.5, 77])
  const navigate = useNavigate()

  const handlePost = () => {
    setView('review')
  }

  const handlePostBack = () => {
    setView('search')
  }

  const handleProfile = () => {
    navigate('/profile')
  }

  return (
    <div className='home-main-container'>
      <div className="home-left-container">
        <MapContainer center={location} zoom={10}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
      <div className="home-right-container">
        {
          view === 'search' && (
            <div className="right-main-container">
              <div className="search-bar">
                <input type="text" placeholder='Enter the location'/>
                <button>Submit</button>
              </div>
              <div className="posts-container">
                <div className="post-container" onClick={handlePost}>
                  <h1>Title</h1>
                  <h1>Description</h1>
                </div>
                <div className="post-container">
                  <h1>Title</h1>
                  <h1>Description</h1>
                </div>
              </div>
              <div className="profile-button">
                <button onClick={handleProfile}>Profile</button>
              </div>
            </div>
          )
        }
        {
          view === 'review' && (
            <div className="right-main-container">
              <div className="back-button" onClick={handlePostBack}>
                <FontAwesomeIcon icon={faArrowLeft}/>
              </div>
              <div className="post-container">
                <h1>Title</h1>
                <h1>Description</h1>
              </div>
              <div className="review-container">
                <h1>Title</h1>
                <h1>Description</h1>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home

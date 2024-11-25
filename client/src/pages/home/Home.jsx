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
                <input type="text" placeholder='Enter the location' />
                <button>Search</button>
              </div>
              <div className="category-container">
                <select name="" id="">
                  <option value="Restaurants">Restaurants</option>
                  <option value="Cafes">Cafes</option>
                  <option value="Sports Venues">Sports Venues</option>
                  <option value="Parks">Parks</option>
                  <option value="Movie Theaters">Movie Theaters</option>
                  <option value="Malls">Malls</option>
                  <option value="Museums">Museums</option>
                  <option value="Beaches">Beaches</option>
                  <option value="Libraries">Libraries</option>
                  <option value="Festivals">Festivals</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="posts-container">
                <div className="container-post" onClick={handlePost}>
                  <h1>Title</h1>
                  <h1>Description</h1>
                </div>
                <div className="container-post">
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
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              <div className="post-container">
                <h1>Title</h1>
                <h1>Description</h1>
              </div>
              <div className="reviews-container">
                <div className="review-container">
                  <h1>Title</h1>
                  <h1>Description</h1>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBackward } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostBasedOnLocation } from '../../redux/post'
import { createReview, fetchPostReview, resetReview } from '../../redux/review'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

const UpdateMapCenter = ({ newCenter }) => {
  const map = useMap()
  useEffect(() => {
    map.flyTo(newCenter, map.getZoom())
  }, [newCenter, map])

  return null;
}

function Home() {
  const [view, setView] = useState('search')
  const [location, setLocation] = useState([28.5, 77])

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [selectedPost, setSelectedPost] = useState(null)
  const [title, setTitle] = useState('')
  const [rating, setRating] = useState('')
  const [toastId, setToastId] = useState(null)
  const [whether, setWhether] = useState(null)
  const { searchPost, loading: postLoading, error: postError } = useSelector(state => state.post)
  const { searchReview, loading: reviewLoading, error:reviewError } = useSelector(state => state.review)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (location) {
      setLocation(location)
    }
  }, [setLocation])

  useEffect(() => {
    if(postLoading){
      const id = toast.loading('Loading, Wait for some time', {
        duration: Infinity
      })
      setToastId(id)
    }
    else{
      toast.dismiss(toastId)
    }
  }, [postLoading])

  useEffect(() => {
    if(reviewLoading){
      const id = toast.loading('Loading, Wait for some time', {
        duration: Infinity
      })
      setToastId(id)
    }
    else{
      toast.dismiss(toastId)
    }
  }, [reviewLoading])

  const handlePost = (post) => {
    dispatch(fetchPostReview(post._id))
    setSelectedPost(post)
    setView('review')
  }

  const handlePostBack = () => {
    dispatch(resetReview())
    setSelectedPost(null)
    setView('search')
  }

  const handleProfile = () => {
    navigate('/profile')
  }

  const handleSearch = async () => {
    dispatch(fetchPostBasedOnLocation({ address: search, category }))

    setSearch('')
    setCategory('')

    const accessToken = localStorage.getItem('accessToken')
    const response = await axios({
      method: 'get',
      url: '/api/v1/geocode',
      params: {
        address: search
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
    let lat = null, lng = null
    if (response.data?.data?.results[0]) {
      lat = response.data?.data?.results[0]?.geometry?.lat;
      lng = response.data?.data?.results[0]?.geometry?.lng;
      setLocation([lat, lng])
    }
    else {
      toast.error('Please write valid address')
      return;
    }

    try {
      const res = await axios({
        method: 'get',
        url: '/api/v1/whether',
        params: {
          lat,
          lng
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })
      setWhether(res.data.data.current)
      toast.success(`Temperature:${res.data.data.current.temperature} \n Whether:${res.data.data.current.weather_descriptions}`, {
        icon: <img src={res.data.data.current.weather_icons[0]} alt="Weather Icon" style={{ width: '20px', height: '20px' }} />,
        duration: 6000,
        position: 'bottom-left'
      })
    } catch (error) {
      toast.error("Failed to fetch weather information.", {
        position: 'bottom-left'
      });
    }
  }
  
  const handleCreateReview = (postId) => {
    dispatch(createReview({ title, rating }, postId))

    setTitle('')
    setRating('')
  }

  return (
    <div className='home-main-container'>
      <div className="home-left-container">
        <MapContainer center={location} zoom={10}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <UpdateMapCenter newCenter={location} />
          {
            searchPost && searchPost.length > 0 ?
              searchPost.map((post) => (
                <Marker key={post._id} position={post.location.coordinates}>
                  <Popup>
                    <p>Temperature: {whether?.temperature}</p>
                    <p>Whether Description: {whether?.weather_descriptions}</p>
                  </Popup>
                </Marker>
              ))
              :
              null
          }
        </MapContainer>
        <Toaster/>
      </div>
      <div className="home-right-container">
        {
          view === 'search' && (
            <div className="right-main-container">
              <div className="search-bar">
                <input type="text" placeholder='Enter the location' value={search} onChange={(e) => setSearch(e.target.value)} />
                <button onClick={handleSearch}>Search</button>
              </div>
              <div className="category-container">
                <select name="" id="" value={category} onChange={(e) => setCategory(e.target.value)}>
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

                {
                  searchPost && searchPost.length > 0 ?
                    searchPost.map((post) => (
                      <div className="container-post" key={post._id} onClick={() => handlePost(post)}>
                        <h1>{post.title}</h1>
                        <h1>{post.description}</h1>
                        <h1>{post.category}</h1>
                        <h1>{post.address}</h1>
                      </div>
                    ))
                    :
                    <div>No post to fetch</div>
                }
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
              <div className="review-create-container">
                <div className="review-create-title">
                  <p>Your review</p>
                </div>
                <div className="review-create-input">
                  <div className="review-create-inputs">
                    <label htmlFor="">Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <label htmlFor="">Rating</label>
                    <input type="text" value={rating} onChange={(e) => setRating(e.target.value)} />
                  </div>
                  <div className="review-create-button">
                    <button onClick={() => handleCreateReview(selectedPost._id)}>Create</button>
                  </div>
                </div>
              </div>
              <div className="post-container">
                <h1>{selectedPost.title}</h1>
                <h1>{selectedPost.description}</h1>
                <h1>{selectedPost.category}</h1>
                <h1>{selectedPost.address}</h1>
              </div>
              <div className="reviews-container">
                {
                  searchReview && searchReview.length > 0 ?
                    searchReview.map((review) => (
                      <div className="review-container" key={review._id}>
                        <h1>{review.title}</h1>
                        <h1>{review.rating}</h1>
                      </div>
                    ))
                    :
                    <div>No Review</div>
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home
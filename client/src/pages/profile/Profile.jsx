import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfile, updateProfile } from '../.././redux/profile.js'
import toast, { Toaster } from 'react-hot-toast'
import './index.css'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { fetchPost, createPost } from '../../redux/post.js'

function Profile() {

    const [view, setView] = useState('createPost')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [selectedFile, setSelectedFile] = useState('')
    const [postTitle, setPostTitle] = useState('')
    const [postDescription, setPostDescription] = useState('')
    const [postAddress, setPostAddress] = useState('')
    const [postCategory, setPostCategory] = useState('Restaurants')
    const [showPostDropdown, setShowPostDropdown] = useState(false)
    const [showReviewDropdown, setShowReviewDropdown] = useState(false)

    const { profile, loading, error } = useSelector(state => state.profile)
    const { post } = useSelector(state => state.post)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const accessToken = localStorage.getItem('accessToken')

    useEffect(() => {
        dispatch(fetchProfile())
        dispatch(fetchPost())
    }, [])

    console.log(post);
    

    const handleSignIn = () => {
        navigate('/', { replace: true })
    }

    const handleLogout = async () => {
        try {
            const res = await axios({
                method: 'post',
                url: '/api/v1/user/logout',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            localStorage.removeItem('accessToken')
            toast.success(res.data.message)
            setTimeout(() => {
                navigate('/', { replace: true })
            }, 500)
        } catch (error) {
            if (error.response) {
                if (error.response?.data?.message) {
                    toast.error(error.response?.data?.message)
                }
                else {
                    toast.error(error.request?.statusText)
                }
            }
            else if (error.request) {
                toast.error(error.request?.statusText)
            }
        }
    }

    const handleCreatePost = () => {
        dispatch(createPost({postTitle, postDescription, postCategory, postAddress}))

        setPostTitle('')
        setPostDescription('')
        setPostCategory('')
        setPostAddress('')
    }

    const handleUpdateInformation = () => {
        dispatch(updateProfile({ name, email, address }))

        setName('')
        setEmail('')
        setAddress('')
    }

    const handleFileSelect = async (e) => {
        e.preventDefault()
        const file = e.target.files[0]

        if (file) {
            setSelectedFile(file)

            const render = new FileReader()
            render.readAsDataURL(file)
        }
    }

    const handleUploadImage = async (e) => {
        e.preventDefault()
        try {
            if (!selectedFile) {
                throw new Error('Select a File');
            }

            const formData = new FormData();
            formData.append('photo', selectedFile);

            const response = await fetch('/api/v1/user/update-photo', {
                method: 'PATCH',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }
            toast.success(response.statusText)
        } catch (error) {
            toast.error('Error while uploading an image')
        }
    }

    return (
        <div className="profile-container">
            <div className="profile-main-container">

                <div className="profile-top-container">
                    <div className="profile-top-left-container">
                        {
                            profile.photo && (
                                <img src={profile.photo} alt="" />
                            )
                        }
                    </div>
                    <div className="profile-top-right-container">
                        <p>Name: {profile.name}</p>
                        <p>Email: {profile.email}</p>
                        <p>Address: {profile.address}</p>
                        {
                            accessToken === null ?
                                <button onClick={handleSignIn}>Sign In</button>
                                :
                                <button onClick={handleLogout}>Logout</button>
                        }
                    </div>
                </div>


                <div className="profile-sliding-bar">
                    <div className={`profile-update-container ${view === 'update' ? 'active' : ''}`} onClick={() => setView('update')}>
                        <p>Update User Information</p>
                    </div>
                    <div className={`profile-create-post-container ${view === 'createPost' ? 'active' : ''}`} onClick={() => setView('createPost')}>
                        <p>Create Post</p>
                    </div>
                    <div className={`profile-post-view-container ${view === 'post' ? 'active' : ''}`} onClick={() => setView('post')}>
                        <p>User Posts</p>
                    </div>
                    <div className={`profile-review-view-container ${view === 'review' ? 'active' : ''}`} onClick={() => setView('review')}>
                        <p>User Reviews</p>
                    </div>
                </div>


                {
                    view === 'update' && (
                        <div className="profile-update-containers">
                            <div className="profile-update-left-container">
                                <div className="update-name-container containers">
                                    <label htmlFor="">Name</label>
                                    <input type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="update-email-container containers">
                                    <label htmlFor="">Email</label>
                                    <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="update-address-container containers">
                                    <label htmlFor="">Address</label>
                                    <input type="text" placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} />
                                </div>
                                <div className="update-button containers">
                                    <button onClick={handleUpdateInformation}>Update</button>
                                    <Toaster />
                                </div>
                            </div>
                            <div className="profile-update-right-container">
                                <h1>Upload Profile Image Here</h1>
                                <form action="">
                                    <input type="file" accept="image/*" onChange={handleFileSelect} required />
                                    <br /><br />
                                    <button onClick={handleUploadImage}>Submit</button>
                                </form>
                            </div>
                        </div>
                    )
                }


                {
                    view === 'createPost' && (
                        <div className="profile-post-container">
                            <div className="profile-container-post">
                                <h1>Title</h1>
                                <input type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder='Title'/>
                            </div>
                            <div className="profile-container-post">
                                <h1>Description</h1>
                                <input type="text" value={postDescription} onChange={(e) => setPostDescription(e.target.value)} placeholder='Description'/>
                            </div>
                            <div className="profile-container-post">
                                <h1>Address</h1>
                                <input type="text" value={postAddress} onChange={(e) => setPostAddress(e.target.value)} placeholder='Address'/>
                            </div>
                            <div className="profile-container-post">
                                <select name="" id="" value={postCategory} onChange={(e) => setPostCategory(e.target.value)}>
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
                            <div className="profile-post-button">
                                <button onClick={handleCreatePost}>Create</button>
                            </div>
                        </div>
                    )
                }


                {
                    view === 'post' && (
                        post && post.length > 0 ? (
                            post.map((post) => (
                                <div className="posts-display-container" key={post._id}>
                                    <div className="post-display-container">
                                        <h1>{post.title}</h1>
                                        <h1>{post.description}</h1>
                                        <h1>{post.category}</h1>
                                        <h1>{post.location.coordinates}</h1>
                                        <div className="post-update-delete-container">
                                            <button onClick={() => setShowPostDropdown(prev => !prev)}>Update</button>
                                            <button>Delete</button>
                                        </div>
                                        {
                                            showPostDropdown === true && (
                                                <div className="post-display-dropdown">
                                                    <div className="post-display-dropdown-title">
                                                        <p>Title</p>
                                                        <input type="text" />
                                                    </div>
                                                    <div className="post-display-dropdown-description">
                                                        <p>Description</p>
                                                        <input type="text" />
                                                    </div>
                                                    <div className="post-display-dropdown-address">
                                                        <p>Address</p>
                                                        <input type="text" />
                                                    </div>
                                                    <div className="post-display-dropdown-category">
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
                                                    <div className="post-display-dropdown-button">
                                                        <button>Submit</button>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            ))
                        )
                        :
                        (
                            <div>No Post to fetch</div>
                        )
                    )
                }


                {
                    view === 'review' && (
                        <div className="reviews-display-container">
                            <div className="review-display-container">
                                <h1>Title</h1>
                                <h1>Description</h1>
                                <div className="review-update-delete-container">
                                    <button onClick={() => setShowReviewDropdown(prev => !prev)}>Update</button>
                                    <button>Delete</button>
                                </div>
                                {
                                    showReviewDropdown === true && (
                                        <div className="review-display-dropdown">
                                            <div className="review-display-dropdown-title">
                                                <p>Title</p>
                                                <input type="text" />
                                            </div>
                                            <div className="review-display-dropdown-rating">
                                                <p>Rating(1 to 5): </p>
                                                <input type="number" min={1} max={5} />
                                            </div>
                                            <div className="review-display-dropdown-button">
                                                <button>Submit</button>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default Profile

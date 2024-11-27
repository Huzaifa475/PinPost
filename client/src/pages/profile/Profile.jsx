import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProfile, updateProfile } from '../.././redux/profile.js'
import toast, { Toaster } from 'react-hot-toast'
import './index.css'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { fetchPost, createPost, deletePost, updatePost } from '../../redux/post.js'
import { deleteReview, fetchReview, updateReview } from '../../redux/review.js'

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
    const [selectedPost, setSelectedPost] = useState(null)
    const [updatePostTitle, setUpdatePostTitle] = useState('')
    const [updatePostDescription, setUpdatePostDescription] = useState('')
    const [updatePostAddress, setUpdatePostAddress] = useState('')
    const [updatePostCategory, setUpdatePostCategory] = useState('Restaurants')

    const [showReviewDropdown, setShowReviewDropdown] = useState(false)
    const [selectedReview, setSelectedReview] = useState(null)
    const [updateReviewTitle, setUpdateReviewTitle] = useState('')
    const [updateReviewRating, setUpdateReviewRating] = useState('')

    const [toastId, setToastId] = useState(null)

    const { profile, loading: profileLoading, error: profileError } = useSelector(state => state.profile)
    const { post, loading: postLoading, error: postError } = useSelector(state => state.post)
    const { review, loading: reviewLoading, error: reviewError } = useSelector(state => state.review)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const accessToken = localStorage.getItem('accessToken')

    useEffect(() => {
        dispatch(fetchProfile())
    }, [])

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

    useEffect(() => {
        if(profileLoading){
            const id = toast.loading('Loading, Wait for some time', {
                duration: Infinity
            })
            setToastId(id)
        }
        else{
            toast.dismiss(toastId)
        }
    }, [profileLoading])

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

    const handleCreatePost = () => {
        dispatch(createPost({ postTitle, postDescription, postCategory, postAddress }))

        setPostTitle('')
        setPostDescription('')
        setPostCategory('Restaurants')
        setPostAddress('')
    }

    const handlePostView = () => {
        dispatch(fetchPost())
        setView('post')
    }

    const handleShowPostDropdown = (post) => {
        if (selectedPost === post._id) {
            setSelectedPost(null)
            setShowPostDropdown(false)
        }
        else {
            setSelectedPost(post._id)
            setShowPostDropdown(true)
        }
    }

    const handleUpdatePost = (postId) => {
        dispatch(updatePost({ title: updatePostTitle, description: updatePostDescription, category: updatePostCategory, address: updatePostAddress }, postId))

        setUpdatePostTitle('')
        setUpdatePostDescription('')
        setUpdatePostCategory('Restaurants')
        setUpdatePostAddress('')
    }

    const handleReviewView = () => {
        dispatch(fetchReview())
        setView('review')
    }

    const handleShowReviewDropdown = (review) => {
        if (selectedReview === review._id) {
            setSelectedReview(null)
            setShowReviewDropdown(false)
        }
        else {
            setSelectedReview(review._id)
            setShowReviewDropdown(true)
        }
    }

    const handleUpdateReview = (reviewId) => {
        dispatch(updateReview({ title: updateReviewTitle, rating: updateReviewRating }, reviewId))

        setUpdateReviewTitle('')
        setUpdateReviewRating('')
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
                    <div className={`profile-post-view-container ${view === 'post' ? 'active' : ''}`} onClick={handlePostView}>
                        <p>User Posts</p>
                    </div>
                    <div className={`profile-review-view-container ${view === 'review' ? 'active' : ''}`} onClick={handleReviewView}>
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
                                    <Toaster/>
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
                                <input type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder='Title' />
                            </div>
                            <div className="profile-container-post">
                                <h1>Description</h1>
                                <input type="text" value={postDescription} onChange={(e) => setPostDescription(e.target.value)} placeholder='Description' />
                            </div>
                            <div className="profile-container-post">
                                <h1>Address</h1>
                                <input type="text" value={postAddress} onChange={(e) => setPostAddress(e.target.value)} placeholder='Address' />
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
                                <Toaster />
                            </div>
                        </div>
                    )
                }


                {
                    view === 'post' && (
                        <div className="posts-display-container" >
                            <Toaster/>
                            {
                                post && post.length > 0 ? (
                                    post.map((post) => (
                                        <div className="post-display-container" key={post._id}>
                                            <h1>{post.title}</h1>
                                            <h1>{post.description}</h1>
                                            <h1>{post.category}</h1>
                                            <h1>{post.address}</h1>
                                            <div className="post-update-delete-container">
                                                <button onClick={() => handleShowPostDropdown(post)}>Update</button>
                                                <button onClick={() => dispatch(deletePost(post._id))}>Delete</button>
                                            </div>
                                            {
                                                showPostDropdown && selectedPost === post._id && (
                                                    <div className="post-display-dropdown">
                                                        <div className="post-display-dropdown-title">
                                                            <p>Title</p>
                                                            <input type="text" value={updatePostTitle} onChange={(e) => setUpdatePostTitle(e.target.value)} placeholder='Title' />
                                                        </div>
                                                        <div className="post-display-dropdown-description">
                                                            <p>Description</p>
                                                            <input type="text" value={updatePostDescription} onChange={(e) => setUpdatePostDescription(e.target.value)} placeholder='Description' />
                                                        </div>
                                                        <div className="post-display-dropdown-address">
                                                            <p>Address</p>
                                                            <input type="text" value={updatePostAddress} onChange={(e) => setUpdatePostAddress(e.target.value)} placeholder='Address' />
                                                        </div>
                                                        <div className="post-display-dropdown-category">
                                                            <select name="" id="" value={updatePostCategory} onChange={(e) => setUpdatePostCategory(e.target.value)}>
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
                                                            <button onClick={() => handleUpdatePost(post._id)}>Update</button>
                                                            <Toaster />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ))
                                )
                                    :
                                    (
                                        <div>No Post to fetch</div>
                                    )
                            }
                        </div>
                    )
                }


                {
                    view === 'review' && (
                        <div className="reviews-display-container">
                            <Toaster/>
                            {
                                review && review.length > 0 ?
                                    review.map((review) => (
                                        <div className="review-display-container" key={review._id}>
                                            <h1>Title: {review.title}</h1>
                                            <h1>Rating: {review.rating}</h1>
                                            <div className="review-update-delete-container">
                                                <button onClick={() => handleShowReviewDropdown(review)}>Update</button>
                                                <button onClick={() => dispatch(deleteReview(review._id))}>Delete</button>
                                            </div>
                                            {
                                                showReviewDropdown && selectedReview === review._id && (
                                                    <div className="review-display-dropdown">
                                                        <div className="review-display-dropdown-title">
                                                            <p>Title</p>
                                                            <input type="text" value={updateReviewTitle} onChange={(e) => setUpdateReviewTitle(e.target.value)} placeholder='Title'/>
                                                        </div>
                                                        <div className="review-display-dropdown-rating">
                                                            <p>Rating(1 to 5): </p>
                                                            <input type="number" min={1} max={5} value={updateReviewRating} onChange={(e) => setUpdateReviewRating(e.target.value)} placeholder='2'/>
                                                        </div>
                                                        <div className="review-display-dropdown-button">
                                                            <button onClick={() => handleUpdateReview(review._id)}>Submit</button>
                                                            <Toaster/>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ))
                                    :
                                    <div>No Review fetch</div>
                            }
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default Profile

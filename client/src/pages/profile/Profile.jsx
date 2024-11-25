import React, { useState } from 'react'
import './index.css'

function Profile() {

    const [view, setView] = useState('createPost')

    return (
        <div className="profile-container">
            <div className="profile-main-container">

                <div className="profile-top-container">
                    <div className="profile-top-left-container">
                        <img src="https://www.shutterstock.com/image-photo/calm-weather-on-sea-ocean-600nw-2212935531.jpg" alt="" />
                    </div>
                    <div className="profile-top-right-container">
                        <p>Name: </p>
                        <p>Email: </p>
                        <p>Address</p>
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
                                    <input type="text" />
                                </div>
                                <div className="update-email-container containers">
                                    <label htmlFor="">Email</label>
                                    <input type="text" />
                                </div>
                                <div className="update-address-container containers">
                                    <label htmlFor="">Address</label>
                                    <input type="text" />
                                </div>
                                <div className="update-button containers">
                                    <button>Update</button>
                                </div>
                            </div>
                            <div className="profile-update-right-container">
                                <h1>Upload Profile Image Here</h1>
                                <form action="">
                                    <input type="file" accept="image/*" required/>
                                    <br /><br />
                                    <button>Submit</button>
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
                                <input type="text" />
                            </div>
                            <div className="profile-container-post">
                                <h1>Description</h1>
                                <input type="text" />
                            </div>
                            <div className="profile-container-post">
                                <h1>Address</h1>
                                <input type="text" />
                            </div>
                            <div className="profile-container-post">
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
                            <div className="profile-post-button">
                                <button>Create</button>
                            </div>
                        </div>
                    )
                }


                {
                    view === 'post' && (
                        <div className="posts-display-container">
                            <div className="post-display-container">
                                <h1>Title</h1>
                                <h1>Description</h1>
                                <h1>Category</h1>
                                <h1>Location</h1>
                            </div>
                        </div>
                    )
                }


                {
                    view === 'review' && (
                        <div className="reviews-display-container">
                            <div className="review-display-container">
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

export default Profile

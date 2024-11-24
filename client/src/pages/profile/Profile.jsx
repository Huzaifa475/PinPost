import React, { useState } from 'react'
import './index.css'

function Profile() {

    const [view, setView] = useState('createPost')

    return (
        <div className="profile-container">
            <div className="profile-main-container">

                <div className="profile-top-container">
                    <div className="profile-top-left-container">
                        <img src="" alt="" />
                        <p>yes</p>
                    </div>
                    <div className="profile-top-right-container">
                        <p>Name: </p>
                        <p>Email: </p>
                        <p>Address</p>
                    </div>
                </div>


                <div className="profile-sliding-bar">
                    <div className="profile-update-container">
                        <p>Update User Information</p>
                    </div>
                    <div className="profile-create-post-container">
                        <p>Create Post</p>
                    </div>
                    <div className="profile-post-view-container">
                        <p>User Posts</p>
                    </div>
                    <div className="profile-review-view-container">
                        <p>User Reviews</p>
                    </div>
                </div>


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
                    ``
                }

            </div>
        </div>
    )
}

export default Profile

import { configureStore } from "@reduxjs/toolkit";
import profileReducer from './profile.js'
import postReducer from './post.js'
import reviewReducer from './review.js'

const store = configureStore({
    reducer: {
        profile: profileReducer,
        post: postReducer,
        review: reviewReducer
    }
})

export default store;
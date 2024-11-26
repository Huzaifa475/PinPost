import { configureStore } from "@reduxjs/toolkit";
import profileReducer from './profile.js'
import postReducer from './post.js'

const store = configureStore({
    reducer: {
        profile: profileReducer,
        post: postReducer
    }
})

export default store;
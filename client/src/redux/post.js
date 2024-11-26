import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import dotenv from "dotenv";

axios.defaults.withCredentials = true
export const fetchPost = () => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'get',
            url: '/api/v1/post/search-user',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setPost(res.data.data))
    } catch (error) {
        dispatch(setError(error))
    }
}

export const createPost = ({postTitle, postDescription, postCategory, postAddress}) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const response = await axios({
            method: 'get',
            url: '/api/v1/geocode',
            params: {
                address: postAddress
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })

        const {lat, lng} = response.data.data.results[0].geometry;
        
        const res = await axios({
            method: 'post',
            url: '/api/v1/post/create',
            data: {
                title: postTitle,
                description: postDescription,
                category: postCategory,
                location: {
                    type: 'Point',
                    coordinates: [lat, lng]
                }
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(fetchPost())
        toast.success(res.data.message)
    } catch (error) {
        dispatch(setError(error))
    }
}

const initialState = {
    post: {},
    loading: false,
    error: null
}

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setPost: (state, action) => {
            if(Array.isArray(action.payload)){
                state.post = action.payload
            }
            else{
                state.post = [action.payload, ...state.post]
            }
            state.loading = false,
            state.error = null
        },
        setLoading: (state) => {
            state.loading = true
        },
        setError: (state, action) => {
            state.loading = false,
            state.error = action.payload
        },
        resetPost: () => {}
    }
})

export const {setPost, setLoading, setError, resetPost} = postSlice.actions
export default postSlice.reducer
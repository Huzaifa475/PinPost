import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true
export const fetchReview = () => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'get',
            url: '/api/v1/review/search-user',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setReview(res.data.data))
        toast.success(res.data.message)
    } catch (error) {
        dispatch(setError(error))
    }
}

export const fetchPostReview = (postId) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'get',
            url: `/api/v1/review/search-post/${postId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setSearchReview(res.data.data))
        toast.success(res.data.message)
    } catch (error) {
        dispatch(setError(error))
    }
}

export const createReview = ({title, rating}, postId) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'post',
            url: `/api/v1/review/create/${postId}`,
            data: {
                title,
                rating
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(fetchPostReview(postId))
        toast.success(res.data.message)
    } catch (error) {
        dispatch(setError(error))
    }
}

export const deleteReview = (reviewId) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'post',
            url: `/api/v1/review/delete/${reviewId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(fetchReview())
        toast.success(res.data.message)
    } catch (error) {
        dispatch(setError(error))
    }
}

export const updateReview = ({title, rating}, reviewId) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'patch',
            url: `/api/v1/review/update/${reviewId}`,
            data: {
                title,
                rating
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(fetchReview())
        toast.success(res.data.message)
    } catch (error) {
        dispatch(setError(error))
    }
}

const initialState = {
    review: {},
    searchReview: {},
    loading: false,
    error: null
}

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        setReview: (state, action) => {
            if(Array.isArray(action.payload)){
                state.review = action.payload
            }
            else{
                state.review = [action.payload, ...state.review]
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
        setSearchReview: (state, action) => {
            state.searchReview = action.payload
            state.loading = false,
            state.error = null
        },
        resetReview: () => {}
    }
})

export const {setReview, setLoading, setError, setSearchReview, resetReview} = reviewSlice.actions
export default reviewSlice.reducer
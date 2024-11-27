import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

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
        toast.success(res.data.message)
    } catch (error) {
        dispatch(setError(error))
    }
}

export const fetchPostBasedOnLocation = ({address, category}) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        console.log(address);
        
        const res = await axios({
            method: 'get',
            url: '/api/v1/post/search-location',
            params: {
                address,
                category
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setSearchPost(res.data.data))
        toast.success(res.data.message)
    } catch (error) {
        dispatch(setError(error.message))
    }
}

export const createPost = ({postTitle, postDescription, postCategory, postAddress}) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        if(!postAddress){
            toast.error('Please enter the address')
            return;
        }
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

        let lat = null, lng = null
        if(response.data?.data?.results[0]){
            lat = response.data?.data?.results[0]?.geometry?.lat;
            lng = response.data?.data?.results[0]?.geometry?.lng;
        }
        else{
            toast.error('Please write valid address')
            return;
        }
        
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
                },
                address: postAddress
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(fetchPost())
        toast.success(res.data.message)
    } catch (error) {
        dispatch(setError(error.message))
    }
}

export const deletePost = (postId) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'post',
            url: `/api/v1/post/delete/${postId}`,
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

export const updatePost = ({title, description, category, address}, postId) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        let lat = null, lng = null
        if(address){
            const response = await axios({
                method: 'get',
                url: '/api/v1/geocode',
                params: {
                    address
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            lat = response?.data?.data?.results[0]?.geometry?.lat
            lng = response?.data?.data?.results[0]?.geometry?.lng
        }
        
        if((!lat || !lng) && address){
            toast.error('Please write valid address')
        }

        const updateFields = {}
        if(title) updateFields.title = title
        if(description) updateFields.description = description
        if(category) updateFields.category = category
        if(address) updateFields.address = address
        if(lat && lng) updateFields.location = {
            type: 'Point',
            coordinates: [lat, lng]
        }

        const res = await axios({
            method: 'patch',
            url: `/api/v1/post/update/${postId}`,
            data: {
                ...updateFields
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(fetchPost())
        toast.success(res.data.message)
    } catch (error) {
        dispatch(setError(error.message))
    }
}

const initialState = {
    post: {},
    searchPost: {},
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
        setSearchPost: (state, action) => {
            state.searchPost = action.payload,
            state.loading = false,
            state.error = null
        },
        resetPost: () => {}
    }
})

export const {setPost, setLoading, setError, setSearchPost, resetPost} = postSlice.actions
export default postSlice.reducer
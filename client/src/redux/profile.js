import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import axios from 'axios'

axios.defaults.withCredentials = true
export const fetchProfile = () => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const res = await axios({
            method: 'get',
            url: '/api/v1/user/get-current-user',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(setProfile(res.data.data))
    } catch (error) {
        dispatch(setError(error))
    }
}

export const updateProfile = ({name, email, address, location}) => async(dispatch) => {
    const accessToken = localStorage.getItem('accessToken')
    try {
        dispatch(setLoading())
        const updateFields = {}
        if(name) updateFields.name = name
        if(email) updateFields.email = email
        if(address) updateFields.address = address
        if(location) updateFields.location = location
        const res = await axios({
            method: 'patch',
            url: '/api/v1/user/update-information',
            data: {
                ...updateFields
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        dispatch(fetchProfile())
        toast.success(res.data?.message)
    } catch (error) {
        dispatch(setError(error))
    }
}

const initialState = {
    profile: {},
    loading: false,
    error: null
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload
            state.loading = false
            state.error = null
        },
        setLoading: (state) => {
            state.loading = true
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        resetProfile: () => {}
    }
})

export const {setProfile, setLoading, setError, resetProfile} = profileSlice.actions
export default profileSlice.reducer
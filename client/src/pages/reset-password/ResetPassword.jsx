import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import './index.css'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router'

function ResetPassword() {

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const navigate = useNavigate()
    const {token} = useParams()

    const handleResetPassword = async () => {
        let res
        try {
            res = await axios({
                method: 'patch',
                url: `/api/v1/user/reset-password/${token}`,
                data: {
                    password, 
                    confirmPassword
                }
            })
            toast.success(res?.data?.message)
            setTimeout(() => {
                navigate('/', {replace: true})
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
        setPassword('')
        setConfirmPassword('')
    }

  return (
    <div className="reset-password-container">
        <div className="main-reset-password-container">
            <div className="reset-password-container-title">
                <h1>Reset Title</h1>
            </div>
            <div className="reset-password-container-input">
                <label htmlFor="password">Password</label>
                <input type="password" name='password'placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" name='confirmPassword' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            </div>
            <div className="reset-password-container-button">
                <button onClick={handleResetPassword}>Reset Password</button>
                <Toaster/>
            </div>
        </div>
    </div>
  )
}

export default ResetPassword
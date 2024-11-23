import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import './index.css'

function ForgotPassword() {

  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleClick = async () => {
    let res
    try {
      res = await axios({
        method: 'post',
        url: '/api/v1/user/forgot-password',
        data: {
          email
        }
      })
      toast.success(res.data?.message)
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 500)
      setEmail('')
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
    setEmail('')
  }

  return (
    <>
      <div className="forgot-password-container">
        <div className="main-forgot-password-container">
          <div className="forgot-password-container-title">
            <h1>Forgot Password</h1>
          </div>
          <div className="forgot-password-container-input">
            <label htmlFor="email">Email</label>
            <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="forgot-password-container-button">
            <button onClick={handleClick}>Submit</button>
            <Toaster/>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword

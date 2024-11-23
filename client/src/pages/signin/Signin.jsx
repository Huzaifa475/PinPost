import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import toast, {Toaster} from 'react-hot-toast'
import axios from 'axios'
import './index.css'

function Signin() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleSignin = async () => {
        let res
        try {
            res = await axios({
                method: 'post',
                url: '/api/v1/user/login',
                data: {
                    email,
                    password
                }
            })
            toast.success(res.data.message)
            setTimeout(() => {
                navigate('/home', {replace: true})
            }, 500)
        } catch (error) {
            if(error.response){
                if(error.response?.data?.message){
                    toast.error(error.response?.data?.message)
                }
                else{
                    toast.error(error.request?.statusText)
                }
            }
            else if(error.request){
                toast.error(error.request?.statusText)
            }
        }
        setEmail('')
        setPassword('')
    }

    const handleGoogleSignUp = async () => {
        try {
            window.location.href = 'http://localhost:5000/api/v1/user/google';
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
            toast.error(errorMessage)
        }
    }

    return (
        <>
            <div className="main-container">
                <div className="signin-containers">
                    <div className="title-container">
                        <h1>Sign In</h1>
                    </div>
                    <div className="input-container-signin">
                        <div className="container-signin">
                            <h1>Email</h1>
                            <input type="text" name='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="container-signin">
                            <h1>Password</h1>
                            <div className="password-container-signin">
                                <input type={showPassword ? "text" : "password"} name='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                                <button onClick={() => setShowPassword(prev => !prev)}><FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash}/></button>
                            </div>
                        </div>
                    </div>
                    <div className="forgot-password">
                        <Link to='forgot-password' relative='path'>Forgot Password?</Link>
                    </div>
                    <div className='signin-button-container'>
                        <button onClick={handleSignin}>Sign In</button>
                        <Toaster/>
                    </div>
                    <div className="google-container">
                        <button onClick={handleGoogleSignUp}>Continue With Google</button>
                    </div>
                    <div className="signup-container">
                        <p>Don't have an account?<span><Link to='/signup' relative='path'>SignUp</Link></span></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signin
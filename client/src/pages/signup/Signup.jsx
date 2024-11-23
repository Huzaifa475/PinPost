import React, { useState } from 'react'
import axios from 'axios'
import { Link, replace, useNavigate } from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import toast, {Toaster} from 'react-hot-toast'
import './index.css'

function Signup() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    axios.defaults.withCredentials = true
    const handleSignup = async () => {
        let res
        try {
            res = await axios({
                method: 'post',
                url: '/api/v1/user/register',
                data: {
                    name,
                    email,
                    password
                }
            })
            toast.success(res?.data?.message)
            setTimeout(() => {
                navigate('/', {replace: true})
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
        setName('')
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
                <div className="signup-containers">
                    <div className="title-container">
                        <h1>Sign Up</h1>
                    </div>
                    <div className="input-container">
                        <div className="container">
                            <h1>Name</h1>
                            <input type="text" name='name' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className="container">
                            <h1>Email</h1>
                            <input type="text" name='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="container">
                            <h1>Password</h1>
                            <div className="password-container">
                                <input type={showPassword ? "text" : "password"} name='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                                <button onClick={() => setShowPassword(prev => !prev)}><FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash}/></button>
                            </div>
                        </div>
                    </div>
                    <div className='signup-button-container'>
                        <button onClick={handleSignup}>Sign Up</button>
                        <Toaster/>
                    </div>
                    <div className="google-container">
                        <button onClick={handleGoogleSignUp}>Continue With Google</button>
                    </div>
                    <div className="signin-container">
                        <p>Already Have Account?<span><Link to="/" relative='path'>SignIn</Link></span></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup
import {Routes, Route} from "react-router-dom"
import Signup from "./pages/signup/Signup"
import Signin from "./pages/signin/Signin"
import Home from "./pages/home/Home"
import ForgotPassword from "./pages/forgot-password/ForgotPassword"
import ResetPassword from "./pages/reset-password/ResetPassword"
import './App.css'
import Profile from "./pages/profile/Profile"

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Signin/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/reset-password/:token' element={<ResetPassword/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
    </>
  )
}

export default App

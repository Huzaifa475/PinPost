import express from 'express';
import passport from "../config/passport-setup.js";
import {loginUser, registerUser} from "../controller/user.controller.js";
import { apiResponse } from '../util/apiResponse.js';

const router = express.Router();

router.route('/register', registerUser)

router.route('/login', loginUser)

router.get('/google', passport.authenticate('google', {
    scope: ['profile'],
    prompt: 'consent'
}))

router.get(
    "/google/callback",
    passport.authenticate("google"),
    async(req, res) => {
        try {
            const {user, tokens} = req.user

            const options = {
                httpOnly: true,
                secure: true
            }
    
            return res
                .status(200)
                .cookie("accessToken", tokens.accessToken, options)
                .cookie("refreshToken", tokens.refreshToken, options)
                .json(new apiResponse(200, {login: user, tokens}, "User loggedIn successfully"))
        } catch (error) {
            console.log("Error occured while logging the user", error);
        }
    }
);

export default router;
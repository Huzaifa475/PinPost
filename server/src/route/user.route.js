import express from 'express';
import passport from "../config/passport-setup.js";
import {addUserInformation, forgotPassword, getCurrentUser, loginUser, logoutUser, registerUser, resetPassword, updatePhoto, updateUserInformation, uploadPhoto} from "../controller/user.controller.js";
import { apiResponse } from '../util/apiResponse.js';
import {verifyJwt} from '../middleware/auth.middleware.js';
import {upload} from '../middleware/multer.middleware.js';

const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/logout').post(verifyJwt, logoutUser);

router.route('/add-information').post(verifyJwt, addUserInformation);

router.route('/update-information').patch(verifyJwt, updateUserInformation);

router.route('/upload-photo').post(verifyJwt, upload.single('photo'), uploadPhoto);

router.route('/update-photo').patch(verifyJwt, upload.single('photo'), updatePhoto);

router.route('/get-current-user').get(verifyJwt, getCurrentUser);

router.route('/forgot-password').post(forgotPassword);

router.route('/reset-password/:token').patch(resetPassword);

router.get('/google', passport.authenticate('google', {
    scope: ['profile'],
    prompt: 'consent'
}));

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
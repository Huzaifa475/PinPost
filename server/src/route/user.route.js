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
    scope: ['profile', 'email'],
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

            res.cookie("accessToken", tokens.accessToken, options)
            res.cookie("refreshToken", tokens.refreshToken, options)
            res.redirect(`http://localhost:5173/home?login=${user.name}`)
        } catch (error) {
            res.redirect("http://localhost:5173")
        }
    }
);

export default router;
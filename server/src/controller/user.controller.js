import {apiResponse} from "../util/apiResponse.js"
import {apiError} from "../util/apiError.js"
import {asyncHandler} from "../util/asyncHandler.js"
import {User} from "../model/user.model.js"
import {uploadOnCloudinary, deleteFromCloudinary} from "../util/uploadOnCloudinary.js"
import sendEmail from "../util/nodemailer.js"
import crypto from "crypto"

const generateAccessRefreshToken = async (userId) => {
    try {   
        const user = await User.findById(userId);

        const refreshToken = await user.generateRefreshToken()
        const accessToken = await user.generateAccessToken()

        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave: false})

        return {refreshToken, accessToken}
    } catch (error) {
        throw new apiError(500, "Server error, User login Failed")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const {name, email, password} = req.body;

    if(!name || !email || !password){
        throw new apiError(400, "All fields are required");
    }

    const isUserExists = await User.findOne({name})

    if(isUserExists){
        throw new apiError(409, "User already exists");
    }

    const user = await User.create({
        name,
        password,
        email
    })

    const isUserCreated = await User.findById(user?._id).select("-password -refreshToken")

    if(!isUserCreated){
        throw new apiError(500, "Server error, User not created")
    }

    return res
        .status(201)
        .json(new apiResponse(201, isUserCreated, "User registered successfully"))
})

const loginUser = asyncHandler(async (req, res) => {

    const {name, email, password} = req.body;

    if((!name && !email) || !password){
        throw new apiError(400, "All fields are required")
    }

    const isUserExists = await User.findOne({$or: [{name}, {email}]})

    if(!isUserExists){
        throw new apiError(403, "User does not exists")
    }

    const isPasswordValid = await isUserExists.isValidPassword(password);

    if(!isPasswordValid){
        throw new apiError(403, "Password is incorrect")
    }

    const {refreshToken, accessToken} = await generateAccessRefreshToken(isUserExists?._id);

    const logedInUser = await User.findById(isUserExists?._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new apiResponse(200, {user: logedInUser, refreshToken, accessToken}, "User loggedIn successfully"))
})

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: true
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, "User loged out successfully"))
})

const addUserInformation = asyncHandler(async (req, res) => {

    const {address, location} = req.body;

    if(!address){
        throw new apiError(403, "All fields are required")
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            address,
            location
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new apiResponse(200, updatedUser, "User updated successfully"))
})

const updateUserInformation = asyncHandler(async(req, res) => {

    const {name, address, location} = req.body

    const updateFields = {}

    if(name){
        updateFields.name = name
    }

    if(address){
        updateFields.address = address,
        updateFields.location = location
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                ...updateFields
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new apiResponse(200, updatedUser, "User information updated successfully"))
})

const uploadPhoto = asyncHandler(async (req, res) => {

    const photoPath = req.file?.path 

    if(!photoPath){
        throw new apiError(403, "Photo is not provided")
    }

    const photo = await uploadOnCloudinary(photoPath)

    if(!photo){
        throw new apiError(500, "Something went wrong while uploading photo on Cloudinary")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            photo: photo.url
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new apiResponse(200, user, "User's photo uploaded"))
})

const updatePhoto = asyncHandler(async (req, res) => {

    const oldImageUrl = req.user?.photo;

    const regex =  /https?:\/\/res\.cloudinary\.com\/[^\/]+\/image\/upload\/v\d+\/([^\.]+)\.(jpg|jpeg|png|gif|bmp|webp|tiff|svg)/;

    const publicId = oldImageUrl.match(regex);

    await deleteFromCloudinary(publicId[1]);

    const photoPath = req.file?.path

    if(!photoPath){
        throw new apiError(403, "Photo is not provided")
    }

    const photo = await uploadOnCloudinary(photoPath)

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            photo: photo.url
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(new apiResponse(200, user, "User's photo updated successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    
    const currentUser = await User.findById(req.user?._id).select("-password -refreshToken")

    return res
        .status(200)
        .json(new apiResponse(200, currentUser, "Current user fetch successfully"))

})

const forgotPassword = asyncHandler(async (req, res) => {

    const {email} = req.body;

    if(!email){
        throw new apiError(403, "All fields are required")
    }

    const user = await User.findOne({email});

    const resetToken = await user.createResetPasswordToken()

    await user.save({validateBeforeSave: false})

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/reset-password/${resetToken}`;
    const message = `We have received a password reset request. Please use the below link to reset the password.\n\n${resetUrl}\n\nThis reset password link is valid only for 10 minutes.`
     
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password change request from PinPost',
            message: message
        })
    } catch (error) {
        user.passwordResetToken = undefined
        user.passwordResetTokenExpiry = undefined

        await user.save({validateBeforeSave: false})

        throw new apiError(500, 'Something went wrong while sending the email.')
    }
})

const resetPassword = asyncHandler(async (req, res) => {

    const passwordResetToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({passwordResetToken, passwordResetTokenExpiry: {$gt: Date.now()}}).select("-password -refreshToken")

    if(!user){
        throw new apiError(409, "Tokens are invalid or expired")
    }

    if(req.body.password !== req.body.confirmPassword){
        throw new apiError(402, "Please enter the correct password")
    }

    user.password = req.body.password
    user.passwordResetToken = undefined
    user.passwordResetTokenExpiry = undefined
    user.passwordChangedAt = Date.now()

    await user.save({validateBeforeSave: true})

    return res
        .status(200)
        .json(new apiResponse(200, user, "Password changed successfully"))
})

export {registerUser, loginUser, logoutUser, addUserInformation, updateUserInformation, uploadPhoto, updatePhoto, getCurrentUser, forgotPassword, resetPassword, generateAccessRefreshToken}
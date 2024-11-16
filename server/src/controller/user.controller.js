import {apiResponse} from "../util/apiResponse.js"
import {apiError} from "../util/apiError.js"
import {asyncHandler} from "../util/asyncHandler.js"
import {User} from "../model/user.model.js"

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

    const {name, password} = req.body;

    if(!name || !password){
        throw new apiError(400, "All fields are required");
    }

    const isUserExists = await User.findOne({name})

    if(isUserExists){
        throw new apiError(409, "User already exists");
    }

    const user = await User.create({
        name,
        password
    })

    const isUserCreated = await User.findById(user?._id).select("-password -refreshToken")

    if(!isUserCreated){
        throw new apiError(500, "Server error, User not created")
    }

    return res
        .status(201)
        .json(new apiResponse(201, user, "User registered successfully"))
})

const loginUser = asyncHandler(async (req, res) => {

    const {name, password} = req.body;

    if(!name || !password){
        throw new apiError(400, "All fields are required")
    }

    const isUserExists = await User.findOne({name})

    if(!isUserExists){
        throw new apiError(403, "User does not exists")
    }

    const isPasswordValid = await isUserExists.isValidPassword(password);

    if(!isPasswordValid){
        throw new apiError(403, "Password is incorrect")
    }

    const {refreshToken, accessToken} = generateAccessRefreshToken(isUserExists?._id);

    const logedInUser = await User.findById(isUserExists?._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new apiResponse(200, {user: logedInUser, refreshToken, accessToken}), "User loggedIn successfully")
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

export {registerUser, loginUser, logoutUser, generateAccessRefreshToken}
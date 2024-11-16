import { User } from "../model/user.model";
import { apiError } from "../util/apiError";
import { asyncHandler } from "../util/asyncHandler";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");

        if(!token){
            throw new apiError(402, "Unauthorized request")
        }

        const decodedToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select('-password -refreshToken')

        if(!user){
            throw new apiError(402, "Invalid accessToken")
        }

        req.user = user
        next()

    } catch (error) {
        throw new apiError(405, "Invalid accessToken" || error?.msg)
    }
})
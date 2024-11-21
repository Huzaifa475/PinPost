import { isValidObjectId } from "mongoose";
import { Review } from "../model/review.model.js";
import { apiError } from "../util/apiError.js";
import { apiResponse } from "../util/apiResponse.js";
import { asyncHandler } from "../util/asyncHandler.js";


//Create a review for a post
const createReview = asyncHandler(async (req, res) => {

    const {title, rating} = req.body
    const {postId} = req.params

    if(!title || !rating){
        throw new apiError(403, "All fields are required")
    }
    
    const review = await Review.create({
        title, 
        rating,
        createdBy: req.user?._id,
        onWhich: postId
    })

    if(!review){
        throw new apiError(500, "Server error, while creating review")
    }

    return res
        .status(200)
        .json(new apiResponse(200, review, "Review created successfully"))
})

//Delete a review 
const deleteReview = asyncHandler(async (req, res) => {

    const {reviewId} = req.params

    if(!isValidObjectId(reviewId)){
        throw new apiError(402, "Review does not exists")
    }

    const review = await Review.findById(reviewId)

    if(!review){
        throw new apiError(402, "Review does not exists")
    }

    if(!review.createdBy.equals(req.user?._id)){
        throw new apiError(404, "Invalid request")
    }

    await Review.findByIdAndDelete(reviewId)

    return res
        .status(200)
        .json(new apiResponse(200, review, "Review deleted successfully"))
})

//Update a review
const updateReview = asyncHandler(async (req, res) => {

    const {title, rating} = req.body
    const {reviewId} = req.params

    if(!isValidObjectId(reviewId)){
        throw new apiError(403, "Review does not exists")
    }

    const updateFields = {}

    if(title) updateFields.title = title
    if(rating) updateFields.rating = rating

    const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        {
            $set: {
                ...updateFields
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(new apiResponse(200, updatedReview, "Review updated successfully"))
})

//Search all reviews of a user
const serachAllReviewOfUser = asyncHandler(async (req, res) => {

    const {page = 1, limit = 10} = req.query

    const reviews = await Review.find({createdBy: req.user?._id}).sort("-createdAt").skip((page-1) * limit).limit(Number(limit))

    return res
        .status(200)
        .json(new apiResponse(200, reviews, "Reviews of a user fetch successfully"))
})

//Search all reviews of a post
const searchAllReviewOfPost = asyncHandler(async (req, res) => {

    const {postId} = req.params
    const {page = 1, limit = 10} = req.query

    const reviews = await Review.find({onWhich: postId}).sort("createdAt").skip((page -1 ) * limit).limit(Number(limit))

    return res
        .status(200)
        .json(new apiResponse(200, reviews, "Reviews of a post fetch successfully"))
})

export {createReview, deleteReview, updateReview, serachAllReviewOfUser, searchAllReviewOfPost}
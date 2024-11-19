import { Post } from '../model/post.model.js';
import { apiError } from '../util/apiError.js';
import { apiResponse } from '../util/apiResponse.js';
import {asyncHandler} from '../util/asyncHandler.js'
import { uploadOnCloudinary } from '../util/uploadOnCloudinary.js';

//create a post
const createPost = asyncHandler(async (req, res) => {

    const {title, description, category, location} = req.body;
    const photoPath = req.file?.path
    let photo

    if(!title || !description || !category || !location || !location.coordinates){
        throw new apiError(403, "Important fields are required")
    }

    if(photoPath){
        try {
            photo = await uploadOnCloudinary(photoPath);
        } catch (error) {
            throw new apiError(500, "Something went wrong while uploading the image")
        }
    }

    const post = await Post.create({
        title,
        description,
        category,
        location: {
            type: 'Point',
            coordinates
        },
        photo,
        createdBy: req.user?._id
    })

    return res
        .status(200)
        .json(new apiResponse(200, post, "Post created successfully"))
})

//delete a post
const deletePost = asyncHandler(async (req, res) => {

    const postId = req.params

    const post = await Post.findById({postId})

    if(!post){
        throw new apiError(403, "Post does not exists")
    }

    if(post.createdBy !== req.user?._id){
        throw new apiError(403, "Invalid request")
    }

    await Post.findByIdAndDelete({postId});

    return res
        .status(200)
        .json(new apiResponse(200, post, "Post deleted successfully"))
})

//update a post
const updatePost = asyncHandler(async (req, res) => {

    const {title, description, category, location} = req.body
    const {postId} = req.params

    const updateFields = {}

    if(title) updateFields.title = title
    if(description) updateFields.description = description
    if(category) updateFields.category = category
    if(location) updateFields.location = location

    const updatedPost = await Post.findByIdAndUpdate(
        postId,
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
        .json(new apiResponse(200, updatedPost, "Post updated successfully"))
})

//search all post of a user
const searchAllPostOfUer = asyncHandler(async (req, res) => {

    const {page, limit} = req.query
    const posts = await Post.find({createdBy: req.user?._id}).sort("-createdAt").skip((page-1) * limit).limit(Number(limit))

    return res
        .status(200)
        .json(new apiResponse(200, posts, "All posts fetch successfully"))
})

//search a post based on the location
const searchAllPostBasedOnLocation = asyncHandler(async (req, res) => {

    const {location, category} = req.body
    const {page, limit} = req.query

    if(!location){
        throw new apiError(403, "Location is required")
    }

    const query = { location };
    if (category) query.category = category;

    const posts = await Post.find({query}).sort("-createdAt").skip((page - 1) * limit).limit(Number(limit))

    return res
        .status(200)
        .json(new apiResponse(200, posts, "Posts fetch successfully"))
})

export {createPost, deletePost, updatePost, searchAllPostOfUer, searchAllPostBasedOnLocation}
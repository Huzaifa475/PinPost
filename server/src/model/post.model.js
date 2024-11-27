import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: [
            'Restaurants',
            'Cafes',
            'Sports Venues',
            'Parks',
            'Movie Theaters',
            'Malls',
            'Museums',
            'Beaches',
            'Libraries',
            'Festivals',
            'Other'
        ],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    photo: {
        type: String,
        default: undefined
    }
}, {timestamps: true})

export const Post = mongoose.model("Post", postSchema)
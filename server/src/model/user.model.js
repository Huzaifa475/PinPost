import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
        required: function() {
            return !this.isGoogleUser
        }
    },
    password: {
        type: String,
        required: function () {
            return !this.isGoogleUser;
        }
    },
    address: {
        area: {
            type: String
        },
        street: {
            type: String
        },
        city: {
            type: String
        }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    photo: {
        type: String,
        default: null
    },
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    refreshToken: {
        type: String,
        default: null
    }
}, {timestamps: true})

userSchema.index({location: '2dsphere'})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isValidPassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    return (
        jwt.sign(
            {
                _id: this._id,
                name: this.name,
                Location: this.location
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    )
}

userSchema.methods.generateRefreshToken = function() {
    return (
        jwt.sign(
            {
                _id: this._id,
                name: this._name,
                location: this._location
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    )
}

export const User = mongoose.model("User", userSchema)
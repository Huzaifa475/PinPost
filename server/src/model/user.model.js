import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config({
    path: './.env'
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
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
            return this.isGoogleUser;
        }
    },
    password: {
        type: String,
        required: function () {
            return !this.isGoogleUser;
        }
    },
    address: {
        type: String
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
    refreshToken: {
        type: String,
        default: null
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTokenExpiry: {
        type: Date
    },
    passwordChangedAt: {
        type: Date
    }
}, {timestamps: true})

userSchema.index({location: '2dsphere'})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function() {
    return (
        jwt.sign(
            {
                _id: this._id,
                name: this.name,
                location: this.location
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    )
}

userSchema.methods.generateRefreshToken = async function() {
    return (
        jwt.sign(
            {
                _id: this._id,
                name: this.name,
                location: this.location
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    )
}

userSchema.methods.createResetPasswordToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.passwordResetTokenExpiry = Date.now() + 10 * 60 * 1000

    return resetToken
}

export const User = mongoose.model("User", userSchema)
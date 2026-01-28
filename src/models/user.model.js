import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String, //cloudnary service
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory: [{
        type: Schema.Types.ObjectId, //always ref after this
        ref: "Video"
    }],
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true })

//hooks of mongoose (pre = to do something just before the event (here - saving password))
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})
//comparing password using bcrypt
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

//this is for generating access token
userSchema.methods.generateAceessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },
        process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}
///this is for generating refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },
        process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User = mongoose.model("User", userSchema)
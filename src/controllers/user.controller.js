import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {

    //get user details from frontend
    const { username, email, password, fullName } = req.body
    console.log("Email: ", email);

    //validations - no empty
    if (
        [fullName, email, password, username].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    //check for user existence: from username and email
    const existedUser = await User.findOne({ $or: [{ username }, { email }] })
    if(existedUser){
        throw new ApiError(409, "User already exists");
    }
    
    //files - avtar + coverimage
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }
    
    //upload to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400, "Avatar upload failed");
    }

    //create user object
    const user = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    //remove password and refreshToken from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    //check for user creation
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user");
    }
    
    //save user in db
    await user.save()   

    //return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
    
})

export { registerUser }

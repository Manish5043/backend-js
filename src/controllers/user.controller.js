import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req,res) => {
    // get user details from froentend
    //validation-not empty
    // check is user already exists: username, email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    //create user object-create entry in db
    // remove password and refresh token field from response
    //check for user creation
    //return res

    const {fullname, email, username,password} = req.body
    console.log("email: ", email);

    // if(fullname === "") {
    //     throw new ApiError(400, "fullname is required")
    // }

    if(
        [fullname, email, username, password].some((field) => 
        field?.trim() === "")
    ) {
        throw new ApiError(400, "ALL fields are required")
    }

    const existedUser = User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    // code functionalities written within multer properties
    const avatarlocalpath = req.files?.avatar[0]?.path;
    const coveriamgelocalpath = req.files?.coverImage[0]?.path;

    if (!avatarlocalpath) {
        throw new ApiError(400, "Avatar files is required")
    }

    const avatar = await uploadOnCloudinary(avatarlocalpath);
    const coverImage = await uploadOnCloudinary(coveriamgelocalpath);

    if(!avatar) {
        throw new ApiError(400, "Avatar files is required")
    }

    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createduser = await User.findById(user._id).select(
        // isme kya nhi chahiye wo daalte h
        "-password -refreshToken"
    )

    if (!createduser) {
        throw new ApiError(500,"something went wrong while registering the user" )
    }

    return res.status(201).json(
        new ApiResponse(200, createduser, "USER registered successfully")
    )

})


export {registerUser}
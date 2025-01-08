import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {jwt} from "jsonwebtoken"

// asynhandler mainly web request ke liye hote ha to uska bhi dhyan rakhein



const generateaccessandrefreshtokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})


        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}

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
    // console.log("email: ", email);

    // if(fullname === "") {
    //     throw new ApiError(400, "fullname is required")
    // }

    if(
        [fullname, email, username, password].some((field) => 
        field?.trim() === "")
    ) {
        throw new ApiError(400, "ALL fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // actual mein muter req ke saath files ka access de deta hai
    // code functionalities written within multer properties
    const avatarlocalpath = req.files?.avatar[0]?.path;
    //const coveriamgelocalpath = req.files?.coverImage[0]?.path;

    let coverimagelocalpath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverimagelocalpath = req.files.coverImage[0].path

    }

    if (!avatarlocalpath) {
        throw new ApiError(400, "Avatar files is required")
    }

    const avatar = await uploadOnCloudinary(avatarlocalpath);
    const coverImage = await uploadOnCloudinary(coverimagelocalpath);

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


const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send token as cookies

    const {email, username, password} = req.body

    if (!(username || email)) {
        throw new ApiError(400, "username or email is required")    
    }

    const user = await User.findOne({
        // these are mainly mongodb operators
        $or: [{username}, {email}]
    })
// findone or updateone ye mongodb ke mongoose ke methods h jo humne capital mein user object banaya h uske to uska dhyan rakhe

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }


    const {accessToken, refreshToken}= await generateaccessandrefreshtokens(user._id)


    const loggedInuser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }


    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInuser,accessToken,refreshToken
            },
            "User logged in Successfully"
        )
        // actually mein jo humne upar likha ha usko destructure aise h ki pahle statuscode diya gya uske baat data jo humne define kiya tha apirepsone wali file mein aur end me message dediya hai humne
    )


})

const logoutUser = asyncHandler(async(req, res)=> {
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
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

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken").json(new ApiResponse(200, {}, "User logged out"))
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    // ko body wala req h wo mainly mobile apps ke liye h

    if (incomingRefreshToken) {
        throw new ApiError(401, "unathorized request")
    }

    //user ke pass jo token pahonchta hai wo
    //encrypted token  hota hai aur databse mein jo save token hota hai wo alag hota hai isiliye hum log jwt verify karwate hai. database me jo token save hota hai wo raw token hota hai jo hume chahiye

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is expired or used")
        }
    
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
    
        const {accessToken, NewrefreshToken} = await generateaccessandrefreshtokens(user._id)
    
    
        return res.status(200).
        cookie("accessToken", accessToken, options ).
        cookie("refreshToken", NewrefreshToken, options).json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: NewrefreshToken},
                "Access token refreshed"
                
            )
    
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }



})


export {registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}
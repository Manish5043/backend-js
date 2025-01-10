import mongoose, {isValidObjectId} from "mongoose";
import {video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from  "../utils/ApiError.js"
import {ApiError} from  "../utils/ApiError.js"
import {ApiResponse} from  "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const getAllvideos = asyncHandler(async(req, res) => {
    const{page = 1, limit = 10, query, sortby, sortType, userId } =req.query
    // todo get all videos  based on query, sort , pagination
}) 

const publishAVideo = asyncHandler(async(req, res) => {
    const {title, description}  = req.body
    // todo get video, upload to cloudinary, crete video
})

const getVideoById = asyncHandler(async(req, res) => {
    const {videoId} = req.params
    // todo get video by id
})

const updateVideo = asyncHandler(async(req, res) => {
    const { videoId} = req.params
    //todo update video details like title, description , thumbnail
})

const deleteVideo = asyncHandler(async(req, res) => {
    const {videoId} = req.params
    // todo delete video
})

const togglePublishStatus = asyncHandler(async(req, res) =>{
    const {videoId}  = req.params
})

export {
    getAllvideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
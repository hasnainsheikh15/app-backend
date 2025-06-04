import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import mongoose from "mongoose";

const toggleVideoLike = asyncHandler(async(req , res) => {
    const {videoId} = req.params;
    const userId = req.user?.id;

    if (!videoId || !userId) {
        throw new ApiError(400, "Video ID and User ID are required");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const isLiked = await Like.findOne({video: videoId , likedBy: userId});

    if(isLiked) {
        await Like.deleteOne();
        return res.status(201).json(
            new ApiResponse(200 , {videoId,userId},"Video unliked successfully")
        )
    }

    else {
        await Like.create({
            video : videoId,
            likedBy : userId
        })
        return res.status(201).json(
            new ApiResponse(201 , {videoId,userId},"Video liked successfully")
        )

    }

    
})

const toggleCommentLike = asyncHandler(async(req,res) => {
    const {commentId} = req.params;
    const userId = req.user?._id;

    if (!commentId || !userId) {
        throw new ApiError(400, "Comment ID and User ID are invalid");
    }

    const isLiked = await Like.findOne({comment:commentId,likedBy:userId});

    if(isLiked){
        await Like.deleteOne();
        return res.status(201).json(
            new ApiResponse(200, {commentId, userId}, "Comment unliked successfully")
        )
    }
    else {
        await Like.create({
            comment : commentId,
            likedBy : userId
        })

        return res.status(201).json(
            new ApiResponse(201, {commentId, userId}, "Comment liked successfully")
        )
    }
})

const toggleTweetLike = asyncHandler(async(req,res) => {
    const {tweetId} = req.params;
    const userId = req.user?._id;

    if (!tweetId || !userId) {
        throw new ApiError(400, "Tweet ID and User ID are invalid");
    }
    const isLiked = await Like.findOne({tweet:tweetId,likedBy:userId});
    if(isLiked){
        await Like.deleteOne();
        return res.status(201).json(
            new ApiResponse(200, {tweetId, userId}, "Tweet unliked successfully")
        )
    }
    else {
        await Like.create({
            tweet : tweetId,
            likedBy : userId
        })

        return res.status(201).json(
            new ApiResponse(201, {tweetId, userId}, "Tweet liked successfully")
        )
    }
})

const getLikedVideos = asyncHandler(async(req,res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User ID is invalid");
    }

    const likedVideos = await Like.aggregate([
        {$match : {likedBy : new mongoose.Types.ObjectId(userId)}},
        {
            $lookup : {
                from : "videos",
                localField : "video",
                foreignField : "_id",
                as : "videoDetails"
            }
        },
        {
            $addFields : {
                videoDetails : {$first : "$videoDetails"}
            }
        },
        {
            $project : {
                title : "$videoDetails.title",
                description : "$videoDetails.description",
                thumbnail : "$videoDetails.thumbnail",
                owner : "$videoDetails.owner",

            }
        }
    ])

    if (likedVideos.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No liked videos found")
        )
    }

    const totalLikedVideos = likedVideos.length;

    return res.status(201).json(
        new ApiResponse(201,{likedVideos , totalLikedVideos}, "Liked videos retrieved successfully")
    )
})

export { toggleVideoLike , toggleCommentLike , getLikedVideos, toggleTweetLike };
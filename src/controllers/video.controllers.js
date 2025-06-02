import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userId,
  } = req.query;

  const filter = {}; // mongoDb filter object initialized it can be named anything as you wish not necessary to be filter only

  if (query) {
    filter.title = { $regex: query, $options: "i" }; //case insensitive search
  }

  if (userId) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user ID format");
    }
    filter.owner = userId; // filter by user ID
  }

  const sortDirection = sortType === "asc" ? 1 : -1; // 1 is for ascending and -1 is for descending order
  const sortLike = { [sortBy]: sortDirection };

  const videos = await Video.aggregate([
    { $match: filter },
    { $sort: sortLike },
    { $skip: (page - 1) * limit },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    {
      $addFields: {
        ownerDetails: { $first: "$ownerDetails" },
      },
    },
    {
      $project: {
        // "ownerDetails.__v" : 0,
        "ownerDetails.fullName": 1,
        "ownerDetails.avatar": 1,
      },
    },
  ]);

  const totalVideos = await Video.countDocuments(filter);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { videos, totalVideos, page: parseInt(page) },
        "Videos fetched successfully"
      )
    );
});

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "title and description are required");
  }
//   console.log(req.files);
  if (!req.files || !req.files?.video?.[0] || !req.files?.thumbnail?.[0]) {
    throw new ApiError(
      400,
      "Video file, thumbnail and video file are required"
    );
  }

  

  const videoLocalPath = req.files?.video[0]?.path;

  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);
  if (!videoFile || !thumbnailFile) {
    throw new ApiError(
      500,
      "Failed to upload video or thumbnail on cloudinary"
    );
  }

  const video = await Video.create({
    title,description,
    videoFile: videoFile?.url,
    thumbnail: thumbnailFile?.url,
    owner : req.user._id,
    duration : videoFile?.duration
  })

  if(!video) {
    throw new ApiError(500, "Failed to create video");
  }

  return res.status(201).json(
    new ApiResponse(201, video, "Video published successfully")
  )
});


export { getAllVideos , publishVideo };

import mongoose from "mongoose";
import { asyncHandler } from "../utils/asynchandler.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  // if(!mongoose.isValidObjectId(req.user._id)) {
  //     throw new Error("Invalid user ID format");
  // }
  const owner = req.user?._id;
  console.log("Owner ID:", owner);

  if (!owner || !mongoose.isValidObjectId(owner)) {
    throw new ApiError(400, "Invalid user ID format");
  }

  if (!content) {
    throw new ApiError("Content is required");
  }

  const tweet = await Tweet.create({ content, owner });

  if (!tweet) {
    throw new Error("Failed to create tweet");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID format");
  }

  const tweet = await Tweet.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $project: {
        content: 1,
        createdAt: 1,
        userDetails: {
          $first: "$userDetails",
        },
      },
    },
  ]);

  const totalTweets = tweet.length;
  if (totalTweets === 0) {
    return res.status(404).json(new ApiResponse(404, null, "No tweets found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, `Total ${totalTweets} tweets found`));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { newContent } = req.body;

  if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet ID format");
  }

  if (!newContent) {
    throw new ApiError(400, "New Content is not given for update");
  }

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      content: newContent,
    },
    { new: true }
  );

  if (!tweet) {
    throw new ApiError(404, "Unable to find the Tweet or to update the Tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid Tweet ID format");
  }

  const tweet = await Tweet.findByIdAndDelete(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Unable to find the Tweet or to delete the Tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
